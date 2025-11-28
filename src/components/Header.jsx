import { useState, useEffect } from "react";

export default function Header({ user, onSignOut, dark, setDark }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Disable scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  return (
    <header className="header card">
      <div className="header-left">
        <h1>To-Do</h1>
        <p className="muted">Organize your day</p>
      </div>

      {/* Hamburger button */}
      <button
        className="hamburger-btn"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        &#9776;
      </button>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile sliding menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button
          className="close-btn"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          &times;
        </button>

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
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle dark mode"
        >
          {dark ? "🌙 Dark" : "☀️ Light"}
        </button>

        <button className="btn secondary" onClick={onSignOut}>
          Sign out
        </button>
      </div>

      {/* Desktop header-right */}
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
          aria-label="Toggle dark mode"
          onClick={() => setDark((d) => !d)}
        >
          {dark ? "🌙" : "☀️"}
        </button>

        <button className="btn secondary" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </header>
  );
}


