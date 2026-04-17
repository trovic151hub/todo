import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  collection, addDoc, deleteDoc, doc, updateDoc,
  serverTimestamp, query, where, orderBy, onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Search, SortDesc, Trash2 } from "lucide-react";
import { auth, db } from "../firebase";
import { useToast } from "../context/ToastContext";

import Header    from "./Header";
import TodoInput from "./TodoInput";
import TodoList  from "./TodoList";
import Footer    from "./Footer";
import Confetti  from "./Confetti";

const PRESET_CATEGORIES = ["General", "Work", "Personal", "Shopping", "School"];
const todosCol = collection(db, "todos");

// How many days ago a due date was, as readable text
function dueDeltaText(dateStr) {
  const due = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((today - due) / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days <= 7)  return `${days} days ago`;
  return `on ${due.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

export default function TodoApp({ user }) {
  const uid = user.uid;
  const { addToast } = useToast();

  const [todos,     setTodos]     = useState([]);
  const [filter,    setFilter]    = useState("all");
  const [catFilter, setCatFilter] = useState("All");
  const [search,    setSearch]    = useState("");
  const [sort,      setSort]      = useState("newest");
  const [dark,      setDark]      = useState(() => {
    const saved = localStorage.getItem("todo-dark");
    return saved ? JSON.parse(saved) : false;
  });
  const [density, setDensity] = useState(() =>
    localStorage.getItem("todo-density") || "comfortable"
  );

  useEffect(() => {
    localStorage.setItem("todo-density", density);
  }, [density]);

  const cycleDensity = () =>
    setDensity(d =>
      d === "compact" ? "comfortable" : d === "comfortable" ? "spacious" : "compact"
    );
  const [loading,       setLoading]       = useState(true);
  const [showConfetti,  setShowConfetti]  = useState(false);
  const prevActiveRef = useRef(null);
  const [notifPerm, setNotifPerm] = useState(
    "Notification" in window ? Notification.permission : "unsupported"
  );

  // Theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("todo-dark", JSON.stringify(dark));
  }, [dark]);

  // Page title
  useEffect(() => {
    const active = todos.filter(t => !t.completed).length;
    document.title = active > 0 ? `(${active}) To-Do` : "To-Do";
    return () => { document.title = "To-Do"; };
  }, [todos]);

  // Confetti — fires when the last active task is completed
  useEffect(() => {
    if (loading) return;
    const active = todos.filter(t => !t.completed).length;
    const total  = todos.length;
    if (prevActiveRef.current !== null && prevActiveRef.current > 0 && active === 0 && total > 0) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(t);
    }
    prevActiveRef.current = active;
  }, [todos, loading]);

  // Realtime listener
  useEffect(() => {
    setLoading(true);
    const q = query(todosCol, where("uid", "==", uid), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setTodos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error("onSnapshot error", err);
      setLoading(false);
    });
    return () => unsub();
  }, [uid]);

  // ── Notification permission request ──────────────────────────
  const requestNotifPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      addToast("Your browser doesn't support notifications.", "error");
      return;
    }
    if (Notification.permission === "granted") {
      addToast("Notifications are already enabled.", "info");
      return;
    }
    if (Notification.permission === "denied") {
      addToast("Notifications are blocked. Please enable them in your browser settings.", "error");
      return;
    }
    const perm = await Notification.requestPermission();
    setNotifPerm(perm);
    if (perm === "granted") {
      addToast("Notifications enabled! You'll be alerted when tasks are due.", "success");
    } else {
      addToast("Notification permission denied.", "error");
    }
  }, [addToast]);

  // Ask for permission automatically on first login (once per session)
  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      // Small delay so the UI settles before the browser dialog appears
      const t = setTimeout(() => {
        Notification.requestPermission().then(perm => setNotifPerm(perm));
      }, 1500);
      return () => clearTimeout(t);
    }
  }, []);

  // ── Due-task checker (runs every 60 s while app is open) ─────
  useEffect(() => {
    if (!("Notification" in window) || !todos.length) return;

    const check = () => {
      if (Notification.permission !== "granted") return;

      const todayStr = new Date().toISOString().split("T")[0];
      const key = `notified-${uid}-${todayStr}`;
      const alreadyNotified = new Set(JSON.parse(localStorage.getItem(key) || "[]"));
      const newlyNotified = [];

      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);

      todos.forEach(todo => {
        if (!todo.dueDate || todo.completed || alreadyNotified.has(todo.id)) return;

        const due = new Date(todo.dueDate + "T00:00:00");
        if (due > todayMidnight) return; // not due yet

        const overdue = due < todayMidnight;
        const title   = overdue ? "⚠️ Overdue Task" : "📋 Task Due Today";
        const body    = overdue
          ? `"${todo.text}" was due ${dueDeltaText(todo.dueDate)} — still pending!`
          : `"${todo.text}" is due today!`;

        const notif = new Notification(title, {
          body,
          icon:  "/favicon.svg",
          badge: "/favicon.svg",
          tag:   todo.id, // browser deduplicates by tag
        });

        notif.onclick = () => { window.focus(); notif.close(); };
        newlyNotified.push(todo.id);
      });

      if (newlyNotified.length > 0) {
        localStorage.setItem(key, JSON.stringify([...alreadyNotified, ...newlyNotified]));
      }
    };

    check(); // run immediately when todos load
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, [todos, uid]);

  // Stats
  const totalCount     = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount    = totalCount - completedCount;
  const pct            = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const usedCategories = useMemo(() => {
    const cats = new Set(todos.map(t => t.category || "General"));
    return ["All", ...PRESET_CATEGORIES.filter(c => cats.has(c))];
  }, [todos]);

  // CRUD
  const addTodo = async (text, category = "General", dueDate = null, priority = null) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await addDoc(todosCol, {
      text: trimmed, completed: false, uid, category,
      dueDate: dueDate || null, priority: priority || null,
      createdAt: serverTimestamp(),
    });
    addToast("Task added!", "success");
  };

  const toggleTodo = async (id) => {
    const t = todos.find(x => x.id === id);
    if (!t) return;
    const nowDone = !t.completed;
    await updateDoc(doc(db, "todos", id), { completed: nowDone });
    if (nowDone) addToast("Task completed! 🎉", "success");
  };

  const editTodo = async (id, newText, newCategory, newDueDate, newPriority = null) => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    await updateDoc(doc(db, "todos", id), {
      text: trimmed, category: newCategory,
      dueDate: newDueDate || null, priority: newPriority || null,
    });
    addToast("Task updated.", "info");
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    addToast("Task deleted.", "error");
  };

  const clearCompleted = async () => {
    const done = todos.filter(t => t.completed);
    if (!done.length) return;
    await Promise.all(done.map(t => deleteDoc(doc(db, "todos", t.id))));
    addToast(`Cleared ${done.length} completed task${done.length !== 1 ? "s" : ""}.`, "info");
  };

  // Processed list
  const processedTodos = useMemo(() => {
    let list = [...todos];
    if (filter === "active")    list = list.filter(t => !t.completed);
    if (filter === "completed") list = list.filter(t =>  t.completed);
    if (catFilter !== "All")    list = list.filter(t => (t.category || "General") === catFilter);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(t =>
        (t.text     && t.text.toLowerCase().includes(s)) ||
        (t.category && t.category.toLowerCase().includes(s))
      );
    }
    const PRIO_ORDER = { High: 0, Medium: 1, Low: 2 };
    if (sort === "newest")    list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    if (sort === "oldest")    list.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
    if (sort === "az")        list.sort((a, b) => (a.text || "").localeCompare(b.text || ""));
    if (sort === "completed") list.sort((a, b) => (b.completed === a.completed ? 0 : b.completed ? -1 : 1));
    if (sort === "priority")  list.sort((a, b) => (PRIO_ORDER[a.priority] ?? 3) - (PRIO_ORDER[b.priority] ?? 3));
    return list;
  }, [todos, filter, catFilter, search, sort]);

  const isFiltered = filter !== "all" || catFilter !== "All" || search.trim() !== "";

  return (
    <div className={`app density-${density}`}>
      <Confetti active={showConfetti} />
      <Header
        user={user}
        onSignOut={() => signOut(auth)}
        dark={dark}
        setDark={setDark}
        notifPerm={notifPerm}
        onRequestNotif={requestNotifPermission}
        density={density}
        onCycleDensity={cycleDensity}
      />

      <main className="card main-card">
        <TodoInput addTodo={addTodo} categories={PRESET_CATEGORIES} />

        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="progress-section">
            <div className="progress-header">
              <span className="progress-label">{completedCount} of {totalCount} tasks done</span>
              <span className="progress-pct">{pct}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${pct}%` }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        )}

        {/* Search + Sort */}
        <div className="controls-row">
          <div className="search-wrap">
            <Search size={15} className="search-icon" />
            <input
              className="search"
              placeholder="Search tasks or categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="sort-wrap">
            <SortDesc size={15} className="sort-icon" />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">A → Z</option>
              <option value="priority">Priority</option>
              <option value="completed">Completed first</option>
            </select>
          </div>
        </div>

        {/* Status filter */}
        <div className="filter-row">
          <div className="filters">
            {["all", "active", "completed"].map(f => (
              <button
                key={f}
                className={`btn filter${filter === f ? " active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all"       ? `All ${totalCount > 0 ? `(${totalCount})` : ""}` :
                 f === "active"    ? `Active (${activeCount})` :
                                     `Done (${completedCount})`}
              </button>
            ))}
          </div>
          {completedCount > 0 && (
            <button className="btn small danger" onClick={clearCompleted}>
              <Trash2 size={13} /> Clear done
            </button>
          )}
        </div>

        {/* Category filter pills */}
        {usedCategories.length > 2 && (
          <div className="cat-filter-row">
            {usedCategories.map(c => (
              <button
                key={c}
                className={`btn cat-pill${catFilter === c ? " active" : ""}`}
                onClick={() => setCatFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Task list */}
        {loading ? (
          <div className="loading-center">
            <div className="spinner" />
            <p className="muted">Syncing tasks…</p>
          </div>
        ) : (
          <TodoList
            todos={processedTodos}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            isFiltered={isFiltered}
          />
        )}
      </main>

      <Footer count={activeCount} total={totalCount} completed={completedCount} />
    </div>
  );
}
