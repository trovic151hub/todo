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
  todos, toggleTodo, deleteTodo, editTodo, isFiltered,
  selectMode, selectedIds, onToggleSelect,
}) {
  return (
    <div className="todo-list">
      {todos.length === 0 ? (
        <EmptyState filtered={isFiltered} />
      ) : (
        todos.map((t) => (
          <TodoItem
            key={t.id}
            todo={t}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            selectMode={selectMode}
            selected={selectedIds?.has(t.id) ?? false}
            onToggleSelect={onToggleSelect}
          />
        ))
      )}
    </div>
  );
}
