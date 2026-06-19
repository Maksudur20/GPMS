import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard.jsx';
import { Orders } from './pages/Orders.jsx';
import { Settings } from './pages/Settings.jsx';
import { Login } from './pages/Login.jsx';
import { Layout } from './components/Layout.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Login onLoginSuccess={() => setIsAuthenticated(true)} />
            )
          }
        />

        {isAuthenticated ? (
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
        ) : (
          <Route path="/" element={<Navigate to="/login" />} />
        )}

        {isAuthenticated ? (
          <Route
            path="/orders"
            element={
              <Layout>
                <Orders />
              </Layout>
            }
          />
        ) : (
          <Route path="/orders" element={<Navigate to="/login" />} />
        )}

        {isAuthenticated ? (
          <Route
            path="/settings"
            element={
              <Layout>
                <Settings />
              </Layout>
            }
          />
        ) : (
          <Route path="/settings" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
