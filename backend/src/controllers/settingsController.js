import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSettings = async (req, res) => {
  try {
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          currencyApiUrl: process.env.CURRENCY_API_URL,
          chargePer1000: 12.50,
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
    const { currencyApiUrl, chargePer1000, minProfit, maxProfit } = req.body;

    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          currencyApiUrl: currencyApiUrl || process.env.CURRENCY_API_URL,
          chargePer1000: parseFloat(chargePer1000) || 12.50,
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
          minProfit: parseFloat(minProfit) || settings.minProfit,
          maxProfit: parseFloat(maxProfit) || settings.maxProfit
        }
      });
    }

    res.json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
