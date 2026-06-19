import { PrismaClient } from '@prisma/client';
import {
  fetchExchangeRate,
  convertToBdt,
  roundAmount,
  calculatePaymentCharge,
  calculateFinalCost,
  calculateProfit
} from '../utils/currency.js';

const prisma = new PrismaClient();

// Helper to get settings from DB
const getDbSettings = async () => {
  const settings = await prisma.settings.findFirst();
  return {
    currencyApiUrl: settings?.currencyApiUrl || process.env.CURRENCY_API_URL,
    chargePer1000: settings ? parseFloat(settings.chargePer1000) : (parseFloat(process.env.CHARGE_PER_1000) || 12.50),
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
    const convertedBdt = convertToBdt(steamPriceInr, exchangeRate);
    const roundedBdt = roundAmount(convertedBdt);
    const paymentCharge = calculatePaymentCharge(roundedBdt, dbSettings.chargePer1000);
    const finalCost = calculateFinalCost(roundedBdt, paymentCharge);
    const profit = calculateProfit(customerPrice, finalCost);

    res.json({
      preview: {
        currency: sourceCurrency,
        steamPrice: parseFloat(steamPriceInr),
        exchangeRate: parseFloat(exchangeRate.toFixed(4)),
        convertedBdt: parseFloat(convertedBdt.toFixed(2)),
        roundedBdt: parseFloat(roundedBdt.toFixed(2)),
        paymentCharge: parseFloat(paymentCharge.toFixed(2)),
        finalCost: parseFloat(finalCost.toFixed(2)),
        customerPrice: parseFloat(customerPrice),
        profit: parseFloat(profit.toFixed(2))
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

    // Validation
    if (!gameName || !steamPriceInr || !customerPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch settings from DB
    const dbSettings = await getDbSettings();

    // Fetch exchange rate
    const exchangeRate = await fetchExchangeRate(sourceCurrency, dbSettings.currencyApiUrl);

    // Calculations
    const convertedBdt = convertToBdt(steamPriceInr, exchangeRate);
    const roundedBdt = roundAmount(convertedBdt);
    const paymentCharge = calculatePaymentCharge(roundedBdt, chargePer1000);
    const finalCost = calculateFinalCost(roundedBdt, paymentCharge);
    const profit = calculateProfit(customerPrice, finalCost);

    // Create order
    const order = await prisma.order.create({
      data: {
        gameName,
        steamPriceInr: parseFloat(steamPriceInr),
        exchangeRate: parseFloat(exchangeRate),
        convertedBdt: parseFloat(convertedBdt),
        roundedBdt: parseFloat(roundedBdt),
        paymentCharge: parseFloat(paymentCharge),
        finalCost: parseFloat(finalCost),
        customerPrice: parseFloat(customerPrice),
        profit: parseFloat(profit),
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

    // Recalculate if prices changed
    let updateData = { gameName, status };

    if (steamPriceInr || customerPrice) {
      const exchangeRate = order.exchangeRate;
      const newSteamPrice = parseFloat(steamPriceInr) || order.steamPriceInr;
      const newCustomerPrice = parseFloat(customerPrice) || order.customerPrice;

      const convertedBdt = convertToBdt(newSteamPrice, exchangeRate);
      const roundedBdt = roundAmount(convertedBdt);
      const chargePer1000 = parseFloat(process.env.CHARGE_PER_1000) || 12.50;
      const paymentCharge = calculatePaymentCharge(roundedBdt, chargePer1000);
      const finalCost = calculateFinalCost(roundedBdt, paymentCharge);
      const profit = calculateProfit(newCustomerPrice, finalCost);

      updateData = {
        ...updateData,
        steamPriceInr: newSteamPrice,
        customerPrice: newCustomerPrice,
        convertedBdt: parseFloat(convertedBdt),
        roundedBdt: parseFloat(roundedBdt),
        paymentCharge: parseFloat(paymentCharge),
        finalCost: parseFloat(finalCost),
        profit: parseFloat(profit)
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
