import { useState, useEffect, useMemo } from "react";
import {
  collection, addDoc, deleteDoc, doc, updateDoc,
  serverTimestamp, query, where, orderBy, onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Search, SortDesc, Trash2 } from "lucide-react";
import { auth, db } from "../firebase";
import { useToast } from "../context/ToastContext";

import Header   from "./Header";
import TodoInput from "./TodoInput";
import TodoList  from "./TodoList";
import Footer   from "./Footer";

const PRESET_CATEGORIES = ["General", "Work", "Personal", "Shopping", "School"];
const todosCol = collection(db, "todos");

export default function TodoApp({ user }) {
  const uid = user.uid;
  const { addToast } = useToast();

  const [todos,     setTodos]     = useState([]);
  const [filter,    setFilter]    = useState("all");    // all | active | completed
  const [catFilter, setCatFilter] = useState("All");    // All | category name
  const [search,    setSearch]    = useState("");
  const [sort,      setSort]      = useState("newest"); // newest | oldest | az | completed
  const [dark,      setDark]      = useState(() => {
    const saved = localStorage.getItem("todo-dark");
    return saved ? JSON.parse(saved) : false;
  });
  const [loading, setLoading] = useState(true);

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

  // Stats
  const totalCount     = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount    = totalCount - completedCount;
  const pct            = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Used categories (for filter pills)
  const usedCategories = useMemo(() => {
    const cats = new Set(todos.map(t => t.category || "General"));
    return ["All", ...PRESET_CATEGORIES.filter(c => cats.has(c))];
  }, [todos]);

  // CRUD
  const addTodo = async (text, category = "General", dueDate = null) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await addDoc(todosCol, {
      text: trimmed, completed: false, uid, category,
      dueDate: dueDate || null, createdAt: serverTimestamp(),
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

  const editTodo = async (id, newText, newCategory, newDueDate) => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    await updateDoc(doc(db, "todos", id), {
      text: trimmed, category: newCategory, dueDate: newDueDate || null,
    });
    addToast("Task updated.", "info");
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    addToast("Task deleted.", "error");
  };

  const clearCompleted = async () => {
    const done = todos.filter(t => t.completed);
    if (done.length === 0) return;
    await Promise.all(done.map(t => deleteDoc(doc(db, "todos", t.id))));
    addToast(`Cleared ${done.length} completed task${done.length !== 1 ? "s" : ""}.`, "info");
  };

  // Processed list
  const processedTodos = useMemo(() => {
    let list = [...todos];
    if (filter === "active")    list = list.filter(t => !t.completed);
    if (filter === "completed") list = list.filter(t => t.completed);
    if (catFilter !== "All")    list = list.filter(t => (t.category || "General") === catFilter);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(t =>
        (t.text     && t.text.toLowerCase().includes(s)) ||
        (t.category && t.category.toLowerCase().includes(s))
      );
    }
    if (sort === "newest")    list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    if (sort === "oldest")    list.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
    if (sort === "az")        list.sort((a, b) => (a.text || "").localeCompare(b.text || ""));
    if (sort === "completed") list.sort((a, b) => (b.completed === a.completed ? 0 : b.completed ? -1 : 1));
    return list;
  }, [todos, filter, catFilter, search, sort]);

  const isFiltered = filter !== "all" || catFilter !== "All" || search.trim() !== "";

  return (
    <div className="app">
      <Header user={user} onSignOut={() => signOut(auth)} dark={dark} setDark={setDark} />

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
                {f === "all" ? `All ${totalCount > 0 ? `(${totalCount})` : ""}` :
                 f === "active" ? `Active (${activeCount})` :
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
