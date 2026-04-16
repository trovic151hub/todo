import { useState } from "react";
import { Pencil, Trash2, Check, X, Clock, AlertCircle } from "lucide-react";

const CATS = ["General", "Work", "Personal", "Shopping", "School"];

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr + "T00:00:00") < today;
}

export default function TodoItem({ todo, toggleTodo, deleteTodo, editTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue]         = useState(todo.text || "");
  const [category, setCategory]   = useState(todo.category || "General");
  const [dueDate, setDueDate]     = useState(todo.dueDate || "");

  const overdue = !todo.completed && isOverdue(todo.dueDate);

  const save = () => {
    if (!value.trim()) return;
    editTodo(todo.id, value, category, dueDate || null);
    setIsEditing(false);
  };

  const cancel = () => {
    setIsEditing(false);
    setValue(todo.text);
    setCategory(todo.category || "General");
    setDueDate(todo.dueDate || "");
  };

  return (
    <div className={`todo-row${todo.completed ? " completed" : ""}${overdue ? " overdue" : ""}`}>
      <div className="left">
        <label className="checkbox-wrap" aria-label="Toggle complete">
          <input
            type="checkbox"
            checked={!!todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span className="checkmark">
            <Check size={11} strokeWidth={3} />
          </span>
        </label>

        <div className="todo-content">
          {isEditing ? (
            <input
              className="edit-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") cancel();
              }}
              autoFocus
            />
          ) : (
            <span
              className="todo-text"
              onDoubleClick={() => setIsEditing(true)}
              title="Double-click to edit"
            >
              {todo.text}
            </span>
          )}

          <div className="todo-meta">
            <span className={`badge badge-${(todo.category || "General").toLowerCase()}`}>
              {todo.category || "General"}
            </span>
            {todo.dueDate && (
              <span className={`due-badge${overdue ? " overdue" : ""}`}>
                {overdue ? <AlertCircle size={11} /> : <Clock size={11} />}
                {overdue ? "Overdue · " : ""}{formatDate(todo.dueDate)}
              </span>
            )}
            {isEditing && (
              <input
                type="date"
                className="date-input small"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="right">
        {isEditing ? (
          <>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="cat-select"
            >
              {CATS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button className="btn small primary" onClick={save} title="Save">
              <Check size={13} /> Save
            </button>
            <button className="btn small secondary" onClick={cancel} title="Cancel">
              <X size={13} />
            </button>
          </>
        ) : (
          <>
            <button
              className="btn small secondary"
              onClick={() => setIsEditing(true)}
              title="Edit task"
            >
              <Pencil size={13} />
            </button>
            <button
              className="btn small danger"
              onClick={() => deleteTodo(todo.id)}
              title="Delete task"
            >
              <Trash2 size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
