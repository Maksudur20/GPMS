import { PrismaClient } from '@prisma/client';
import {
  fetchExchangeRate,
  calculateOrder
} from '../utils/currency.js';

const prisma = new PrismaClient();

// Helper to get settings from DB
const getDbSettings = async () => {
  const settings = await prisma.settings.findFirst();
  return {
    currencyApiUrl: settings?.currencyApiUrl || process.env.CURRENCY_API_URL,
    chargePer1000: settings ? parseFloat(settings.chargePer1000) : (parseFloat(process.env.CHARGE_PER_1000) || 12.50),
    steamFeePercent: settings ? parseFloat(settings.steamFeePercent) : 3.65,
    minProfit: settings ? parseFloat(settings.minProfit) : 50,
    maxProfit: settings ? parseFloat(settings.maxProfit) : 100
  };
};

export const previewOrder = async (req, res) => {
  try {
    const { steamPriceInr, customerPrice, currency } = req.body;
    const sourceCurrency = currency || 'INR';

    if (!steamPriceInr || !customerPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const dbSettings = await getDbSettings();
    const exchangeRate = await fetchExchangeRate(sourceCurrency, dbSettings.currencyApiUrl);
    const calc = calculateOrder(
      parseFloat(steamPriceInr),
      exchangeRate,
      dbSettings.steamFeePercent,
      dbSettings.chargePer1000,
      parseFloat(customerPrice)
    );

    res.json({
      preview: {
        currency: sourceCurrency,
        gamePrice: parseFloat(steamPriceInr),
        exchangeRate: parseFloat(exchangeRate.toFixed(4)),
        baseCost: calc.baseCost,
        steamFeePercent: dbSettings.steamFeePercent,
        steamFeeAmount: calc.steamFeeAmount,
        steamCost: calc.steamCost,
        paymentCharge: calc.paymentCharge,
        finalCost: calc.finalCost,
        customerPrice: parseFloat(customerPrice),
        profit: calc.profit
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Purchased', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.json({ message: 'Status updated', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { gameName, steamPriceInr, customerPrice, currency } = req.body;
    const sourceCurrency = currency || 'INR';

    if (!gameName || !steamPriceInr || !customerPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const dbSettings = await getDbSettings();
    const exchangeRate = await fetchExchangeRate(sourceCurrency, dbSettings.currencyApiUrl);
    const calc = calculateOrder(
      parseFloat(steamPriceInr),
      exchangeRate,
      dbSettings.steamFeePercent,
      dbSettings.chargePer1000,
      parseFloat(customerPrice)
    );

    const order = await prisma.order.create({
      data: {
        gameName,
        currencyCode: sourceCurrency,
        steamPriceInr: parseFloat(steamPriceInr),
        exchangeRate: parseFloat(exchangeRate),
        baseCost: calc.baseCost,
        steamFeePercent: dbSettings.steamFeePercent,
        steamFeeAmount: calc.steamFeeAmount,
        steamCost: calc.steamCost,
        convertedBdt: calc.baseCost,
        roundedBdt: 0,
        paymentCharge: calc.paymentCharge,
        finalCost: calc.finalCost,
        customerPrice: parseFloat(customerPrice),
        profit: calc.profit,
        status: 'Pending'
      }
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      message: 'Orders retrieved successfully',
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Order retrieved successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { gameName, steamPriceInr, customerPrice, status } = req.body;

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    let updateData = { gameName, status };

    if (steamPriceInr || customerPrice) {
      const dbSettings = await getDbSettings();
      const exchangeRate = parseFloat(order.exchangeRate);
      const newSteamPrice = parseFloat(steamPriceInr) || parseFloat(order.steamPriceInr);
      const newCustomerPrice = parseFloat(customerPrice) || parseFloat(order.customerPrice);

      const calc = calculateOrder(
        newSteamPrice,
        exchangeRate,
        dbSettings.steamFeePercent,
        dbSettings.chargePer1000,
        newCustomerPrice
      );

      updateData = {
        ...updateData,
        steamPriceInr: newSteamPrice,
        customerPrice: newCustomerPrice,
        baseCost: calc.baseCost,
        steamFeePercent: dbSettings.steamFeePercent,
        steamFeeAmount: calc.steamFeeAmount,
        steamCost: calc.steamCost,
        convertedBdt: calc.baseCost,
        paymentCharge: calc.paymentCharge,
        finalCost: calc.finalCost,
        profit: calc.profit
      };
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Order updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await prisma.order.delete({
      where: { id }
    });

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
