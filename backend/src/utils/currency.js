import axios from 'axios';

export const fetchExchangeRate = async (sourceCurrency = 'INR', apiUrl = null) => {
  try {
    const url = apiUrl || process.env.CURRENCY_API_URL;
    const response = await axios.get(url);
    const rates = response.data.conversion_rates;
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

// Step 4: Payment Charge = steamCost × (chargePer1000 / 1000)
export const calculatePaymentCharge = (steamCost, chargePer1000) => {
  return steamCost * (chargePer1000 / 1000);
};

// Step 5: Final Cost = steamCost + paymentCharge
export const calculateFinalCost = (steamCost, paymentCharge) => {
  return steamCost + paymentCharge;
};

// Step 6: Profit = customerPrice - finalCost
export const calculateProfit = (customerPrice, finalCost) => {
  return customerPrice - finalCost;
};

// Complete calculation pipeline
export const calculateOrder = (gamePrice, exchangeRate, steamFeePercent, chargePer1000, customerPrice) => {
  const baseCost = calculateBaseCost(gamePrice, exchangeRate);
  const steamFeeAmount = calculateSteamFee(baseCost, steamFeePercent);
  const steamCost = calculateSteamCost(baseCost, steamFeeAmount);
  const paymentCharge = calculatePaymentCharge(steamCost, chargePer1000);
  const finalCost = calculateFinalCost(steamCost, paymentCharge);
  const profit = calculateProfit(customerPrice, finalCost);

  return {
    baseCost: parseFloat(baseCost.toFixed(2)),
    steamFeeAmount: parseFloat(steamFeeAmount.toFixed(2)),
    steamCost: parseFloat(steamCost.toFixed(2)),
    paymentCharge: parseFloat(paymentCharge.toFixed(2)),
    finalCost: parseFloat(finalCost.toFixed(2)),
    profit: parseFloat(profit.toFixed(2))
  };
};
