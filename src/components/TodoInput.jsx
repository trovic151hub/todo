// src/components/TodoInput.jsx
import { useState } from "react";

export default function TodoInput({ addTodo, categories = ["General"] }) {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState(categories[0] || "General");

  const handleAdd = () => {
    if (!input.trim()) return;
    addTodo(input, category);
    setInput("");
  };

  return (
    <form
      className="todo-input"
      onSubmit={(e) => {
        e.preventDefault();
        handleAdd();
      }}
    >
      <input
        type="text"
        placeholder="Add a new task..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Category"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <button className="btn primary" type="submit">
        Add
      </button>
    </form>
  );
}
