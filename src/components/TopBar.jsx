import { Search, Bell, BellOff } from "lucide-react";

function formatDate(d) {
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

export default function TopBar({
  search, setSearch,
  user,
  notifPerm,
  hasUnread = false,
  onToggleNotifPanel,
  notifPanelOpen = false,
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
        <div className="tendril-bell-wrap">
          <button
            className={`tendril-icon-btn${notifPerm === "granted" ? " notif-on" : ""}${notifPanelOpen ? " active" : ""}`}
            onClick={onToggleNotifPanel}
            title="Notifications"
            aria-label="Notifications"
            aria-expanded={notifPanelOpen}
          >
            <BellIcon size={18} />
            {hasUnread && <span className="notif-dot" />}
          </button>
        </div>
        <div className="tendril-user-avatar" style={{ width: 36, height: 36 }} title={user.email}>
          {initials}
        </div>
      </div>
    </header>
  );
}
