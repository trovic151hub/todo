// src/components/TodoApp.jsx
import { useState, useEffect, useMemo } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";

import Header from "./Header";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import Footer from "./Footer";

const PRESET_CATEGORIES = ["General", "Work", "Personal", "Shopping", "School"];
const todosCol = collection(db, "todos");

export default function TodoApp({ user }) {
  const uid = user.uid;

  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest"); // newest | oldest | az | completed
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("todo-dark");
    return saved ? JSON.parse(saved) : false;
  });
  const [loading, setLoading] = useState(true);

  // Apply dark/light theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("todo-dark", JSON.stringify(dark));
  }, [dark]);

  // Realtime listener for this user's todos
  useEffect(() => {
    setLoading(true);
    const q = query(
      todosCol,
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const arr = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTodos(arr);
        setLoading(false);
      },
      (err) => {
        console.error("onSnapshot error", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [uid]);

  // Add new todo
  const addTodo = async (text, category = "General") => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await addDoc(todosCol, {
      text: trimmed,
      completed: false,
      uid,
      category,
      createdAt: serverTimestamp(),
    });
  };

  // Toggle completed
  const toggleTodo = async (id) => {
    const t = todos.find((x) => x.id === id);
    if (!t) return;
    await updateDoc(doc(db, "todos", id), { completed: !t.completed });
  };

  // Edit todo (text + category)
  const editTodo = async (id, newText, newCategory) => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    await updateDoc(doc(db, "todos", id), {
      text: trimmed,
      category: newCategory,
    });
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  // Clear all completed todos
  const clearCompleted = async () => {
    const completed = todos.filter((t) => t.completed);
    const promises = completed.map((t) => deleteDoc(doc(db, "todos", t.id)));
    await Promise.all(promises);
  };

  // Process todos: filter, search, sort
  const processedTodos = useMemo(() => {
    let list = [...todos];

    // Filter
    if (filter === "active") list = list.filter((t) => !t.completed);
    if (filter === "completed") list = list.filter((t) => t.completed);

    // Search
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (t) =>
          (t.text && t.text.toLowerCase().includes(s)) ||
          (t.category && t.category.toLowerCase().includes(s))
      );
    }

    // Sort
    if (sort === "newest") {
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    } else if (sort === "oldest") {
      list.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
    } else if (sort === "az") {
      list.sort((a, b) => (a.text || "").localeCompare(b.text || ""));
    } else if (sort === "completed") {
      list.sort((a, b) => (b.completed === a.completed ? 0 : b.completed ? -1 : 1));
    }

    return list;
  }, [todos, filter, search, sort]);

  return (
    <div className="app">
      <Header user={user} onSignOut={() => signOut(auth)} dark={dark} setDark={setDark} />

      <main className="card main-card">
        <div className="top-row">
          <TodoInput addTodo={addTodo} categories={PRESET_CATEGORIES} />
          <div className="controls">
            <input
              className="search"
              placeholder="Search tasks or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">A → Z</option>
              <option value="completed">Completed first</option>
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="filters">
            <button
              className={filter === "all" ? "btn filter active" : "btn filter"}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={filter === "active" ? "btn filter active" : "btn filter"}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={filter === "completed" ? "btn filter active" : "btn filter"}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>
          <div className="actions">
            <button className="btn small" onClick={clearCompleted}>
              Clear completed
            </button>
          </div>
        </div>

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
          />
        )}
      </main>

      <Footer count={todos.filter((t) => !t.completed).length} />
    </div>
  );
}
