import { useEffect, useRef, useState } from "react";
import { Sprout, X } from "lucide-react";

function getWeekDays() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = today.getDay(); // 0=Sun..6=Sat
  const monday = new Date(today);
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(today.getDate() + diff);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return labels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const isoDate = d.toISOString().split("T")[0];
    return { label, num: d.getDate(), isoDate, isToday: d.getTime() === today.getTime() };
  });
}

const todayISO = () => new Date().toISOString().split("T")[0];

export default function HeroBand({ uid, activeCount, totalCount, dueToday, todos = [] }) {
  const days = getWeekDays();
  const seedKey = `tendril-seed-${uid}-${todayISO()}`;

  const [seed, setSeed] = useState(() => localStorage.getItem(seedKey) || "");
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const saveSeed = (val) => {
    const trimmed = val.trim();
    setSeed(trimmed);
    if (trimmed) localStorage.setItem(seedKey, trimmed);
    else localStorage.removeItem(seedKey);
    setEditing(false);
  };

  const tasksByDate = todos.reduce((acc, t) => {
    if (!t.dueDate || t.completed) return acc;
    acc[t.dueDate] = (acc[t.dueDate] || 0) + 1;
    return acc;
  }, {});

  const headline =
    activeCount > 0
      ? `${activeCount} active task${activeCount !== 1 ? "s" : ""}${dueToday > 0 ? ` · ${dueToday} due today` : ""}`
      : totalCount > 0
        ? "You're all clear for today"
        : "Add your first task to get started";

  return (
    <section className="tendril-hero">
      <div className="tendril-hero-left">
        <div className="tendril-hero-eyebrow">Today's focus</div>
        <h1 className="tendril-hero-title">{headline}</h1>

        {editing ? (
          <form
            className="tendril-seed tendril-seed-edit"
            onSubmit={(e) => { e.preventDefault(); saveSeed(inputRef.current?.value || ""); }}
          >
            <Sprout size={16} className="seed-icon" />
            <input
              ref={inputRef}
              type="text"
              maxLength={140}
              defaultValue={seed}
              placeholder="Plant a focus seed for today…"
              onBlur={(e) => saveSeed(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") { e.preventDefault(); setEditing(false); } }}
            />
          </form>
        ) : seed ? (
          <button className="tendril-seed tendril-seed-set" onClick={() => setEditing(true)} title="Edit your focus seed">
            <Sprout size={16} className="seed-icon" />
            <span className="seed-text">{seed}</span>
            <span
              className="seed-clear"
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); saveSeed(""); }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); e.preventDefault(); saveSeed(""); }
              }}
              aria-label="Clear focus seed"
            >
              <X size={12} />
            </span>
          </button>
        ) : (
          <button className="tendril-seed tendril-seed-empty" onClick={() => setEditing(true)}>
            <Sprout size={16} className="seed-icon" />
            <span>Plant a focus seed for today…</span>
          </button>
        )}
      </div>

      <div className="tendril-week-strip" aria-label="Week overview">
        {days.map((d) => (
          <div key={d.isoDate} className={`tendril-day${d.isToday ? " today" : ""}`}>
            <span className="day-label">{d.label}</span>
            <span className="day-num">{d.num}</span>
            <span className="day-dot" style={{ visibility: tasksByDate[d.isoDate] ? "visible" : "hidden" }} />
          </div>
        ))}
      </div>
    </section>
  );
}
