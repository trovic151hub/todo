import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  collection, addDoc, deleteDoc, doc, updateDoc,
  serverTimestamp, query, where, orderBy, onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import {
  SortDesc, Trash2, MousePointerClick, CheckCheck, X,
  CalendarDays, AlertTriangle, Flame, CheckCircle2, ListTodo, Folder,
  ChevronUp, ChevronDown,
} from "lucide-react";
import { auth, db } from "../firebase";
import { useToast } from "../context/ToastContext";

import Sidebar           from "./Sidebar";
import TopBar            from "./TopBar";
import HeroBand          from "./HeroBand";
import TodoInput         from "./TodoInput";
import TodoList          from "./TodoList";
import Confetti          from "./Confetti";
import NotificationPanel from "./NotificationPanel";

const PRESET_CATEGORIES = ["General", "Work", "Personal", "Shopping", "School"];
const todosCol = collection(db, "todos");

const CAT_COLORS = {
  General:  { bg: "rgba(154, 160, 180, 0.15)", fg: "#5A5C6B" },
  Work:     { bg: "rgba(139, 143, 232, 0.15)", fg: "#5A5FCF" },
  Personal: { bg: "rgba(20, 184, 166, 0.15)",  fg: "#0F766E" },
  Shopping: { bg: "rgba(217, 119, 6, 0.15)",   fg: "#B45309" },
  School:   { bg: "rgba(244, 114, 182, 0.18)", fg: "#BE185D" },
};

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
  const [selectMode,    setSelectMode]    = useState(false);
  const [selectedIds,   setSelectedIds]   = useState(new Set());
  const [quickAddOpen,  setQuickAddOpen]  = useState(true);
  const prevActiveRef = useRef(null);
  const quickAddRef   = useRef(null);

  const toggleSelect = (id) =>
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleSelectAll = (visibleTodos) => {
    const allSelected = visibleTodos.every(t => selectedIds.has(t.id));
    setSelectedIds(allSelected ? new Set() : new Set(visibleTodos.map(t => t.id)));
  };

  const exitSelectMode = () => { setSelectMode(false); setSelectedIds(new Set()); };

  const bulkComplete = async () => {
    const incomplete = [...selectedIds].filter(id => {
      const t = todos.find(x => x.id === id);
      return t && !t.completed;
    });
    await Promise.all(incomplete.map(id => updateDoc(doc(db, "todos", id), { completed: true })));
    addToast(`Completed ${incomplete.length} task${incomplete.length !== 1 ? "s" : ""}.`, "success");
    exitSelectMode();
  };

  const bulkDelete = async () => {
    const ids = [...selectedIds];
    await Promise.all(ids.map(id => deleteDoc(doc(db, "todos", id))));
    addToast(`Deleted ${ids.length} task${ids.length !== 1 ? "s" : ""}.`, "error");
    exitSelectMode();
  };

  const [notifPerm, setNotifPerm] = useState(
    "Notification" in window ? Notification.permission : "unsupported"
  );
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [snoozedUntil, setSnoozedUntil] = useState(() =>
    localStorage.getItem(`tendril-notif-snooze-${uid}`) || null
  );

  // Theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("todo-dark", JSON.stringify(dark));
  }, [dark]);

  // Page title
  useEffect(() => {
    const active = todos.filter(t => !t.completed).length;
    document.title = active > 0 ? `(${active}) Tendril` : "Tendril";
    return () => { document.title = "Tendril"; };
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
      try {
        new Notification("🌱 Tendril notifications enabled", {
          body: "We'll let you know when tasks are due.",
          icon: "/favicon.svg",
          tag: "tendril-welcome",
        });
      } catch {}
    } else {
      addToast("Notification permission denied.", "error");
    }
  }, [addToast]);

  // Send a test notification (used from the in-app panel)
  const sendTestNotification = useCallback(() => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      addToast("Enable browser notifications first.", "info");
      return;
    }
    try {
      const n = new Notification("🌱 Tendril test notification", {
        body: "Notifications are working. You'll see one of these when a task is due.",
        icon: "/favicon.svg",
        tag: "tendril-test",
      });
      n.onclick = () => { window.focus(); n.close(); };
      addToast("Test notification sent.", "success");
    } catch (e) {
      addToast("Couldn't send a test notification.", "error");
    }
  }, [addToast]);

  // Snooze all notifications until end of today
  const snoozeForToday = useCallback(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const iso = end.toISOString();
    localStorage.setItem(`tendril-notif-snooze-${uid}`, iso);
    setSnoozedUntil(iso);
    addToast("Notifications snoozed until tomorrow.", "info");
  }, [uid, addToast]);

  // ── Due-task checker (runs every 60 s while app is open) ─────
  useEffect(() => {
    if (!("Notification" in window) || !todos.length) return;

    const check = () => {
      if (Notification.permission !== "granted") return;
      // Respect snooze
      if (snoozedUntil && new Date(snoozedUntil) > new Date()) return;

      const todayStr = new Date().toISOString().split("T")[0];
      const key = `notified-${uid}-${todayStr}`;
      const alreadyNotified = new Set(JSON.parse(localStorage.getItem(key) || "[]"));

      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);

      // Collect tasks needing a notification (due today or overdue, not yet notified)
      const pending = todos.filter(todo => {
        if (!todo.dueDate || todo.completed) return false;
        if (alreadyNotified.has(todo.id))    return false;
        const due = new Date(todo.dueDate + "T00:00:00");
        return due <= todayMidnight;
      });

      if (pending.length === 0) return;

      try {
        if (pending.length === 1) {
          const todo = pending[0];
          const due  = new Date(todo.dueDate + "T00:00:00");
          const overdue = due < todayMidnight;
          const title = overdue ? "⚠️ Overdue task" : "🌱 Task due today";
          const body  = overdue
            ? `"${todo.text}" was due ${dueDeltaText(todo.dueDate)} — still pending.`
            : `"${todo.text}" is due today.`;
          const n = new Notification(title, {
            body, icon: "/favicon.svg", badge: "/favicon.svg", tag: `tendril-${todo.id}`,
          });
          n.onclick = () => { window.focus(); n.close(); };
        } else {
          // Batched summary notification
          const overdueCount  = pending.filter(t => new Date(t.dueDate + "T00:00:00") < todayMidnight).length;
          const dueTodayCount = pending.length - overdueCount;
          const parts = [];
          if (overdueCount  > 0) parts.push(`${overdueCount} overdue`);
          if (dueTodayCount > 0) parts.push(`${dueTodayCount} due today`);
          const preview = pending.slice(0, 3).map(t => `• ${t.text}`).join("\n");
          const more = pending.length > 3 ? `\n…and ${pending.length - 3} more` : "";
          const n = new Notification(`🌱 Tendril · ${parts.join(" · ")}`, {
            body: `${preview}${more}`,
            icon: "/favicon.svg", badge: "/favicon.svg",
            tag: `tendril-summary-${todayStr}`,
          });
          n.onclick = () => { window.focus(); n.close(); };
        }

        const updated = [...alreadyNotified, ...pending.map(p => p.id)];
        localStorage.setItem(key, JSON.stringify(updated));
      } catch (err) {
        console.warn("Notification failed", err);
      }
    };

    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, [todos, uid, snoozedUntil]);

  // Stats
  const totalCount     = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount    = totalCount - completedCount;
  const todayStr       = new Date().toISOString().split("T")[0];

  const dashboardStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const categoryCounts = PRESET_CATEGORIES.map(category => ({
      category,
      count: todos.filter(t => (t.category || "General") === category).length,
    }));

    const dueTodayTasks = todos.filter(t => !t.completed && t.dueDate === todayStr);
    const overdueTasks  = todos.filter(t =>
      !t.completed && t.dueDate && new Date(t.dueDate + "T00:00:00") < today
    );

    return {
      dueToday:     dueTodayTasks.length,
      overdue:      overdueTasks.length,
      dueTodayTasks,
      overdueTasks,
      highPriority: todos.filter(t => !t.completed && t.priority === "High").length,
      recurring:    todos.filter(t => !t.completed && t.recurrence).length,
      categoryCounts,
    };
  }, [todos, todayStr]);

  // ── Recurrence helpers ──────────────────────────────────
  const getNextDueDate = (dueDate, recurrence) => {
    const base = dueDate ? new Date(dueDate + "T12:00:00") : new Date();
    if (recurrence === "Daily")   base.setDate(base.getDate() + 1);
    if (recurrence === "Weekly")  base.setDate(base.getDate() + 7);
    if (recurrence === "Monthly") base.setMonth(base.getMonth() + 1);
    return base.toISOString().split("T")[0];
  };

  const fmtShort = (dateStr) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });

  // ── CRUD ───────────────────────────────────────────────
  const addTodo = async (text, category = "General", dueDate = null, priority = null, color = null, recurrence = null) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await addDoc(todosCol, {
      text: trimmed, completed: false, uid, category,
      dueDate: dueDate || null, priority: priority || null,
      color: color || null, recurrence: recurrence || null,
      createdAt: serverTimestamp(),
    });
    addToast("Task added!", "success");
  };

  const toggleTodo = async (id) => {
    const t = todos.find(x => x.id === id);
    if (!t) return;
    const nowDone = !t.completed;

    if (nowDone && t.recurrence) {
      const nextDate = getNextDueDate(t.dueDate, t.recurrence);
      await updateDoc(doc(db, "todos", id), { dueDate: nextDate, completed: false });
      addToast(`↻ ${t.recurrence} · next due ${fmtShort(nextDate)}`, "info");
      return;
    }

    await updateDoc(doc(db, "todos", id), { completed: nowDone });
    if (nowDone) addToast("Task completed! 🎉", "success");
  };

  const editTodo = async (id, newText, newCategory, newDueDate, newPriority = null, newNote = null, newColor = null, newSubtasks = [], newRecurrence = null) => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    await updateDoc(doc(db, "todos", id), {
      text: trimmed, category: newCategory,
      dueDate: newDueDate || null, priority: newPriority || null,
      note: newNote || null, color: newColor || null,
      subtasks: newSubtasks || [], recurrence: newRecurrence || null,
    });
    addToast("Task updated.", "info");
  };

  const reorderTodos = async (reorderedList) => {
    await Promise.all(
      reorderedList.map((t, i) =>
        updateDoc(doc(db, "todos", t.id), { orderIndex: i })
      )
    );
  };

  const toggleSubtask = async (todoId, subtaskId) => {
    const t = todos.find(x => x.id === todoId);
    if (!t) return;
    const updated = (t.subtasks || []).map(s =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    await updateDoc(doc(db, "todos", todoId), { subtasks: updated });
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
    if (sort === "manual")    list.sort((a, b) => (a.orderIndex ?? 99999) - (b.orderIndex ?? 99999));
    return list;
  }, [todos, filter, catFilter, search, sort]);

  const isFiltered = filter !== "all" || catFilter !== "All" || search.trim() !== "";

  const onQuickAdd = () => {
    setQuickAddOpen(prev => {
      const next = !prev;
      if (next) {
        // scroll to input after toggle
        setTimeout(() => {
          quickAddRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          quickAddRef.current?.querySelector("input[type='text']")?.focus();
        }, 50);
      }
      return next;
    });
  };

  const usedCategoriesActive = dashboardStats.categoryCounts.filter(c => c.count > 0);

  return (
    <div className={`tendril-app density-${density}`}>
      <Confetti active={showConfetti} />

      <div className="tendril-shell">
        <Sidebar
          user={user}
          onSignOut={() => signOut(auth)}
          filter={filter}
          setFilter={setFilter}
          catFilter={catFilter}
          setCatFilter={setCatFilter}
          totalCount={totalCount}
          activeCount={activeCount}
          completedCount={completedCount}
          dueTodayCount={dashboardStats.dueToday}
          categoryCounts={dashboardStats.categoryCounts}
          onQuickAdd={onQuickAdd}
          quickAddOpen={quickAddOpen}
          dark={dark}
          setDark={setDark}
          density={density}
          onCycleDensity={cycleDensity}
          notifPerm={notifPerm}
          onRequestNotif={requestNotifPermission}
        />

        <div className="tendril-main">
          <div className="tendril-topbar-wrap">
            <TopBar
              search={search}
              setSearch={setSearch}
              user={user}
              notifPerm={notifPerm}
              hasUnread={dashboardStats.overdue > 0 || dashboardStats.dueToday > 0}
              onToggleNotifPanel={() => setNotifPanelOpen(o => !o)}
              notifPanelOpen={notifPanelOpen}
            />
            <NotificationPanel
              open={notifPanelOpen}
              onClose={() => setNotifPanelOpen(false)}
              overdueTasks={dashboardStats.overdueTasks}
              dueTodayTasks={dashboardStats.dueTodayTasks}
              notifPerm={notifPerm}
              onEnable={() => { requestNotifPermission(); }}
              onTest={sendTestNotification}
              onSnooze={snoozeForToday}
              snoozedUntil={snoozedUntil}
            />
          </div>

          <HeroBand
            uid={uid}
            activeCount={activeCount}
            totalCount={totalCount}
            dueToday={dashboardStats.dueToday}
            todos={todos}
          />

          <div className="tendril-content">
            {/* Quick stat cards */}
            <div className="tendril-stats">
              <div className="tendril-stat">
                <div className="tendril-stat-icon"><CalendarDays size={18} /></div>
                <span className="tendril-stat-label">Due today</span>
                <strong className="tendril-stat-value">{dashboardStats.dueToday}</strong>
              </div>
              <div className="tendril-stat danger">
                <div className="tendril-stat-icon"><AlertTriangle size={18} /></div>
                <span className="tendril-stat-label">Overdue</span>
                <strong className="tendril-stat-value">{dashboardStats.overdue}</strong>
              </div>
              <div className="tendril-stat warning">
                <div className="tendril-stat-icon"><Flame size={18} /></div>
                <span className="tendril-stat-label">High priority</span>
                <strong className="tendril-stat-value">{dashboardStats.highPriority}</strong>
              </div>
              <div className="tendril-stat success">
                <div className="tendril-stat-icon"><CheckCircle2 size={18} /></div>
                <span className="tendril-stat-label">Completed</span>
                <strong className="tendril-stat-value">{completedCount}</strong>
              </div>
            </div>

            {/* Tasks workspace + Categories rail */}
            <div className="tendril-cards-grid">
              <div className="tendril-card">
                <div className="tendril-card-header">
                  <div className="tendril-card-title">
                    <ListTodo size={18} />
                    Tasks
                    {totalCount > 0 && (
                      <span className="tendril-card-pill">
                        {filter === "completed" ? completedCount : activeCount} {filter === "completed" ? "done" : "open"}
                      </span>
                    )}
                  </div>
                  <button
                    className="tendril-icon-btn"
                    onClick={onQuickAdd}
                    title={quickAddOpen ? "Hide quick add" : "Show quick add"}
                    aria-label="Toggle quick add"
                  >
                    {quickAddOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {quickAddOpen && (
                  <div ref={quickAddRef}>
                    <TodoInput addTodo={addTodo} categories={PRESET_CATEGORIES} />
                  </div>
                )}

                {/* Filter row */}
                <div className="filter-row" style={{ marginBottom: 0, marginTop: 4 }}>
                  {selectMode ? (
                    <div className="select-mode-bar">
                      <label className="select-all-wrap">
                        <input
                          type="checkbox"
                          checked={processedTodos.length > 0 && processedTodos.every(t => selectedIds.has(t.id))}
                          onChange={() => toggleSelectAll(processedTodos)}
                          aria-label="Select all"
                        />
                        <span className="select-all-label">
                          {selectedIds.size > 0 ? `${selectedIds.size} selected` : "Select all"}
                        </span>
                      </label>
                      <button className="btn small secondary" onClick={exitSelectMode}>
                        <X size={13} /> Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="filters">
                        {["all", "active", "completed"].map(f => (
                          <button
                            key={f}
                            className={`btn filter${filter === f ? " active" : ""}`}
                            onClick={() => setFilter(f)}
                          >
                            {f === "all"    ? `All ${totalCount > 0 ? `(${totalCount})` : ""}` :
                             f === "active" ? `Active (${activeCount})` :
                                              `Done (${completedCount})`}
                          </button>
                        ))}
                      </div>
                      <div className="filter-actions">
                        <div className="sort-wrap">
                          <SortDesc size={15} className="sort-icon" />
                          <select value={sort} onChange={(e) => setSort(e.target.value)}>
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="az">A → Z</option>
                            <option value="priority">Priority</option>
                            <option value="completed">Completed first</option>
                            <option value="manual">Manual order</option>
                          </select>
                        </div>
                        {totalCount > 0 && (
                          <button className="btn small secondary" onClick={() => setSelectMode(true)}>
                            <MousePointerClick size={13} /> Select
                          </button>
                        )}
                        {completedCount > 0 && (
                          <button className="btn small danger" onClick={clearCompleted}>
                            <Trash2 size={13} /> Clear done
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>

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
                    toggleSubtask={toggleSubtask}
                    onReorder={reorderTodos}
                    sortMode={sort}
                    isFiltered={isFiltered}
                    selectMode={selectMode}
                    selectedIds={selectedIds}
                    onToggleSelect={toggleSelect}
                  />
                )}

                {/* Bulk action bar */}
                {selectMode && selectedIds.size > 0 && (
                  <div className="bulk-bar">
                    <span className="bulk-count">{selectedIds.size} task{selectedIds.size !== 1 ? "s" : ""} selected</span>
                    <div className="bulk-actions">
                      <button className="btn small primary" onClick={bulkComplete}>
                        <CheckCheck size={14} /> Complete
                      </button>
                      <button className="btn small danger" onClick={bulkDelete}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right rail: Categories breakdown */}
              <div className="tendril-card">
                <div className="tendril-card-header">
                  <div className="tendril-card-title">
                    <Folder size={18} />
                    Categories
                  </div>
                </div>

                {usedCategoriesActive.length === 0 ? (
                  <p className="tendril-cat-empty">Add tasks with categories to see your breakdown here.</p>
                ) : (
                  <div className="tendril-cat-list">
                    {usedCategoriesActive.map(({ category, count }) => {
                      const pct = totalCount === 0 ? 0 : Math.round((count / totalCount) * 100);
                      const palette = CAT_COLORS[category] || CAT_COLORS.General;
                      return (
                        <button
                          key={category}
                          onClick={() => { setCatFilter(category); setFilter("all"); }}
                          className="tendril-cat-row"
                          style={{ background: "transparent", border: 0, cursor: "pointer", padding: 0, textAlign: "left" }}
                          title={`Filter by ${category}`}
                        >
                          <span
                            className="tendril-cat-icon"
                            style={{ background: palette.bg, color: palette.fg }}
                          >
                            <Folder size={16} />
                          </span>
                          <div className="tendril-cat-info">
                            <div className="tendril-cat-name">{category}</div>
                            <div className="tendril-cat-bar">
                              <div
                                className="tendril-cat-bar-fill"
                                style={{ width: `${pct}%`, background: palette.fg }}
                              />
                            </div>
                          </div>
                          <span className="tendril-cat-count">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
