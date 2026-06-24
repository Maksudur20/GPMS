import prisma from '../utils/prisma.js';
import {
  fetchExchangeRate,
  calculateOrder
} from '../utils/currency.js';
import { comparePasswords } from '../utils/cryptography.js';


// Cache settings for 5 minutes to prevent slow DB queries on every order preview
export const settingsCache = {
  data: null,
  lastFetch: 0,
  TTL: 5 * 60 * 1000 // 5 minutes
};

const getDbSettings = async () => {
  const now = Date.now();
  if (settingsCache.data && now - settingsCache.lastFetch < settingsCache.TTL) {
    return settingsCache.data;
  }

  const settings = await prisma.settings.findFirst();
  const parsedSettings = {
    currencyApiUrl: settings?.currencyApiUrl || process.env.CURRENCY_API_URL,
    chargePer1000: settings ? parseFloat(settings.chargePer1000) : (parseFloat(process.env.CHARGE_PER_1000) || 12.50),
    steamFeePercent: settings ? parseFloat(settings.steamFeePercent) : 3.65,
    minProfit: settings ? parseFloat(settings.minProfit) : 50,
    maxProfit: settings ? parseFloat(settings.maxProfit) : 100
  };

  settingsCache.data = parsedSettings;
  settingsCache.lastFetch = now;
  return parsedSettings;
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
        bkashSendAmount: calc.bkashSendAmount,
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

    let updateData = { status };

    if (status === 'Delivered' && !order.invoiceNumber) {
      const currentYear = new Date().getFullYear();
      const lastInvoice = await prisma.order.findFirst({
        where: { invoiceNumber: { startsWith: `INV-${currentYear}-` } },
        orderBy: { invoiceNumber: 'desc' }
      });

      let nextInvNumber = 1;
      if (lastInvoice && lastInvoice.invoiceNumber) {
        const match = lastInvoice.invoiceNumber.match(new RegExp(`INV-${currentYear}-(\\d+)`));
        if (match) {
          nextInvNumber = parseInt(match[1]) + 1;
        }
      }
      updateData.invoiceNumber = `INV-${currentYear}-${String(nextInvNumber).padStart(4, '0')}`;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData
    });

    res.json({ message: 'Status updated', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { gameName, customerName, steamPriceInr, customerPrice, currency } = req.body;
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

    const lastOrder = await prisma.order.findFirst({
      where: { productId: { not: null } },
      orderBy: { productId: 'desc' }
    });

    let nextIdNumber = 1;
    if (lastOrder && lastOrder.productId) {
      const match = lastOrder.productId.match(/MRS-(\d+)/);
      if (match) {
        nextIdNumber = parseInt(match[1]) + 1;
      }
    }
    const productId = `MRS-${String(nextIdNumber).padStart(4, '0')}`;

    const order = await prisma.order.create({
      data: {
        productId,
        gameName,
        customerName: customerName || '',
        currencyCode: sourceCurrency,
        steamPriceInr: parseFloat(steamPriceInr),
        exchangeRate: parseFloat(exchangeRate),
        baseCost: calc.baseCost,
        steamFeePercent: dbSettings.steamFeePercent,
        steamFeeAmount: calc.steamFeeAmount,
        steamCost: calc.steamCost,
        convertedBdt: calc.baseCost,
        roundedBdt: 0,
        bkashSendAmount: calc.bkashSendAmount,
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
    const { gameName, customerName, steamPriceInr, customerPrice, status, password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required to update orders' });
    }

    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const isValidPassword = await comparePasswords(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    let updateData = { gameName };
    if (customerName !== undefined) updateData.customerName = customerName;
    if (status !== undefined) updateData.status = status;

    if (status === 'Delivered' && !order.invoiceNumber) {
      const currentYear = new Date().getFullYear();
      const lastInvoice = await prisma.order.findFirst({
        where: { invoiceNumber: { startsWith: `INV-${currentYear}-` } },
        orderBy: { invoiceNumber: 'desc' }
      });

      let nextInvNumber = 1;
      if (lastInvoice && lastInvoice.invoiceNumber) {
        const match = lastInvoice.invoiceNumber.match(new RegExp(`INV-${currentYear}-(\\d+)`));
        if (match) {
          nextInvNumber = parseInt(match[1]) + 1;
        }
      }
      updateData.invoiceNumber = `INV-${currentYear}-${String(nextInvNumber).padStart(4, '0')}`;
    }

    const isPriceChanged = 
      (steamPriceInr && parseFloat(steamPriceInr) !== parseFloat(order.steamPriceInr)) || 
      (customerPrice && parseFloat(customerPrice) !== parseFloat(order.customerPrice));

    if (isPriceChanged) {
      const dbSettings = await getDbSettings();
      let exchangeRate = parseFloat(order.exchangeRate);
      if (!exchangeRate || isNaN(exchangeRate)) {
        exchangeRate = await fetchExchangeRate(order.currencyCode || 'INR', 'BDT');
      }
      
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
        exchangeRate: exchangeRate,
        baseCost: calc.baseCost,
        steamFeePercent: dbSettings.steamFeePercent,
        steamFeeAmount: calc.steamFeeAmount,
        steamCost: calc.steamCost,
        convertedBdt: calc.baseCost,
        bkashSendAmount: calc.bkashSendAmount,
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
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required to delete orders' });
    }

    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const isValidPassword = await comparePasswords(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

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
