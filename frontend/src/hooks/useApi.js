import { useState, useEffect, useRef } from 'react';
import { getDashboardStats } from '../api/services.js';

// Simple in-memory cache — survives component unmount/remount (page navigation)
const cache = {
  dashboard: null,
  dashboardTime: 0,
  TTL: 30000 // 30 seconds
};

export const useDashboard = () => {
  const [stats, setStats] = useState(cache.dashboard); // show cached immediately
  const [loading, setLoading] = useState(!cache.dashboard);
  const [error, setError] = useState(null);

  useEffect(() => {
    const now = Date.now();
    // Skip fetch if cache is fresh
    if (cache.dashboard && now - cache.dashboardTime < cache.TTL) {
      setStats(cache.dashboard);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        if (!cancelled) {
          cache.dashboard = response.data.stats;
          cache.dashboardTime = Date.now();
          setStats(response.data.stats);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  return { stats, loading, error };
};

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const username = localStorage.getItem('username');
    return username ? { username } : null;
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // Clear cache on logout
    cache.dashboard = null;
    setUser(null);
  };

  return { user, logout };
};
