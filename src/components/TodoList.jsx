// src/components/TodoList.jsx
import TodoItem from "./TodoItem";

export default function TodoList({ todos, toggleTodo, deleteTodo, editTodo }) {
  return (
    <div className="todo-list card">
      {todos.length === 0 ? (
        <p className="muted">No tasks yet — add your first task above.</p>
      ) : (
        todos.map((t) => (
          <TodoItem
            key={t.id}
            todo={t}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
          />
        ))
      )}
    </div>
  );
}
