import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AddTask from "./pages/AddTask";
import Login from "./pages/Login";

function AppShell() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {isAuthenticated && (
        <nav className="navbar">
          <div className="navbar-container">
            <NavLink to="/" className="navbar-brand">
              TaskFlow Pro
            </NavLink>

            <div className="navbar-nav">
              <NavLink 
                to="/" 
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} 
                end
              >
                Dashboard
              </NavLink>
              
              <NavLink 
                to="/add" 
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                New Task
              </NavLink>

              <div className="flex items-center gap-4 ml-6">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.username || user?.name || 'User'}
                </span>

                <button 
                  className="btn btn-ghost"
                  onClick={() => setDarkMode(d => !d)}
                  title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? "☀️" : "🌙"}
                </button>

                <button 
                  className="btn btn-ghost"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className={isAuthenticated ? "main-content" : ""}>
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add" 
            element={
              <ProtectedRoute>
                <AddTask />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
