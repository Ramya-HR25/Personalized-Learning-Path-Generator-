import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("learning-user");
    return raw ? JSON.parse(raw) : null;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem("learning-theme") || "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("learning-theme", theme);
  }, [theme]);

  const login = (nextUser, token) => {
    setUser(nextUser);
    localStorage.setItem("learning-user", JSON.stringify(nextUser));
    localStorage.setItem("learning-token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("learning-user");
    localStorage.removeItem("learning-token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        theme,
        setTheme: (value) => setTheme(value)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
