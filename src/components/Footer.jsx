import { ListTodo, Zap } from "lucide-react";

export default function Footer({ count, total, completed }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <footer className="footer card">
      <div className="footer-left">
        <ListTodo size={15} className="footer-icon" />
        <span>
          <strong>{count}</strong> task{count !== 1 ? "s" : ""} remaining
        </span>
      </div>
      <div className="footer-right">
        {total > 0 && (
          <span className="footer-pct">
            <Zap size={13} />
            {pct}% done
          </span>
        )}
        <small className="muted">Built with Firebase · React</small>
      </div>
    </footer>
  );
}
