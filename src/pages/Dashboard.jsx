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

  // 🔥 Default view = exam schedule
  const [view, setView] = useState("exam");

  /* Dark Mode */
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [darkMode]);

  /* ================= EXAM SCHEDULE ================= */

  const examSchedule = [
    { title: "1st Class Test", date: "2026-02-23", endDate: "2026-02-27" },
    { title: "Marks Submission (CT-1)", date: "2026-03-04" },
    { title: "PTM (After CT-1)", date: "2026-03-08" },
    { title: "2nd Class Test", date: "2026-04-06", endDate: "2026-04-10" },
    { title: "Marks Submission (CT-2)", date: "2026-04-15" },
    { title: "PTM (After CT-2)", date: "2026-04-18" },
    { title: "Internal Practical Evaluation", date: "2026-04-27", endDate: "2026-04-30" },
    { title: "Full Syllabus Examination", date: "2026-05-01", endDate: "2026-05-08" },
    { title: "Final Marks Submission", date: "2026-05-11" },
  ];

  /* ================= HOLIDAYS ================= */

  const academicHolidays = [
    { date: "2026-01-26", reason: "Republic Day" },
    { date: "2026-03-04", reason: "Holi" },
    { date: "2026-04-03", reason: "Good Friday" },
    { date: "2026-04-14", reason: "Ambedkar Jayanti" },
  ];

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
            list.push({
              date: date.toISOString().split("T")[0],
              reason: `${saturdayCount} Saturday`,
            });
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

  /* ================= EVENTS SYSTEM (UNCHANGED) ================= */

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

    return list.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, search]);

  function fmtDate(str) {
    return new Date(str).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  /* ================= JSX ================= */

  return (
    <>
      <div className="db">
        {/* HEADER */}
        <header className="db-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <div className="db-logo">RPS Group of Engineering and Technology</div>
          <div className="db-right">
            <span className="db-user">Hi, {user} 👋</span>
            <button className="theme-btn" onClick={onToggleDark}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button className="logout-btn" onClick={onLogout}>Sign out</button>
          </div>
        </header>

        {/* SIDEBAR */}
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <ul>
            <li onClick={() => { setView("exam"); setSidebarOpen(false); }}>📅 Exam Schedule</li>
            <li onClick={() => { setView("holidays"); setSidebarOpen(false); }}>🎉 Holidays</li>
            <li onClick={() => { setView("events"); setSidebarOpen(false); }}>📝 Events</li>
            <li onClick={() => setView("meetings")}>👥 Meetings</li>
            <li onClick={() => setView("trips")}>🚌 Trips</li>
            <li onClick={() => setView("sports")}>🏆 Sports</li>
          </ul>
        </div>

        {sidebarOpen && (
          <div className="overlay show" onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* MAIN */}
        <main className="db-main">

          {/* EXAM SCHEDULE */}
          {view === "exam" && (
            <div className="ev-grid">
              {examSchedule.map((ex, i) => (
                <div className="ev-card" key={i}>
                  <div className="ev-title">{ex.title}</div>
                  <div className="ev-date">
                    📅 {fmtDate(ex.date)}
                    {ex.endDate && ` - ${fmtDate(ex.endDate)}`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* HOLIDAYS */}
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

          {/* EVENTS */}
          {view === "events" && (
            <div className="ev-grid">
              {filteredEvents.map((ev) => (
                <div className="ev-card" key={ev.id}>
                  <div className="ev-title">{ev.title}</div>
                  <div className="ev-date">📅 {fmtDate(ev.date)}</div>
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