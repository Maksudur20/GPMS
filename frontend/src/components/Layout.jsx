import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useApi.js';

export const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 relative`}>
        <div className="p-4 border-b border-gray-700">
          <h1 className={`${sidebarOpen ? 'text-xl' : 'text-xs'} font-bold`}>GPMS</h1>
        </div>

        <nav className="mt-4 space-y-2">
          <NavLink href="/" label="Dashboard" open={sidebarOpen} icon="📊" active={location.pathname === '/'} onClick={() => navigate('/')} />
          <NavLink href="/orders" label="Orders" open={sidebarOpen} icon="📦" active={location.pathname === '/orders'} onClick={() => navigate('/orders')} />
          <NavLink href="/settings" label="Settings" open={sidebarOpen} icon="⚙️" active={location.pathname === '/settings'} onClick={() => navigate('/settings')} />
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition"
          >
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-800"
          >
            ☰
          </button>
          <div className="text-gray-700 font-medium">
            Welcome, {user?.username}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const NavLink = ({ label, open, icon, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-2 rounded transition ${active ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
    >
      <span className="text-xl">{icon}</span>
      {open && <span className="ml-3">{label}</span>}
    </button>
  );
};

