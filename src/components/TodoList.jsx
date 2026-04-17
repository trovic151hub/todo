import { useState } from "react";
import { ClipboardList } from "lucide-react";
import TodoItem from "./TodoItem";

function EmptyState({ filtered }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <ClipboardList size={48} strokeWidth={1.2} />
      </div>
      <h3>{filtered ? "No matching tasks" : "All clear!"}</h3>
      <p>{filtered ? "Try a different search or filter." : "Add your first task above to get started."}</p>
    </div>
  );
}

export default function TodoList({
  todos, toggleTodo, deleteTodo, editTodo, toggleSubtask,
  onReorder, sortMode, isFiltered,
  selectMode, selectedIds, onToggleSelect,
}) {
  const isDragMode = sortMode === "manual" && !selectMode;

  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);

  const handleDragStart = (i) => {
    setDragIdx(i);
  };

  const handleDragOver = (e, i) => {
    e.preventDefault();
    if (i !== overIdx) setOverIdx(i);
  };

  const handleDrop = (i) => {
    if (dragIdx === null || dragIdx === i) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    const next = [...todos];
    const [removed] = next.splice(dragIdx, 1);
    next.splice(i, 0, removed);
    onReorder(next);
    setDragIdx(null);
    setOverIdx(null);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
    <div className="todo-list">
      {todos.length === 0 ? (
        <EmptyState filtered={isFiltered} />
      ) : (
        todos.map((t, i) => (
          <div
            key={t.id}
            draggable={isDragMode}
            onDragStart={isDragMode ? () => handleDragStart(i) : undefined}
            onDragOver={isDragMode  ? (e) => handleDragOver(e, i) : undefined}
            onDrop={isDragMode      ? () => handleDrop(i) : undefined}
            onDragEnd={isDragMode   ? handleDragEnd : undefined}
            className={[
              isDragMode && dragIdx === i               ? "drag-item dragging" : "",
              isDragMode && overIdx === i && dragIdx !== i ? "drag-item drag-over" : "",
              isDragMode                               ? "drag-item" : "",
            ].filter(Boolean).join(" ")}
          >
            <TodoItem
              todo={t}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
              toggleSubtask={toggleSubtask}
              isDragMode={isDragMode}
              selectMode={selectMode}
              selected={selectedIds?.has(t.id) ?? false}
              onToggleSelect={onToggleSelect}
            />
          </div>
        ))
      )}
    </div>
  );
}
