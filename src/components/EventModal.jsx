import { useState, useEffect } from "react";

function EventModal({ event, onSave, onClose }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // If editing, fill old data
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(event.date);
      setDescription(event.description);
    }
  }, [event]);

  function handleSubmit(e) {
    e.preventDefault();

    // Simple validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!date) {
      setError("Date is required");
      return;
    }

    setError("");

    onSave({
      title,
      date,
      description,
    });
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>{event ? "Edit Event" : "Add Event"}</h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit">
              {event ? "Update" : "Add"}
            </button>

            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventModal;


/* Simple Inline Styles */

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "300px",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
};