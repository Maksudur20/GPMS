import prisma from '../utils/prisma.js';
import { comparePasswords } from '../utils/cryptography.js';


export const getSettings = async (req, res) => {
  try {
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          currencyApiUrl: process.env.CURRENCY_API_URL,
          chargePer1000: 12.50,
          steamFeePercent: 3.65,
          steamFeeCalcMode: 'Fixed Percentage',
          minProfit: 50,
          maxProfit: 100
        }
      });
    }

    res.json({
      message: 'Settings retrieved successfully',
      settings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { currencyApiUrl, chargePer1000, steamFeePercent, steamFeeCalcMode, minProfit, maxProfit, password } = req.body;

    // Password is required to update settings
    if (!password) {
      return res.status(400).json({ error: 'Password is required to update settings' });
    }

    // Verify password against the logged-in admin
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Admin not found' });
    }

    const isValidPassword = await comparePasswords(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Password verified — proceed to update settings
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          currencyApiUrl: currencyApiUrl || process.env.CURRENCY_API_URL,
          chargePer1000: parseFloat(chargePer1000) || 12.50,
          steamFeePercent: parseFloat(steamFeePercent) || 3.65,
          steamFeeCalcMode: steamFeeCalcMode || 'Fixed Percentage',
          minProfit: parseFloat(minProfit) || 50,
          maxProfit: parseFloat(maxProfit) || 100
        }
      });
    } else {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          currencyApiUrl: currencyApiUrl || settings.currencyApiUrl,
          chargePer1000: parseFloat(chargePer1000) || settings.chargePer1000,
          steamFeePercent: parseFloat(steamFeePercent) || settings.steamFeePercent,
          steamFeeCalcMode: steamFeeCalcMode || settings.steamFeeCalcMode,
          minProfit: parseFloat(minProfit) || settings.minProfit,
          maxProfit: parseFloat(maxProfit) || settings.maxProfit
        }
      });
    }

    // Invalidate the cache in orderController so new settings apply immediately
    const { settingsCache } = await import('./orderController.js');
    if (settingsCache) settingsCache.data = null;

    res.json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
