import { PrismaClient } from '@prisma/client';
import {
  fetchExchangeRate,
  convertInrToBdt,
  roundAmount,
  calculatePaymentCharge,
  calculateFinalCost,
  calculateProfit
} from '../utils/currency.js';

const prisma = new PrismaClient();

export const createOrder = async (req, res) => {
  try {
    const { gameName, steamPriceInr, customerPrice } = req.body;

    // Validation
    if (!gameName || !steamPriceInr || !customerPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch exchange rate
    const exchangeRate = await fetchExchangeRate();

    // Calculations
    const convertedBdt = convertInrToBdt(steamPriceInr, exchangeRate);
    const roundedBdt = roundAmount(convertedBdt);
    const chargePer1000 = parseFloat(process.env.CHARGE_PER_1000) || 12.50;
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

      const convertedBdt = convertInrToBdt(newSteamPrice, exchangeRate);
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
