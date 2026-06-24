import prisma from '../utils/prisma.js';

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Run all 4 queries in parallel — much faster than sequential
    const [
      totalAgg,
      todayAgg,
      totalCount,
      todayCount
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { customerPrice: true, profit: true },
        _count: true,
        _avg: { profit: true }
      }),
      prisma.order.aggregate({
        _sum: { customerPrice: true, profit: true },
        _count: true,
        where: { createdAt: { gte: today, lt: tomorrow } }
      }),
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: today, lt: tomorrow } } })
    ]);

    res.json({
      message: 'Dashboard stats retrieved successfully',
      stats: {
        totalOrders: totalCount,
        totalRevenue: parseFloat((totalAgg._sum.customerPrice || 0).toString()).toFixed(2) * 1,
        totalProfit: parseFloat((totalAgg._sum.profit || 0).toString()).toFixed(2) * 1,
        avgProfitPerOrder: parseFloat((totalAgg._avg.profit || 0).toString()).toFixed(2) * 1,
        todayOrders: todayCount,
        todayRevenue: parseFloat((todayAgg._sum.customerPrice || 0).toString()).toFixed(2) * 1,
        todayProfit: parseFloat((todayAgg._sum.profit || 0).toString()).toFixed(2) * 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      select: { createdAt: true, customerPrice: true, profit: true },
      orderBy: { createdAt: 'desc' }
    });

    const dailyStats = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      if (!dailyStats[date]) {
        dailyStats[date] = { date, orders: 0, revenue: 0, profit: 0 };
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
      analytics: { daily: dailyAnalytics }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
