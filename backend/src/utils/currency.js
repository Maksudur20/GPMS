import axios from 'axios';

export const fetchExchangeRate = async () => {
  try {
    const response = await axios.get(process.env.CURRENCY_API_URL);
    const rates = response.data.conversion_rates;
    return rates.BDT || 1.30; // Default fallback rate
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 1.30; // Default fallback rate
  }
};

export const convertInrToBdt = (inrAmount, exchangeRate) => {
  return inrAmount * exchangeRate;
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
