function getWeekDays() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = today.getDay(); // 0=Sun..6=Sat
  const monday = new Date(today);
  // Make Monday the start of the week
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

export default function HeroBand({ activeCount, totalCount, dueToday, todos = [] }) {
  const days = getWeekDays();

  // Tasks per day in the visible week (active tasks with a dueDate in the week)
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
      <div>
        <div className="tendril-hero-eyebrow">Today's focus</div>
        <h1 className="tendril-hero-title">{headline}</h1>
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
