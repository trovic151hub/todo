import {
  Leaf, Plus, Sun, Moon, Calendar, Layers, Inbox, Bell, BellOff,
  AlignJustify, LogOut, ListTodo, Flame, CheckCircle2, Folder,
} from "lucide-react";

const DENSITY_LABELS = { compact: "Compact", comfortable: "Comfortable", spacious: "Spacious" };

export default function Sidebar({
  user, onSignOut,
  filter, setFilter, catFilter, setCatFilter,
  totalCount, activeCount, completedCount, dueTodayCount,
  categoryCounts,
  onQuickAdd, quickAddOpen,
  dark, setDark,
  density, onCycleDensity,
  notifPerm, onRequestNotif,
}) {
  const initials = (user.email || "U").slice(0, 2).toUpperCase();
  const BellIcon = notifPerm === "granted" ? Bell : BellOff;
  const notifLabel =
    notifPerm === "granted" ? "On"
      : notifPerm === "denied" ? "Blocked"
        : notifPerm === "unsupported" ? "n/a" : "Off";

  const isAll = filter === "all" && catFilter === "All";

  return (
    <aside className="tendril-sidebar">
      <div>
        <div className="tendril-brand">
          <div className="tendril-brand-mark">
            <Leaf size={20} strokeWidth={2.2} />
          </div>
          <span className="tendril-brand-name">Tendril</span>
        </div>

        <button
          className={`tendril-quickadd${quickAddOpen ? " active" : ""}`}
          onClick={onQuickAdd}
        >
          <Plus size={16} strokeWidth={2.5} />
          Quick add
        </button>

        <div className="tendril-nav-section">
          <div className="tendril-nav-title">Workspace</div>
          <div className="tendril-nav-list">
            <button
              className={`tendril-nav-item${isAll ? " active" : ""}`}
              onClick={() => { setFilter("all"); setCatFilter("All"); }}
            >
              <span className="nav-left">
                <Sun size={18} className="nav-icon" />
                <span>Today</span>
              </span>
              <span className="nav-count">{totalCount}</span>
            </button>
            <button
              className={`tendril-nav-item${filter === "active" ? " active" : ""}`}
              onClick={() => { setFilter("active"); setCatFilter("All"); }}
            >
              <span className="nav-left">
                <Calendar size={18} className="nav-icon" />
                <span>Active</span>
              </span>
              <span className="nav-count">{activeCount}</span>
            </button>
            <button
              className={`tendril-nav-item${filter === "completed" ? " active" : ""}`}
              onClick={() => { setFilter("completed"); setCatFilter("All"); }}
            >
              <span className="nav-left">
                <CheckCircle2 size={18} className="nav-icon" />
                <span>Completed</span>
              </span>
              <span className="nav-count">{completedCount}</span>
            </button>
            <button
              className="tendril-nav-item"
              onClick={() => { setFilter("all"); setCatFilter("All"); }}
              title="Tasks due today"
            >
              <span className="nav-left">
                <Inbox size={18} className="nav-icon" />
                <span>Due today</span>
              </span>
              {dueTodayCount > 0 && <span className="nav-count">{dueTodayCount}</span>}
            </button>
          </div>
        </div>

        <div className="tendril-nav-section">
          <div className="tendril-nav-title">Categories</div>
          <div className="tendril-nav-list">
            {categoryCounts.filter(c => c.count > 0).length === 0 && (
              <div className="tendril-cat-empty" style={{ padding: "10px 12px", textAlign: "left", fontSize: 12 }}>
                No categories yet
              </div>
            )}
            {categoryCounts.filter(c => c.count > 0).map(({ category, count }) => (
              <button
                key={category}
                className={`tendril-nav-item${catFilter === category ? " active" : ""}`}
                onClick={() => { setCatFilter(category); setFilter("all"); }}
              >
                <span className="nav-left">
                  <Folder size={18} className="nav-icon" />
                  <span>{category}</span>
                </span>
                <span className="nav-count">{count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="tendril-nav-section">
          <div className="tendril-nav-title">Settings</div>
          <div className="tendril-nav-list tendril-settings-row">
            <button
              className="tendril-nav-item"
              onClick={() => setDark(d => !d)}
              title={dark ? "Switch to light" : "Switch to dark"}
            >
              <span className="nav-left">
                {dark ? <Sun size={18} className="nav-icon" /> : <Moon size={18} className="nav-icon" />}
                <span>{dark ? "Light mode" : "Dark mode"}</span>
              </span>
            </button>
            <button
              className="tendril-nav-item"
              onClick={onCycleDensity}
              title="Cycle density"
            >
              <span className="nav-left">
                <AlignJustify size={18} className="nav-icon" />
                <span>Density</span>
              </span>
              <span className="nav-value">{DENSITY_LABELS[density]}</span>
            </button>
            <button
              className="tendril-nav-item"
              onClick={onRequestNotif}
              title="Notifications"
            >
              <span className="nav-left">
                <BellIcon size={18} className="nav-icon" />
                <span>Notifications</span>
              </span>
              <span className="nav-value">{notifLabel}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="tendril-user">
        <div className="tendril-user-info">
          <div className="tendril-user-avatar">{initials}</div>
          <span className="tendril-user-name">{user.email}</span>
        </div>
        <button className="tendril-user-signout" onClick={onSignOut} title="Sign out" aria-label="Sign out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
