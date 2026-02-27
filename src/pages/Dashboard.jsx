import { useState, useMemo } from "react";
import EventModal from "../components/EventModal";

// load events from localStorage
function loadEvents() {
  try {
    return JSON.parse(localStorage.getItem("em_events")) || [];
  } catch {
    return [];
  }
}

// save events to localStorage
function saveEvents(list) {
  localStorage.setItem("em_events", JSON.stringify(list));
}

function Dashboard({ user, onLogout, darkMode, onToggleDark }) {
  const [events, setEvents] = useState(loadEvents);
  const [modal,  setModal]  = useState(null);   // null | "add" | event object
  const [search, setSearch] = useState("");
  const [sort,   setSort]   = useState("date-asc");
  const [delId,  setDelId]  = useState(null);

  // ── event operations ──────────────────────────────────────────────────────
  function addEvent(data) {
    const updated = [{ id: Date.now().toString(), ...data }, ...events];
    setEvents(updated);
    saveEvents(updated);
  }

  function editEvent(id, data) {
    const updated = events.map(e => e.id === id ? { ...e, ...data } : e);
    setEvents(updated);
    saveEvents(updated);
  }

  function deleteEvent(id) {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    saveEvents(updated);
    setDelId(null);
  }

  function handleSave(data) {
    if (modal === "add") addEvent(data);
    else editEvent(modal.id, data);
    setModal(null);
  }

  // ── filter + sort ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = events;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.description || "").toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      if (sort === "date-asc")   return a.date < b.date ? -1 : 1;
      if (sort === "date-desc")  return a.date > b.date ? -1 : 1;
      if (sort === "title-asc")  return a.title.localeCompare(b.title);
      if (sort === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });
  }, [events, search, sort]);

  // stats
  const today    = new Date(new Date().toDateString());
  const upcoming = events.filter(e => new Date(e.date + "T00:00:00") >= today).length;
  const past     = events.length - upcoming;

  // format date nicely
  function fmtDate(str) {
    if (!str) return "";
    return new Date(str + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
  }

  function isUpcoming(str) {
    return new Date(str + "T00:00:00") >= today;
  }

  return (
    <>
      <style>{`
        .db { min-height: 100vh; background: var(--bg); font-family: 'Segoe UI', sans-serif; }

        /* ── header ── */
        .db-header {
          background: linear-gradient(135deg, #667eea, #f093fb, #f5576c);
          height: 62px; padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 50;
          box-shadow: 0 4px 20px rgba(102,126,234,0.35);
        }
        .db-logo { font-size: 17px; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px; }
        .db-right { display: flex; align-items: center; gap: 10px; }
        .db-user  { font-size: 13px; color: rgba(255,255,255,0.85); font-weight: 500; }
        .hdr-btn {
          background: rgba(255,255,255,0.18); border: 1.5px solid rgba(255,255,255,0.35);
          border-radius: 8px; width: 34px; height: 34px; cursor: pointer; font-size: 15px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; transition: background 0.15s;
        }
        .hdr-btn:hover { background: rgba(255,255,255,0.3); }
        .logout-btn {
          padding: 6px 14px; border: 1.5px solid rgba(255,255,255,0.4);
          border-radius: 8px; background: rgba(255,255,255,0.15); color: #fff;
          font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit;
          transition: background 0.15s;
        }
        .logout-btn:hover { background: rgba(255,255,255,0.28); }

        /* ── main ── */
        .db-main { max-width: 940px; margin: 0 auto; padding: 28px 20px; }

        /* ── stat cards ── */
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 26px; }
        .stat {
          border-radius: 14px; padding: 20px 22px; color: #fff;
          position: relative; overflow: hidden;
          box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        }
        .stat::after {
          content: ''; position: absolute; top: -18px; right: -18px;
          width: 72px; height: 72px; border-radius: 50%;
          background: rgba(255,255,255,0.13);
        }
        .stat-1 { background: linear-gradient(135deg, #667eea, #764ba2); }
        .stat-2 { background: linear-gradient(135deg, #f093fb, #f5576c); }
        .stat-3 { background: linear-gradient(135deg, #4facfe, #00f2fe); }
        .stat-lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.8); margin-bottom: 8px; }
        .stat-val { font-size: 34px; font-weight: 800; }

        /* ── toolbar ── */
        .toolbar { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
        .search-input {
          flex: 1; min-width: 160px; padding: 10px 14px;
          border: 2px solid var(--border); border-radius: 10px;
          font-size: 13.5px; color: var(--text); background: var(--input-bg);
          font-family: inherit; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.12); }
        .sort-sel {
          padding: 10px 13px; border: 2px solid var(--border); border-radius: 10px;
          font-size: 13px; color: var(--text); background: var(--input-bg);
          font-family: inherit; outline: none; cursor: pointer;
        }
        .add-btn {
          padding: 10px 20px; border: none; border-radius: 10px;
          background: linear-gradient(135deg, #667eea, #f5576c);
          color: #fff; font-size: 13.5px; font-weight: 700;
          cursor: pointer; font-family: inherit; white-space: nowrap;
          box-shadow: 0 4px 14px rgba(102,126,234,0.35);
          transition: opacity 0.2s, transform 0.15s;
        }
        .add-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        /* ── section head ── */
        .sec-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .sec-title { font-size: 16px; font-weight: 700; color: var(--text); }
        .sec-badge {
          font-size: 12px; font-weight: 700; padding: 3px 11px; border-radius: 20px;
          background: linear-gradient(135deg, #667eea, #f5576c);
          color: #fff;
        }

        /* ── event grid ── */
        .ev-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 14px; }

        /* ── event card ── */
        .ev-card {
          background: var(--card); border: 2px solid var(--border);
          border-radius: 14px; padding: 18px 20px;
          display: flex; flex-direction: column; gap: 9px;
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
          animation: fadeUp 0.3s ease both;
        }
        .ev-card:hover { box-shadow: 0 8px 28px rgba(102,126,234,0.18); transform: translateY(-3px); border-color: #667eea; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .ev-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
        .ev-title { font-size: 15px; font-weight: 700; color: var(--text); line-height: 1.3; }
        .ev-badge {
          font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 20px;
          flex-shrink: 0; letter-spacing: 0.04em;
        }
        .badge-up { background: linear-gradient(135deg, #43e97b, #38f9d7); color: #fff; }
        .badge-past { background: rgba(100,116,139,0.14); color: #64748b; }
        .ev-date { font-size: 12px; color: #667eea; font-weight: 600; display: flex; align-items: center; gap: 5px; }
        .ev-desc { font-size: 13px; color: var(--muted); line-height: 1.55; }
        .ev-actions { display: flex; gap: 8px; margin-top: 2px; }
        .btn-edit {
          flex: 1; padding: 7px 12px; border: 2px solid var(--border);
          border-radius: 8px; background: none; color: var(--muted);
          font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s;
        }
        .btn-edit:hover { border-color: #667eea; color: #667eea; background: rgba(102,126,234,0.06); }
        .btn-del {
          flex: 1; padding: 7px 12px; border: 2px solid transparent;
          border-radius: 8px; background: none; color: var(--muted);
          font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s;
        }
        .btn-del:hover { border-color: #f5576c; color: #f5576c; background: rgba(245,87,108,0.06); }

        /* ── empty ── */
        .empty { text-align: center; padding: 64px 20px; }
        .empty-icon { font-size: 56px; margin-bottom: 14px; }
        .empty-title { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
        .empty-sub { font-size: 13px; color: var(--muted); }

        /* ── delete confirm ── */
        .del-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center; z-index: 300; padding: 16px;
        }
        .del-box {
          background: var(--card); border: 2px solid var(--border);
          border-radius: 18px; padding: 32px; width: 100%; max-width: 340px;
          text-align: center; box-shadow: 0 20px 50px rgba(245,87,108,0.25);
        }
        .del-icon  { font-size: 48px; margin-bottom: 12px; }
        .del-title { font-size: 18px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
        .del-sub   { font-size: 13px; color: var(--muted); margin-bottom: 24px; }
        .del-btns  { display: flex; gap: 10px; }
        .btn-keep {
          flex: 1; padding: 11px; border: 2px solid var(--border);
          border-radius: 10px; background: none; color: var(--muted);
          font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s;
        }
        .btn-keep:hover { border-color: #667eea; color: #667eea; }
        .btn-del-confirm {
          flex: 1; padding: 11px; border: none; border-radius: 10px;
          background: linear-gradient(135deg, #f5576c, #f093fb);
          color: #fff; font-size: 14px; font-weight: 700;
          cursor: pointer; font-family: inherit; transition: opacity 0.2s;
        }
        .btn-del-confirm:hover { opacity: 0.88; }

        @media (max-width: 600px) {
          .stats { grid-template-columns: 1fr 1fr; }
          .stat:last-child { grid-column: span 2; }
          .db-header { padding: 0 16px; }
          .db-user { display: none; }
          .db-main { padding: 20px 14px; }
        }
      `}</style>

      <div className="db">

        {/* Header */}
        <header className="db-header">
          <div className="db-logo">📅 EventMgr</div>
          <div className="db-right">
            <span className="db-user">Hi, {user} 👋</span>
            <button className="hdr-btn" onClick={onToggleDark} title="Toggle dark mode">
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button className="logout-btn" onClick={onLogout}>Sign out</button>
          </div>
        </header>

        <main className="db-main">

          {/* Stats */}
          <div className="stats">
            <div className="stat stat-1">
              <div className="stat-lbl">Total Events</div>
              <div className="stat-val">{events.length}</div>
            </div>
            <div className="stat stat-2">
              <div className="stat-lbl">Upcoming</div>
              <div className="stat-val">{upcoming}</div>
            </div>
            <div className="stat stat-3">
              <div className="stat-lbl">Past</div>
              <div className="stat-val">{past}</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="toolbar">
            <input
              className="search-input"
              placeholder="🔍  Search events…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select className="sort-sel" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="date-asc">Date ↑</option>
              <option value="date-desc">Date ↓</option>
              <option value="title-asc">Title A–Z</option>
              <option value="title-desc">Title Z–A</option>
            </select>
            <button className="add-btn" onClick={() => setModal("add")}>
              + Add Event
            </button>
          </div>

          {/* Section header */}
          <div className="sec-head">
            <div className="sec-title">All Events</div>
            <div className="sec-badge">{filtered.length} / {events.length}</div>
          </div>

          {/* Event list */}
          {filtered.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">{events.length === 0 ? "📭" : "🔍"}</div>
              <div className="empty-title">
                {events.length === 0 ? "No events yet" : "Nothing found"}
              </div>
              <div className="empty-sub">
                {events.length === 0 ? "Click '+ Add Event' to create your first one." : "Try a different search term."}
              </div>
            </div>
          ) : (
            <div className="ev-grid">
              {filtered.map((ev, i) => (
                <div className="ev-card" key={ev.id} style={{ animationDelay: `${i * 45}ms` }}>
                  <div className="ev-top">
                    <div className="ev-title">{ev.title}</div>
                    <span className={`ev-badge ${isUpcoming(ev.date) ? "badge-up" : "badge-past"}`}>
                      {isUpcoming(ev.date) ? "Upcoming" : "Past"}
                    </span>
                  </div>
                  <div className="ev-date">📅 {fmtDate(ev.date)}</div>
                  {ev.description && <div className="ev-desc">{ev.description}</div>}
                  <div className="ev-actions">
                    <button className="btn-edit" onClick={() => setModal(ev)}>✏️ Edit</button>
                    <button className="btn-del"  onClick={() => setDelId(ev.id)}>🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>

      {/* Add / Edit modal */}
      {modal && (
        <EventModal
          event={modal === "add" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete confirm */}
      {delId && (
        <div className="del-overlay" onClick={e => e.target === e.currentTarget && setDelId(null)}>
          <div className="del-box">
            <div className="del-icon">🗑️</div>
            <div className="del-title">Delete Event?</div>
            <div className="del-sub">This action cannot be undone.</div>
            <div className="del-btns">
              <button className="btn-keep"        onClick={() => setDelId(null)}>Keep it</button>
              <button className="btn-del-confirm" onClick={() => deleteEvent(delId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;