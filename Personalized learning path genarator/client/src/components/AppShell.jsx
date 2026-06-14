import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function AppShell({ children }) {
  const { user, logout, theme, setTheme } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === "admin";

  return (
    <div className="app-shell">
      <div className="bg-orb orb-one" />
      <div className="bg-orb orb-two" />
      <header className="topbar glass-card">
        <Link to="/" className="brand">
          LearnPath AI
        </Link>
        <nav className="nav-links">
          {!isAdmin && <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>}
          {!isAdmin && <Link to="/preferences" className={location.pathname === "/preferences" ? "active" : ""}>Setup</Link>}
          {!isAdmin && <Link to="/path" className={location.pathname === "/path" ? "active" : ""}>Path</Link>}
          {!isAdmin && <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>Dashboard</Link>}
          {isAdmin && <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>Admin Console</Link>}
        </nav>
        <div className="topbar-actions">
          {user && (
            <div className="user-profile">
              <span className="user-name-tag">{user.name}</span>
            </div>
          )}
          <button className="secondary-button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "Light" : "Dark"} mode
          </button>
          {user ? (
            <button className="primary-button" onClick={logout}>
              Logout
            </button>
          ) : location.pathname !== "/login" ? (
            <Link to="/login" className="primary-button inline-button">
              Login
            </Link>
          ) : (
            <Link to="/register" className="primary-button inline-button">
              Register
            </Link>
          )}
        </div>
      </header>
      <main className="page-transition">{children}</main>
    </div>
  );
}
