import axios from 'axios';

// Cache exchange rates for 30 minutes to prevent slow API calls on every preview
const rateCache = {
  data: null,
  lastFetch: 0,
  TTL: 30 * 60 * 1000 // 30 minutes
};

export const fetchExchangeRate = async (sourceCurrency = 'INR', apiUrl = null) => {
  try {
    const now = Date.now();
    let rates;

    if (rateCache.data && now - rateCache.lastFetch < rateCache.TTL) {
      rates = rateCache.data;
    } else {
      const url = apiUrl || process.env.CURRENCY_API_URL;
      const response = await axios.get(url);
      rates = response.data.conversion_rates;
      
      // Update cache
      rateCache.data = rates;
      rateCache.lastFetch = now;
    }

    const bdtRate = rates.BDT;
    const sourceRate = rates[sourceCurrency.toUpperCase()];

    if (!sourceRate || !bdtRate) {
      throw new Error(`Currency ${sourceCurrency} not found`);
    }

    // Convert: sourceCurrency → USD → BDT
    return bdtRate / sourceRate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 1.30; // Default fallback rate
  }
};

// Step 1: Base Cost = gamePrice × exchangeRate
export const calculateBaseCost = (gamePrice, exchangeRate) => {
  return gamePrice * exchangeRate;
};

// Step 2: Steam/Bank Fee = baseCost × (steamFeePercent / 100)
export const calculateSteamFee = (baseCost, steamFeePercent) => {
  return baseCost * (steamFeePercent / 100);
};

// Step 3: Steam Cost = baseCost + steamFeeAmount
export const calculateSteamCost = (baseCost, steamFeeAmount) => {
  return baseCost + steamFeeAmount;
};

// Step 4: bKash Send Amount = Math.ceil(steamCost)
export const calculateBkashSendAmount = (steamCost) => {
  return Math.ceil(steamCost);
};

// Step 5: Payment Charge = bkashSendAmount × (chargePer1000 / 1000)
export const calculatePaymentCharge = (bkashSendAmount, chargePer1000) => {
  return bkashSendAmount * (chargePer1000 / 1000);
};

// Step 6: Final Cost = bkashSendAmount + paymentCharge
export const calculateFinalCost = (bkashSendAmount, paymentCharge) => {
  return bkashSendAmount + paymentCharge;
};

// Step 7: Profit = customerPrice - finalCost
export const calculateProfit = (customerPrice, finalCost) => {
  return customerPrice - finalCost;
};

// Complete calculation pipeline
export const calculateOrder = (gamePrice, exchangeRate, steamFeePercent, chargePer1000, customerPrice) => {
  const baseCost = calculateBaseCost(gamePrice, exchangeRate);
  const steamFeeAmount = calculateSteamFee(baseCost, steamFeePercent);
  const steamCost = calculateSteamCost(baseCost, steamFeeAmount); // Card Amount
  const bkashSendAmount = calculateBkashSendAmount(steamCost);
  const paymentCharge = calculatePaymentCharge(bkashSendAmount, chargePer1000);
  const finalCost = calculateFinalCost(bkashSendAmount, paymentCharge);
  const profit = calculateProfit(customerPrice, finalCost);

  // Use a reliable rounding function to avoid JS floating point inaccuracies like 2.975.toFixed(2) -> '2.97'
  const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

  return {
    baseCost: round2(baseCost),
    steamFeeAmount: round2(steamFeeAmount),
    steamCost: round2(steamCost),
    bkashSendAmount: round2(bkashSendAmount),
    paymentCharge: round2(paymentCharge),
    finalCost: round2(finalCost),
    profit: round2(profit)
  };
};
