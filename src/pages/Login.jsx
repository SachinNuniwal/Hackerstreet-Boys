import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CREDS = { username: "admin", password: "1234" };

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
      setError("Wrong username or password. Try admin / 1234");
    }
    setLoading(false);
  }

  function onEnter(e) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #f093fb 50%, #f5576c 100%);
          font-family: 'Segoe UI', sans-serif;
        }
        .login-card {
          background: #fff;
          border-radius: 20px;
          padding: 44px 40px;
          width: 370px;
          box-shadow: 0 25px 60px rgba(102, 126, 234, 0.35);
        }
        .login-logo {
          text-align: center;
          font-size: 48px;
          margin-bottom: 10px;
        }
        .login-title {
          font-size: 26px;
          font-weight: 800;
          text-align: center;
          background: linear-gradient(90deg, #667eea, #f5576c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 4px;
        }
        .login-sub {
          text-align: center;
          font-size: 13px;
          color: #999;
          margin-bottom: 28px;
        }
        .f-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #667eea;
          margin-bottom: 6px;
        }
        .f-input {
          width: 100%;
          padding: 12px 14px;
          border: 2px solid #e8eaf6;
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          color: #333;
          background: #f8f9ff;
          outline: none;
          margin-bottom: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .f-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102,126,234,0.12);
          background: #fff;
        }
        .f-input.err { border-color: #f5576c; }
        .login-error {
          font-size: 12.5px;
          color: #f5576c;
          background: rgba(245,87,108,0.08);
          border-left: 3px solid #f5576c;
          padding: 9px 12px;
          border-radius: 8px;
          margin-bottom: 14px;
        }
        .login-btn {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #667eea, #f5576c);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 6px 20px rgba(102,126,234,0.4);
        }
        .login-btn:hover    { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(102,126,234,0.45); }
        .login-btn:active   { transform: scale(0.97); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .login-hint {
          text-align: center;
          font-size: 12px;
          color: #bbb;
          margin-top: 16px;
          padding: 10px;
          background: #f8f9ff;
          border-radius: 8px;
          border: 1px dashed #e8eaf6;
        }
        .login-hint b { color: #667eea; }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">📅</div>
          <div className="login-title">Event Manager</div>
          <div className="login-sub">Sign in to manage your events</div>

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
            Hint: <b>admin</b> / <b>1234</b>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;