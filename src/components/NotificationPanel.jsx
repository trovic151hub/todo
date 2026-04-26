import { useEffect, useRef } from "react";
import { Bell, BellOff, AlertTriangle, CalendarDays, Sparkles, MoonStar, X } from "lucide-react";

function fmtDue(dateStr) {
  const due = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((today - due) / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days > 1)   return `${days} days ago`;
  if (days === -1) return "tomorrow";
  return due.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function NotificationPanel({
  open, onClose,
  overdueTasks, dueTodayTasks,
  notifPerm,
  onEnable, onTest, onSnooze,
  snoozedUntil,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const total = overdueTasks.length + dueTodayTasks.length;
  const isSnoozed = snoozedUntil && new Date(snoozedUntil) > new Date();

  return (
    <div className="tendril-notif-panel" ref={ref} role="dialog" aria-label="Notifications">
      <div className="tendril-notif-header">
        <div className="tendril-notif-title">
          <Bell size={16} /> Notifications
        </div>
        <button className="tendril-icon-btn small" onClick={onClose} aria-label="Close">
          <X size={14} />
        </button>
      </div>

      <div className="tendril-notif-body">
        {total === 0 && (
          <div className="tendril-notif-empty">
            <Sparkles size={20} />
            <p>You're all caught up.</p>
            <span>Nothing overdue or due today.</span>
          </div>
        )}

        {overdueTasks.length > 0 && (
          <div className="tendril-notif-group">
            <div className="tendril-notif-group-title danger">
              <AlertTriangle size={13} /> Overdue · {overdueTasks.length}
            </div>
            <ul className="tendril-notif-list">
              {overdueTasks.slice(0, 6).map((t) => (
                <li key={t.id} className="tendril-notif-item danger">
                  <span className="dot" />
                  <div className="info">
                    <div className="text">{t.text}</div>
                    <div className="meta">Due {fmtDue(t.dueDate)}{t.category ? ` · ${t.category}` : ""}</div>
                  </div>
                </li>
              ))}
              {overdueTasks.length > 6 && (
                <li className="tendril-notif-more">+{overdueTasks.length - 6} more overdue</li>
              )}
            </ul>
          </div>
        )}

        {dueTodayTasks.length > 0 && (
          <div className="tendril-notif-group">
            <div className="tendril-notif-group-title">
              <CalendarDays size={13} /> Due today · {dueTodayTasks.length}
            </div>
            <ul className="tendril-notif-list">
              {dueTodayTasks.slice(0, 6).map((t) => (
                <li key={t.id} className="tendril-notif-item">
                  <span className="dot" />
                  <div className="info">
                    <div className="text">{t.text}</div>
                    <div className="meta">Due today{t.category ? ` · ${t.category}` : ""}</div>
                  </div>
                </li>
              ))}
              {dueTodayTasks.length > 6 && (
                <li className="tendril-notif-more">+{dueTodayTasks.length - 6} more due today</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="tendril-notif-footer">
        <div className="tendril-notif-perm">
          {notifPerm === "granted" ? (
            <span className="perm-on"><Bell size={12} /> Browser notifications on</span>
          ) : notifPerm === "denied" ? (
            <span className="perm-off"><BellOff size={12} /> Blocked in browser</span>
          ) : notifPerm === "unsupported" ? (
            <span className="perm-off"><BellOff size={12} /> Not supported</span>
          ) : (
            <span className="perm-off"><BellOff size={12} /> Browser notifications off</span>
          )}
          {isSnoozed && (
            <span className="perm-snooze"><MoonStar size={12} /> Snoozed for today</span>
          )}
        </div>
        <div className="tendril-notif-actions">
          {notifPerm !== "granted" && notifPerm !== "unsupported" && (
            <button className="btn small primary" onClick={onEnable}>
              <Bell size={13} /> Enable
            </button>
          )}
          {notifPerm === "granted" && (
            <button className="btn small secondary" onClick={onTest}>
              <Sparkles size={13} /> Send test
            </button>
          )}
          {total > 0 && !isSnoozed && (
            <button className="btn small secondary" onClick={onSnooze}>
              <MoonStar size={13} /> Snooze today
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
