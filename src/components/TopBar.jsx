import { Search, Bell, BellOff } from "lucide-react";

function formatDate(d) {
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

export default function TopBar({
  search, setSearch,
  user,
  notifPerm, onRequestNotif,
  hasUnread = false,
}) {
  const dateLabel = formatDate(new Date());
  const BellIcon = notifPerm === "granted" ? Bell : BellOff;
  const initials = (user.email || "U").slice(0, 2).toUpperCase();

  return (
    <header className="tendril-topbar">
      <div className="tendril-topbar-search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search tasks, categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="tendril-topbar-right">
        <span className="tendril-topbar-date">{dateLabel}</span>
        <button
          className={`tendril-icon-btn${notifPerm === "granted" ? " notif-on" : ""}`}
          onClick={onRequestNotif}
          title="Notifications"
          aria-label="Notifications"
        >
          <BellIcon size={18} />
          {hasUnread && <span className="notif-dot" />}
        </button>
        <div className="tendril-user-avatar" style={{ width: 36, height: 36 }} title={user.email}>
          {initials}
        </div>
      </div>
    </header>
  );
}
