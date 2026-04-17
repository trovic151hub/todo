import { useMemo } from "react";
import { TrendingUp, CheckCircle2, Circle, AlertTriangle, Clock, Folder, Flag } from "lucide-react";

const CAT_CLASS = {
  General: "general", Work: "work", Personal: "personal",
  Shopping: "shopping", School: "school",
};

export default function StatsPanel({ todos }) {
  const stats = useMemo(() => {
    const total     = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active    = total - completed;
    const pct       = total === 0 ? 0 : Math.round((completed / total) * 100);

    const now   = new Date(); now.setHours(0, 0, 0, 0);
    const todayStr = now.toISOString().split("T")[0];

    const overdue  = todos.filter(t =>
      !t.completed && t.dueDate && new Date(t.dueDate + "T00:00:00") < now
    ).length;
    const dueToday = todos.filter(t =>
      !t.completed && t.dueDate === todayStr
    ).length;

    // Category breakdown
    const catMap = {};
    todos.forEach(t => {
      const c = t.category || "General";
      catMap[c] = (catMap[c] || 0) + 1;
    });
    const catRows = Object.entries(catMap).sort((a, b) => b[1] - a[1]);

    // Priority breakdown
    const prioMap = { High: 0, Medium: 0, Low: 0 };
    todos.forEach(t => { if (t.priority && prioMap[t.priority] !== undefined) prioMap[t.priority]++; });
    const hasPriorities = Object.values(prioMap).some(v => v > 0);

    return { total, completed, active, pct, overdue, dueToday, catRows, prioMap, hasPriorities };
  }, [todos]);

  if (stats.total === 0) {
    return (
      <div className="stats-panel stats-empty">
        <TrendingUp size={28} className="stats-empty-icon" />
        <p>Add some tasks to see your stats.</p>
      </div>
    );
  }

  return (
    <div className="stats-panel">

      {/* ── Top stat cards ── */}
      <div className="stats-grid">
        <div className="stat-card">
          <Circle size={18} className="stat-icon muted" />
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card accent">
          <CheckCircle2 size={18} className="stat-icon accent" />
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-label">Done</span>
        </div>
        <div className="stat-card">
          <TrendingUp size={18} className="stat-icon accent" />
          <span className="stat-value">{stats.pct}%</span>
          <span className="stat-label">Complete</span>
        </div>
        {stats.overdue > 0 && (
          <div className="stat-card danger">
            <AlertTriangle size={18} className="stat-icon danger" />
            <span className="stat-value">{stats.overdue}</span>
            <span className="stat-label">Overdue</span>
          </div>
        )}
        {stats.dueToday > 0 && (
          <div className="stat-card warning">
            <Clock size={18} className="stat-icon warning" />
            <span className="stat-value">{stats.dueToday}</span>
            <span className="stat-label">Due today</span>
          </div>
        )}
      </div>

      {/* ── Completion bar ── */}
      <div className="stats-completion">
        <div className="stats-completion-header">
          <span className="stats-section-title">Overall progress</span>
          <span className="stats-pct-label">{stats.completed} / {stats.total}</span>
        </div>
        <div className="stats-big-track">
          <div className="stats-big-fill" style={{ width: `${stats.pct}%` }} />
        </div>
      </div>

      {/* ── Category breakdown ── */}
      {stats.catRows.length > 0 && (
        <div className="stats-section">
          <div className="stats-section-header">
            <Folder size={14} />
            <span className="stats-section-title">By category</span>
          </div>
          <div className="stats-bars">
            {stats.catRows.map(([cat, count]) => (
              <div key={cat} className="stats-bar-row">
                <span className={`stats-bar-label badge badge-${CAT_CLASS[cat] || "general"}`}>{cat}</span>
                <div className="stats-bar-track">
                  <div
                    className="stats-bar-fill"
                    style={{ width: `${Math.round((count / stats.total) * 100)}%` }}
                  />
                </div>
                <span className="stats-bar-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Priority breakdown ── */}
      {stats.hasPriorities && (
        <div className="stats-section">
          <div className="stats-section-header">
            <Flag size={14} />
            <span className="stats-section-title">By priority</span>
          </div>
          <div className="stats-prio-row">
            {["High", "Medium", "Low"].map(p => stats.prioMap[p] > 0 && (
              <div key={p} className={`stat-prio-chip priority-${p.toLowerCase()}`}>
                <span className="stat-prio-value">{stats.prioMap[p]}</span>
                <span className="stat-prio-label">{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
