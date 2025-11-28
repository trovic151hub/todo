// src/components/TodoItem.jsx
import { useState } from "react";

const CATS = ["General", "Work", "Personal", "Shopping", "School"];

export default function TodoItem({ todo, toggleTodo, deleteTodo, editTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(todo.text || "");
  const [category, setCategory] = useState(todo.category || "General");

  const save = () => {
    if (!value.trim()) return;
    editTodo(todo.id, value, category);
    setIsEditing(false);
  };

  return (
    <div className={`todo-row ${todo.completed ? "completed" : ""}`}>
      <div className="left">
        <input
          type="checkbox"
          checked={!!todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />

        {isEditing ? (
          <input
            className="edit-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") {
                setValue(todo.text);
                setIsEditing(false);
              }
            }}
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

        <span className="badge">{todo.category || "General"}</span>
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
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button className="btn small" onClick={save}>
              Save
            </button>
            <button
              className="btn small secondary"
              onClick={() => {
                setIsEditing(false);
                setValue(todo.text);
                setCategory(todo.category || "General");
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="btn small"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Edit
            </button>
            <button className="btn small danger" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
