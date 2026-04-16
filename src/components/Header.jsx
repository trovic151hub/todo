import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, LogOut, CheckSquare } from "lucide-react";

export default function Header({ user, onSignOut, dark, setDark }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

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
        <button
          className="close-btn"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
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
