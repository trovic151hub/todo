import { useState } from "react";
import {
  Pencil, Trash2, Check, X, Clock, AlertCircle,
  Flag, FileText, ChevronDown, ChevronUp, Square, CheckSquare, Palette,
} from "lucide-react";

const CATS       = ["General", "Work", "Personal", "Shopping", "School"];
const PRIORITIES = ["None", "Low", "Medium", "High"];

export const TASK_COLORS = [
  { name: "None",   value: "" },
  { name: "Red",    value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber",  value: "#f59e0b" },
  { name: "Green",  value: "#22c55e" },
  { name: "Teal",   value: "#14b8a6" },
  { name: "Blue",   value: "#3b82f6" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Pink",   value: "#ec4899" },
];

function ColorPicker({ value, onChange }) {
  return (
    <div className="color-picker-row" role="group" aria-label="Task color">
      {TASK_COLORS.map(c => (
        <button
          key={c.name}
          type="button"
          className={`color-swatch${c.value === value ? " selected" : ""}`}
          style={c.value ? { background: c.value } : undefined}
          onClick={() => onChange(c.value)}
          title={c.name}
          aria-label={c.name}
          aria-pressed={c.value === value}
        >
          {c.value === value && <Check size={10} strokeWidth={3} />}
        </button>
      ))}
    </div>
  );
}

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

export default function TodoItem({
  todo, toggleTodo, deleteTodo, editTodo,
  selectMode = false, selected = false, onToggleSelect,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value,    setValue]    = useState(todo.text     || "");
  const [category, setCategory] = useState(todo.category || "General");
  const [dueDate,  setDueDate]  = useState(todo.dueDate  || "");
  const [priority, setPriority] = useState(todo.priority || "None");
  const [note,     setNote]     = useState(todo.note     || "");
  const [color,    setColor]    = useState(todo.color    || "");
  const [noteOpen, setNoteOpen] = useState(false);

  const overdue = !todo.completed && isOverdue(todo.dueDate);
  const prio    = todo.priority || null;
  const hasNote = !!todo.note?.trim();

  const rowStyle = todo.color
    ? { borderLeft: `3px solid ${todo.color}` }
    : undefined;

  const save = () => {
    if (!value.trim()) return;
    editTodo(
      todo.id, value, category,
      dueDate || null,
      priority === "None" ? null : priority,
      note.trim() || null,
      color || null,
    );
    setIsEditing(false);
  };

  const cancel = () => {
    setIsEditing(false);
    setValue(todo.text);
    setCategory(todo.category || "General");
    setDueDate(todo.dueDate   || "");
    setPriority(todo.priority || "None");
    setNote(todo.note         || "");
    setColor(todo.color       || "");
  };

  const handleRowClick = (e) => {
    if (!selectMode) return;
    if (e.target.closest("button, input, select, textarea, a")) return;
    onToggleSelect(todo.id);
  };

  return (
    <div
      className={[
        "todo-row",
        todo.completed ? "completed" : "",
        overdue        ? "overdue"   : "",
        !todo.color && prio ? `prio-${prio.toLowerCase()}` : "",
        hasNote        ? "has-note"  : "",
        selectMode     ? "selectable": "",
        selected       ? "selected"  : "",
      ].filter(Boolean).join(" ")}
      style={rowStyle}
      onClick={handleRowClick}
    >
      <div className="left">
        {selectMode ? (
          <button
            className="select-check"
            onClick={() => onToggleSelect(todo.id)}
            aria-label={selected ? "Deselect task" : "Select task"}
          >
            {selected
              ? <CheckSquare size={20} className="select-check-icon selected" />
              : <Square      size={20} className="select-check-icon" />
            }
          </button>
        ) : (
          <label className="checkbox-wrap" aria-label="Toggle complete">
            <input
              type="checkbox"
              checked={!!todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className="checkmark" style={todo.color && !todo.completed ? { borderColor: todo.color } : undefined}>
              <Check size={11} strokeWidth={3} />
            </span>
          </label>
        )}

        <div className="todo-content">
          {isEditing ? (
            <input
              className="edit-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter")  save();
                if (e.key === "Escape") cancel();
              }}
              autoFocus
            />
          ) : (
            <span
              className="todo-text"
              onDoubleClick={() => !selectMode && setIsEditing(true)}
              title={selectMode ? undefined : "Double-click to edit"}
            >
              {todo.text}
            </span>
          )}

          <div className="todo-meta">
            {prio && (
              <span className={`priority-badge priority-${prio.toLowerCase()}`}>
                <Flag size={9} strokeWidth={2.5} />
                {prio}
              </span>
            )}

            <span className={`badge badge-${(todo.category || "General").toLowerCase()}`}>
              {todo.category || "General"}
            </span>

            {todo.dueDate && (
              <span className={`due-badge${overdue ? " overdue" : ""}`}>
                {overdue ? <AlertCircle size={11} /> : <Clock size={11} />}
                {overdue ? "Overdue · " : ""}{formatDate(todo.dueDate)}
              </span>
            )}

            {/* Color dot — view mode */}
            {!isEditing && !selectMode && todo.color && (
              <span
                className="color-dot"
                style={{ background: todo.color }}
                title={`Color: ${TASK_COLORS.find(c => c.value === todo.color)?.name || "Custom"}`}
              />
            )}

            {isEditing && (
              <input
                type="date"
                className="date-input small"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            )}

            {!isEditing && !selectMode && hasNote && (
              <button
                className={`note-toggle-btn${noteOpen ? " active" : ""}`}
                onClick={() => setNoteOpen(o => !o)}
                title={noteOpen ? "Hide note" : "Show note"}
                aria-label={noteOpen ? "Hide note" : "Show note"}
              >
                <FileText size={11} />
                Note
                {noteOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>
            )}
          </div>

          {!isEditing && noteOpen && hasNote && (
            <div className="note-panel">
              <p className="note-text">{todo.note}</p>
            </div>
          )}

          {isEditing && (
            <>
              <textarea
                className="note-textarea"
                placeholder="Add a note or description… (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
              <div className="color-picker-label">
                <Palette size={12} />
                Task colour
              </div>
              <ColorPicker value={color} onChange={setColor} />
            </>
          )}
        </div>
      </div>

      {!selectMode && (
        <div className="right">
          {isEditing ? (
            <>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="cat-select"
              >
                {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`cat-select priority-select priority-select-${priority.toLowerCase()}`}
                aria-label="Priority"
              >
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
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
      )}
    </div>
  );
}
