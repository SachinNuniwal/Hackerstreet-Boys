import { useState, useMemo, useEffect } from "react";
import EventModal from "../components/EventModal";
import "./Dashboard.css";

const LS_EVENTS = "em_events";

function loadEvents() {
  try {
    const data = localStorage.getItem(LS_EVENTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveEvents(data) {
  localStorage.setItem(LS_EVENTS, JSON.stringify(data));
}

function Dashboard({ user, onLogout, darkMode, onToggleDark }) {

  const [events, setEvents] = useState(loadEvents);
  const [modal, setModal] = useState(null);
  const [statsModal, setStatsModal] = useState(null);
  const [view, setView] = useState("events");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("date-asc");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [darkMode]);

  const today = new Date().toISOString().split("T")[0];
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.date >= today);
  const pastEvents = events.filter(e => e.date < today);

  function addEvent(data) {
    const updated = [{ id: Date.now().toString(), ...data }, ...events];
    setEvents(updated);
    saveEvents(updated);
  }

  function editEvent(id, data) {
    const updated = events.map(e =>
      e.id === id ? { ...e, ...data } : e
    );
    setEvents(updated);
    saveEvents(updated);
  }

  function deleteEvent(id) {
    if (!window.confirm("Delete this event?")) return;
    const updated = events.filter(e => e.id !== id);
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
        e =>
          e.title.toLowerCase().includes(q) ||
          (e.description || "").toLowerCase().includes(q)
      );
    }

    list.sort((a, b) =>
      sortOrder === "date-asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );

    return list;
  }, [events, search, sortOrder]);

  function fmtDate(str) {
    return new Date(str).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <>
      <div className="db">

        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <header className="db-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>

          <div className="db-logo">
            RPS Group of Engineering and Technology
          </div>

          <div className="db-right">
            <span>Hi, {user} 👋</span>
            <button onClick={onToggleDark}>
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <ul>
            <li onClick={() => { setView("events"); setSidebarOpen(false); }}>
                🏠 Home
            </li>
            <li onClick={() => { setView("activities"); setSidebarOpen(false); }}>
               📘 Academic Activities
            </li>
            <li onClick={() => { setView("exams"); setSidebarOpen(false); }}>
               📅 Exam Schedule
            </li>
            <li onClick={() => { setView("holidays"); setSidebarOpen(false); }}>
               🎉 Holidays
            </li>
            <li onClick={() => { setView("events"); setSidebarOpen(false); }}>
               🎉 Custom Events
            </li>
            <li onClick={() => { setModal("add"); setSidebarOpen(false); }}>
              ➕ Add Event
            </li>
            <li onClick={onLogout}>Logout</li>
          </ul>
        </div>

        <main className="db-main">

          {/* EVENTS DASHBOARD */}
          {view === "events" && (
            <>
              <div className="stats-row">
                <div className="stats-box" onClick={() => setStatsModal("total")}>
                  <h3>{totalEvents}</h3>
                  <p>Total</p>
                </div>
                <div className="stats-box upcoming" onClick={() => setStatsModal("upcoming")}>
                  <h3>{upcomingEvents.length}</h3>
                  <p>Upcoming</p>
                </div>
                <div className="stats-box past" onClick={() => setStatsModal("past")}>
                  <h3>{pastEvents.length}</h3>
                  <p>Past</p>
                </div>
              </div>

              <div className="ev-top">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="date-asc">Date ↑</option>
                  <option value="date-desc">Date ↓</option>
                </select>
              </div>

              <div className="ev-grid">
                {filteredEvents.map(ev => (
                  <div key={ev.id} className="ev-card">
                    <div>{ev.title}</div>
                    <div>📅 {fmtDate(ev.date)}</div>
                    <div className="ev-actions">
                      <button onClick={() => setModal(ev)}>Edit</button>
                      <button onClick={() => deleteEvent(ev.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* EXAMS */}
          {view === "exams" && (
            <>
              <h2>Even Semester Exam Schedule 2026</h2>
              <div className="ev-card">
                1st Class Test – 23 Feb to 27 Feb 2026
                <br />Syllabus Coverage: 40%
                <br />Marks Submission: 4 March 2026
                <br />PTM: 8 March 2026
              </div>
              <div className="ev-card">
                2nd Class Test – 6 April to 10 April 2026
                <br />Syllabus Coverage: 40%
                <br />Marks Submission: 15 April 2026
                <br />PTM: 18 April 2026
              </div>
              <div className="ev-card">
                Internal Practical – 27 April to 30 April 2026
                <br />Report Submission: 5 May 2026
              </div>
              <div className="ev-card">
                Full Syllabus Examination – 1 May to 8 May 2026
                <br />Marks Submission: 11 May 2026
              </div>
              <div className="ev-card">
                Preparatory Leave – 15 May 2026 onwards
              </div>
            </>
          )}

          {/* HOLIDAYS */}
          {view === "holidays" && (
            <>
              <h2>Academic Holidays 2026 (Even Semester)</h2>
              <div className="ev-card">23 Jan – Basant Panchmi</div>
              <div className="ev-card">26 Jan – Republic Day</div>
              <div className="ev-card">4 Mar – Holi</div>
              <div className="ev-card">21 Mar – Eid-Ul-Fitr</div>
              <div className="ev-card">23 Mar – Shaheed Diwas</div>
              <div className="ev-card">26 Mar – Ram Navmi</div>
              <div className="ev-card">31 Mar – Mahavir Jayanti</div>
              <div className="ev-card">14 Apr – Dr. Ambedkar Jayanti</div>
              <div className="ev-card">
                Weekly Off:
                <br />All Sundays
                <br />2nd & 4th Saturdays
              </div>
            </>
          )}
          
          {/* ACADEMIC ACTIVITIES */}
          {view === "activities" && (
            <>
              <div className="ev-card">
                📘 Session Information:
                <br />Session Start: 12 January 2026
                <br />Session End: 15 May 2026
                <br />Total Days: 99
                <br />Holidays: 08
                <br />Working Days: 91
                <br />College Timing: 9:00 AM – 4:05 PM
              </div>
            </>
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

      {statsModal && (
        <div className="stats-modal-overlay" onClick={() => setStatsModal(null)}>
          <div className="stats-modal" onClick={e => e.stopPropagation()}>
            <h2>
              {statsModal === "total" && "All Events"}
              {statsModal === "upcoming" && "Upcoming Events"}
              {statsModal === "past" && "Past Events"}
            </h2>
            {(statsModal === "total"
              ? events
              : statsModal === "upcoming"
              ? upcomingEvents
              : pastEvents
            ).map(ev => (
              <div key={ev.id} className="ev-card">
                {ev.title} – {fmtDate(ev.date)}
              </div>
            ))}
            <button onClick={() => setStatsModal(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;