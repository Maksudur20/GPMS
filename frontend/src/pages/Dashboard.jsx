import React, { useState, useEffect } from 'react';
import { useDashboard } from '../hooks/useApi.js';
import { StatCard, Card } from '../components/Common.jsx';
import { formatCurrency } from '../utils/helpers.js';

export const Dashboard = () => {
  const { stats, loading, error } = useDashboard();

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon="📦"
          color="border-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon="💰"
          color="border-green-500"
        />
        <StatCard
          title="Total Profit"
          value={formatCurrency(stats?.totalProfit || 0)}
          icon="📈"
          color="border-purple-500"
        />
        <StatCard
          title="Avg Profit/Order"
          value={formatCurrency(stats?.avgProfitPerOrder || 0)}
          icon="🎯"
          color="border-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Today's Orders" className="border-l-4 border-blue-500">
          <p className="text-2xl font-bold text-blue-600">{stats?.todayOrders || 0}</p>
        </Card>
        <Card title="Today's Revenue" className="border-l-4 border-green-500">
          <p className="text-2xl font-bold text-green-600">{formatCurrency(stats?.todayRevenue || 0)}</p>
        </Card>
        <Card title="Today's Profit" className="border-l-4 border-purple-500">
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats?.todayProfit || 0)}</p>
        </Card>
      </div>
    </div>
  );
};
