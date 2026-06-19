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

export const convertToBdt = (amount, exchangeRate) => {
  return amount * exchangeRate;
};

export const roundAmount = (amount) => {
  // Round to nearest 5
  return Math.ceil(amount / 5) * 5;
};

export const calculatePaymentCharge = (amount, chargeRate) => {
  return (chargeRate / 1000) * amount;
};

export const calculateFinalCost = (roundedAmount, paymentCharge) => {
  return roundedAmount + paymentCharge;
};

export const calculateProfit = (customerPrice, finalCost) => {
  return customerPrice - finalCost;
};
