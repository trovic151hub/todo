import { useState, useEffect } from "react";
import {
  Menu, X, Sun, Moon, LogOut, CheckSquare,
  Bell, BellOff, AlignJustify,
} from "lucide-react";

const DENSITY_LABELS = { compact: "Compact", comfortable: "Comfortable", spacious: "Spacious" };
const DENSITY_NEXT   = { compact: "comfortable", comfortable: "spacious", spacious: "compact" };

export default function Header({
  user, onSignOut, dark, setDark,
  notifPerm, onRequestNotif,
  density, onCycleDensity,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const bellTitle =
    notifPerm === "granted"     ? "Notifications enabled" :
    notifPerm === "denied"      ? "Notifications blocked — enable in browser settings" :
    notifPerm === "unsupported" ? "Notifications not supported in this browser" :
                                  "Enable task notifications";

  const BellIcon = notifPerm === "granted" ? Bell : BellOff;

  return (
    <header className="header card">
      <div className="header-left">
        <div className="brand">
          <CheckSquare size={22} className="brand-icon" strokeWidth={2.5} />
          <div>
            <h1>To-Do</h1>
            <p className="muted">Organise your day</p>
          </div>
        </div>
      </div>

      <button
        className="hamburger-btn"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
      )}

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <X size={22} />
        </button>
        <div className="user-info">
          <img
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.email}`}
            alt="avatar"
            className="avatar"
          />
          <span className="user-email">{user.email}</span>
        </div>
        <button className="btn icon" onClick={() => setDark(d => !d)} aria-label="Toggle theme">
          {dark ? <><Sun size={16} /> Light mode</> : <><Moon size={16} /> Dark mode</>}
        </button>
        <button className="btn icon" onClick={onCycleDensity} title={`Switch to ${DENSITY_NEXT[density]} view`}>
          <AlignJustify size={16} />
          {DENSITY_LABELS[density]} view
        </button>
        <button
          className={`btn icon${notifPerm === "granted" ? " notif-on" : ""}`}
          onClick={onRequestNotif}
          title={bellTitle}
        >
          <BellIcon size={16} />
          {notifPerm === "granted" ? " Alerts on" : " Enable alerts"}
        </button>
        <button className="btn secondary" onClick={onSignOut}>
          <LogOut size={15} /> Sign out
        </button>
      </div>

      <div className="header-right desktop-only">
        <div className="user-info">
          <img
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.email}`}
            alt="avatar"
            className="avatar"
          />
          <span className="user-email">{user.email}</span>
        </div>

        {/* Density toggle */}
        <button
          className="btn icon density-btn"
          onClick={onCycleDensity}
          title={`Current: ${DENSITY_LABELS[density]} — click for ${DENSITY_NEXT[density]}`}
          aria-label="Toggle density"
        >
          <AlignJustify size={18} />
          <span className="density-label">{DENSITY_LABELS[density]}</span>
        </button>

        {/* Notification bell */}
        <button
          className={`btn icon notif-btn${notifPerm === "granted" ? " notif-on" : ""}`}
          onClick={onRequestNotif}
          title={bellTitle}
          aria-label={bellTitle}
        >
          <BellIcon size={18} />
        </button>

        <button
          className="btn icon"
          aria-label="Toggle theme"
          onClick={() => setDark(d => !d)}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="btn secondary" onClick={onSignOut}>
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </header>
  );
}
