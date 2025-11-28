// src/components/Footer.jsx
export default function Footer({ count }) {
  return (
    <footer className="footer card">
      <span>{count} task{count === 1 ? "" : "s"} remaining</span>
      <small className="muted">Built with Firebase • React</small>
    </footer>
  );
}
