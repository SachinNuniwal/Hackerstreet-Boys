import { useState, useMemo, useEffect } from "react";
import EventModal from "../components/EventModal";
import "./Dashboard.css";

function loadEvents() {
  try {
    const data = localStorage.getItem("em_events");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveEvents(list) {
  localStorage.setItem("em_events", JSON.stringify(list));
}

function Dashboard({ user, onLogout, darkMode, onToggleDark }) {
  const [events, setEvents] = useState(loadEvents);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date-asc");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState("events"); // Track current view

  /* Dark Mode Sync */
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [darkMode]);

  /* Event CRUD */
  function addEvent(data) {
    const updated = [
      { id: crypto?.randomUUID?.() || Date.now().toString(), ...data },
      ...events,
    ];
    setEvents(updated);
    saveEvents(updated);
  }

  function editEvent(id, data) {
    const updated = events.map((e) =>
      e.id === id ? { ...e, ...data } : e
    );
    setEvents(updated);
    saveEvents(updated);
  }

  function deleteEvent(id) {
    if (!window.confirm("Delete this event?")) return;
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    saveEvents(updated);
  }

  function handleSave(data) {
    if (modal === "add") addEvent(data);
    else editEvent(modal.id, data);
    setModal(null);
  }

  /* Filter + Sort for Events */
  const filteredEvents = useMemo(() => {
    let list = [...events];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.description || "").toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => {
      if (sort === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sort === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sort === "title-asc") return a.title.localeCompare(b.title);
      if (sort === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });
  }, [events, search, sort]);

  /* Academic Holidays 2026 (major Indian holidays) */
  const academicHolidays = [
    { date: "2026-01-01", reason: "New Year's Day" },
    { date: "2026-01-26", reason: "Republic Day" },
    { date: "2026-03-04", reason: "Holi" },
    { date: "2026-03-29", reason: "Ram Navami" },
    { date: "2026-04-03", reason: "Good Friday" },
    { date: "2026-04-14", reason: "Ambedkar Jayanti" },
    { date: "2026-05-01", reason: "Labour Day" },
    { date: "2026-06-15", reason: "Eid-ul-Fitr (approx.)" },
    { date: "2026-08-15", reason: "Independence Day" },
    { date: "2026-08-31", reason: "Ganesh Chaturthi" },
    { date: "2026-10-02", reason: "Gandhi Jayanti" },
    { date: "2026-10-12", reason: "Dussehra / Vijayadashami" },
    { date: "2026-11-04", reason: "Diwali" },
    { date: "2026-12-25", reason: "Christmas Day" }
  ];

  /* Generate weekly holidays (Sundays + 2nd & 4th Saturdays) */
  function generateWeeklyHolidays(year) {
    const list = [];
    for (let month = 0; month < 12; month++) {
      let saturdayCount = 0;
      for (let day = 1; day <= 31; day++) {
        const date = new Date(year, month, day);
        if (date.getMonth() !== month) break;
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0)
          list.push({ date: date.toISOString().split("T")[0], reason: "Sunday" });
        if (dayOfWeek === 6) {
          saturdayCount++;
          if (saturdayCount === 2 || saturdayCount === 4) {
            list.push({ date: date.toISOString().split("T")[0], reason: `${saturdayCount} Saturday` });
          }
        }
      }
    }
    return list;
  }

  const weeklyHolidays = generateWeeklyHolidays(2026);
  const allHolidays = [...academicHolidays, ...weeklyHolidays].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  /* Date Formatter */
  function fmtDate(str) {
    if (!str) return "";
    return new Date(str).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  /* Stats */
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = events.filter((e) => new Date(e.date) >= today).length;
  const past = events.length - upcoming;

  /* JSX */
  return (
    <>
      <div className="db">
        {/* HEADER */}
        <header className="db-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div className="db-logo">RPS Group of Engineering and Technology</div>
          <div className="db-right">
            <span className="db-user">Hi, {user} 👋</span>
            <button className="theme-btn" onClick={onToggleDark}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button className="logout-btn" onClick={onLogout}>
              Sign out
            </button>
          </div>
        </header>

        {/* SIDEBAR */}
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <ul>
            <li onClick={() => setView("events")}>📅 Exam Schedule</li>
            <li onClick={() => setView("holidays")}>🎉 Holidays</li>
            <li onClick={() => setView("meetings")}>👥 Meetings</li>
            <li onClick={() => setView("trips")}>🚌 Trips</li>
            <li onClick={() => setView("sports")}>🏆 Sports</li>
          </ul>
        </div>

        {/* MAIN */}
        <main className="db-main">
          {view === "events" && (
            <>
              {/* Stats */}
              <div className="stats">
                <div className="stat">
                  <div className="stat-lbl">Total Events</div>
                  <div className="stat-val">{events.length}</div>
                </div>
                <div className="stat">
                  <div className="stat-lbl">Upcoming</div>
                  <div className="stat-val">{upcoming}</div>
                </div>
                <div className="stat">
                  <div className="stat-lbl">Past</div>
                  <div className="stat-val">{past}</div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="toolbar">
                <input
                  className="search-input"
                  placeholder="🔍 Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select className="sort-sel" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="date-asc">Date ↑</option>
                  <option value="date-desc">Date ↓</option>
                  <option value="title-asc">Title A–Z</option>
                  <option value="title-desc">Title Z–A</option>
                </select>
                <button className="add-btn" onClick={() => setModal("add")}>
                  + Add Event
                </button>
              </div>

              {/* Events */}
              {filteredEvents.length === 0 ? (
                <div className="empty">No events found</div>
              ) : (
                <div className="ev-grid">
                  {filteredEvents.map((ev) => (
                    <div className="ev-card" key={ev.id}>
                      <div className="ev-title">{ev.title}</div>
                      <div className="ev-date">📅 {fmtDate(ev.date)}</div>
                      {ev.description && <div className="ev-desc">{ev.description}</div>}
                      <div className="ev-actions">
                        <button className="btn-edit" onClick={() => setModal(ev)}>✏️ Edit</button>
                        <button className="btn-del" onClick={() => deleteEvent(ev.id)}>🗑️ Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {view === "holidays" && (
            <div className="ev-grid">
              {allHolidays.map((h) => (
                <div className="ev-card" key={h.date}>
                  <div className="ev-title">{h.reason}</div>
                  <div className="ev-date">📅 {fmtDate(h.date)}</div>
                </div>
              ))}
            </div>
          )}

          {["meetings", "trips", "sports"].includes(view) && (
            <div className="empty">Coming soon...</div>
          )}
        </main>
      </div>

      {modal && (
        <EventModal
          event={modal === "add" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

export default Dashboard;