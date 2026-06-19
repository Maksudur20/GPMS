export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT'
  }).format(value);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const calculateProfit = (customerPrice, finalCost) => {
  return customerPrice - finalCost;
};

export const getProfitColor = (profit, minProfit = 50, maxProfit = 100) => {
  if (profit < minProfit) return 'text-red-500';
  if (profit > maxProfit) return 'text-green-500';
  return 'text-yellow-500';
};
