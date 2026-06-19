import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req, res) => {
  try {
    const allOrders = await prisma.order.findMany();
    
    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    // Calculate stats
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + parseFloat(order.customerPrice), 0);
    const totalProfit = allOrders.reduce((sum, order) => sum + parseFloat(order.profit), 0);
    const avgProfit = totalOrders > 0 ? totalProfit / totalOrders : 0;

    const todayRevenue = todayOrders.reduce((sum, order) => sum + parseFloat(order.customerPrice), 0);
    const todayProfit = todayOrders.reduce((sum, order) => sum + parseFloat(order.profit), 0);

    res.json({
      message: 'Dashboard stats retrieved successfully',
      stats: {
        totalOrders,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalProfit: parseFloat(totalProfit.toFixed(2)),
        avgProfitPerOrder: parseFloat(avgProfit.toFixed(2)),
        todayOrders: todayOrders.length,
        todayRevenue: parseFloat(todayRevenue.toFixed(2)),
        todayProfit: parseFloat(todayProfit.toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Daily analytics
    const dailyStats = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      if (!dailyStats[date]) {
        dailyStats[date] = {
          date,
          orders: 0,
          revenue: 0,
          profit: 0
        };
      }
      dailyStats[date].orders += 1;
      dailyStats[date].revenue += parseFloat(order.customerPrice);
      dailyStats[date].profit += parseFloat(order.profit);
    });

    const dailyAnalytics = Object.values(dailyStats).map(stat => ({
      ...stat,
      revenue: parseFloat(stat.revenue.toFixed(2)),
      profit: parseFloat(stat.profit.toFixed(2))
    }));

    res.json({
      message: 'Analytics retrieved successfully',
      analytics: {
        daily: dailyAnalytics
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
