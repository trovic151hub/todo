import { useState } from "react";
import { Plus, Tag, Calendar, Flag, Palette, Check, X, RefreshCw } from "lucide-react";
import { TASK_COLORS } from "../taskColors";

const PRIORITIES  = ["None", "Low", "Medium", "High"];
const RECURRENCES = ["None", "Daily", "Weekly", "Monthly"];

export default function TodoInput({ addTodo, categories = ["General"] }) {
  const [input,      setInput]      = useState("");
  const [category,   setCategory]   = useState(categories[0] || "General");
  const [priority,   setPriority]   = useState("None");
  const [recurrence, setRecurrence] = useState("None");
  const [dueDate,    setDueDate]    = useState("");
  const [color,      setColor]      = useState("");
  const [showDate,   setShowDate]   = useState(false);
  const [showColors, setShowColors] = useState(false);

  const handleAdd = () => {
    if (!input.trim()) return;
    addTodo(
      input, category,
      dueDate     || null,
      priority    === "None"   ? null : priority,
      color       || null,
      recurrence  === "None"   ? null : recurrence,
    );
    setInput("");
    setDueDate("");
    setPriority("None");
    setRecurrence("None");
    setColor("");
    setShowColors(false);
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

        <div className={`input-addon priority-addon priority-addon-${(priority || "none").toLowerCase()}`}>
          <Flag size={13} className="addon-icon" />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label="Priority"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={`btn icon date-toggle${showDate ? " active" : ""}`}
          onClick={() => setShowDate(d => !d)}
          title="Set due date"
          aria-label="Set due date"
        >
          <Calendar size={16} />
        </button>

        <button
          type="button"
          className={`btn icon color-toggle${showColors ? " active" : ""}${color ? " has-color" : ""}`}
          onClick={() => setShowColors(s => !s)}
          title={color ? "Change colour" : "Set task colour"}
          aria-label="Set task colour"
          style={color ? { borderColor: color, color } : undefined}
        >
          {color
            ? <span className="color-toggle-dot" style={{ background: color }} />
            : <Palette size={16} />
          }
        </button>

        <div className={`input-addon recurrence-addon${recurrence !== "None" ? " active" : ""}`}>
          <RefreshCw size={13} className="addon-icon" />
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            aria-label="Recurrence"
          >
            {RECURRENCES.map((r) => (
              <option key={r} value={r}>{r === "None" ? "Once" : r}</option>
            ))}
          </select>
        </div>

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

      {showColors && (
        <div className="date-row color-row">
          <label className="date-label">
            <Palette size={13} />
            Task colour
          </label>
          <div className="color-picker-row">
            {TASK_COLORS.map(c => (
              <button
                key={c.name}
                type="button"
                className={`color-swatch${c.value === color ? " selected" : ""}`}
                style={c.value ? { background: c.value } : undefined}
                onClick={() => setColor(c.value)}
                title={c.name}
                aria-label={c.name}
              >
                {c.value === color && <Check size={10} strokeWidth={3} />}
              </button>
            ))}
          </div>
          {color && (
            <button
              type="button"
              className="btn small secondary"
              onClick={() => setColor("")}
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>
      )}

      <p className="input-hint">Press ↵ Enter to add  ·  Swipe right to complete, left to delete on mobile</p>
    </div>
  );
}
