import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ForgotPasswordModal } from "../components/ForgotPasswordModal.jsx";

export function AuthPage({ mode }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (mode === "register" && !form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const path = mode === "register" ? "/auth/register" : "/auth/login";
      const payload =
        mode === "register"
          ? form
          : {
              email: form.email,
              password: form.password
            };
      const data = await apiRequest(path, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      login(data.user, data.token);
      navigate(data.user.role === "admin" ? "/admin" : "/preferences");
    } catch (requestError) {
      setError(requestError.message);
      // If login failed and it's login mode, suggest password reset
      if (mode === "login" && requestError.message.includes("Invalid email or password")) {
        // Auto-open forgot password modal with the email pre-filled
        setShowForgotPassword(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page center-page">
      <form className="glass-card auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">{mode === "register" ? "Create account" : "Welcome back"}</span>
        <h1>{mode === "register" ? "Start your guided learning journey" : "Login to continue learning"}</h1>
        {mode === "register" && (
          <label className="field">
            <span>Name</span>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
        )}
        <label className="field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </label>
        {error && <p className="error-text">{error}</p>}
        {mode === "login" && !error && (
          <p className="muted-text" style={{ textAlign: "center", marginTop: "0.5rem" }}>
            <button
              className="link-button"
              onClick={() => setShowForgotPassword(true)}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent)",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
                fontSize: "inherit"
              }}
            >
              Forgot Password?
            </button>
          </p>
        )}
        <button className="primary-button" disabled={loading}>
          {loading ? "Please wait..." : mode === "register" ? "Register" : "Login"}
        </button>
        <p className="muted-text">
          {mode === "register" ? "Already have an account?" : "Need an account?"}{" "}
          <Link to={mode === "register" ? "/login" : "/register"}>
            {mode === "register" ? "Login" : "Register"}
          </Link>
        </p>
      </form>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        email={form.email}
      />
    </div>
  );
}
