import { useState } from "react";
import { Plus, Tag, Calendar } from "lucide-react";

export default function TodoInput({ addTodo, categories = ["General"] }) {
  const [input, setInput]       = useState("");
  const [category, setCategory] = useState(categories[0] || "General");
  const [dueDate, setDueDate]   = useState("");
  const [showDate, setShowDate] = useState(false);

  const handleAdd = () => {
    if (!input.trim()) return;
    addTodo(input, category, dueDate || null);
    setInput("");
    setDueDate("");
  };

  return (
    <div className="todo-input-wrap">
      <form
        className="todo-input"
        onSubmit={(e) => { e.preventDefault(); handleAdd(); }}
      >
        <input
          type="text"
          placeholder="Add a new task…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
        />

        <div className="input-addon">
          <Tag size={13} className="addon-icon" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Category"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={`btn icon date-toggle ${showDate ? "active" : ""}`}
          onClick={() => setShowDate(d => !d)}
          title="Set due date"
          aria-label="Set due date"
        >
          <Calendar size={16} />
        </button>

        <button className="btn primary" type="submit" disabled={!input.trim()}>
          <Plus size={16} />
          Add
        </button>
      </form>

      {showDate && (
        <div className="date-row">
          <label className="date-label">
            <Calendar size={13} />
            Due date
          </label>
          <input
            type="date"
            className="date-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
          {dueDate && (
            <button
              type="button"
              className="btn small secondary"
              onClick={() => setDueDate("")}
            >
              Clear
            </button>
          )}
        </div>
      )}

      <p className="input-hint">Press ↵ Enter to add</p>
    </div>
  );
}
