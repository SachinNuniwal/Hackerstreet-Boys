import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const CREDS = { username: "Sachin yadav", password: "Sachu yadav" };

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setError("");
  }

  async function handleSubmit() {
    if (!form.username || !form.password) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    if (form.username === CREDS.username && form.password === CREDS.password) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");

    } else {
      setError("Wrong username or password. Try Sachin yadav / Sachu yadav");
    }
    setLoading(false);
  }

  function onEnter(e) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <>
      <div className="login-page">
        <div className="bubbles">
         <span></span>
         <span></span>
         <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="login-card">
          <div className="login-logo">📅</div>
          <div className="login-title">Rps Engineering and Technology Event handler</div>
          <div className="login-sub">Sign in to explore your events</div>

          <label className="f-label">Username</label>
          <input
            type="text"
            className={`f-input ${error ? "err" : ""}`}
            placeholder="Enter username"
            value={form.username}
            onChange={e => handleChange("username", e.target.value)}
            onKeyDown={onEnter}
          />

          <label className="f-label">Password</label>
          <input
            type="password"
            className={`f-input ${error ? "err" : ""}`}
            placeholder="Enter password"
            value={form.password}
            onChange={e => handleChange("password", e.target.value)}
            onKeyDown={onEnter}
          />

          {error && <div className="login-error">⚠️ {error}</div>}

          <button className="login-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>

          <div className="login-hint">
            Hint: <b>Sachin yadav</b> / <b>Sachu yadav</b>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;