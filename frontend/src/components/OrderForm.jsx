import React, { useState } from 'react';
import { previewOrder, createOrder } from '../api/services.js';
import { Button } from './Common.jsx';

const CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee (₹)' },
  { code: 'USD', name: 'US Dollar ($)' },
  { code: 'EUR', name: 'Euro (€)' },
  { code: 'GBP', name: 'British Pound (£)' },
  { code: 'AED', name: 'UAE Dirham (AED)' },
  { code: 'SAR', name: 'Saudi Riyal (SAR)' },
  { code: 'CAD', name: 'Canadian Dollar (C$)' },
  { code: 'AUD', name: 'Australian Dollar (A$)' },
  { code: 'TRY', name: 'Turkish Lira (₺)' },
  { code: 'ARS', name: 'Argentine Peso (ARS)' },
  { code: 'RUB', name: 'Russian Ruble (₽)' },
  { code: 'BRL', name: 'Brazilian Real (R$)' },
  { code: 'KZT', name: 'Kazakh Tenge (₸)' },
  { code: 'PKR', name: 'Pakistani Rupee (PKR)' },
  { code: 'MYR', name: 'Malaysian Ringgit (RM)' },
  { code: 'IDR', name: 'Indonesian Rupiah (Rp)' },
  { code: 'PHP', name: 'Philippine Peso (₱)' },
  { code: 'THB', name: 'Thai Baht (฿)' },
  { code: 'VND', name: 'Vietnamese Dong (₫)' },
  { code: 'CNY', name: 'Chinese Yuan (¥)' },
  { code: 'JPY', name: 'Japanese Yen (¥)' },
  { code: 'KRW', name: 'South Korean Won (₩)' },
];

export const OrderForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    gameName: '',
    steamPriceInr: '',
    customerPrice: '',
    currency: 'INR'
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreview = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await previewOrder(formData);
      setPreview(response.data.preview);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate preview');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      await createOrder(formData);
      setFormData({ gameName: '', steamPriceInr: '', customerPrice: '', currency: formData.currency });
      setPreview(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPreview = () => {
    setPreview(null);
  };

  // Show preview/overview
  if (preview) {
    return (
      <div className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <h3 className="text-lg font-semibold text-gray-800">Order Overview</h3>
        <p className="text-sm text-gray-500">Review the details below before confirming.</p>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-gray-500">Game Name</div>
            <div className="font-medium text-gray-800">{formData.gameName}</div>

            <div className="text-gray-500">Game Price</div>
            <div className="font-medium text-gray-800">{preview.gamePrice} {preview.currency}</div>

            <div className="text-gray-500">Currency Code</div>
            <div className="font-medium text-gray-800">{preview.currency}</div>

            <div className="text-gray-500">Exchange Rate ({preview.currency} → BDT)</div>
            <div className="font-medium text-gray-800">{preview.exchangeRate}</div>

            <div className="border-t col-span-2 my-1 border-gray-300"></div>

            <div className="text-gray-500">Base Cost</div>
            <div className="font-medium text-gray-800">৳ {preview.baseCost.toFixed(2)}</div>

            <div className="text-gray-500">Steam/Bank Fee ({preview.steamFeePercent}%)</div>
            <div className="font-medium text-gray-800">৳ {preview.steamFeeAmount.toFixed(2)}</div>

            <div className="text-gray-500">Steam Cost</div>
            <div className="font-medium text-blue-600">৳ {preview.steamCost.toFixed(2)}</div>

            <div className="text-gray-500">Payment Charge</div>
            <div className="font-medium text-gray-800">৳ {preview.paymentCharge.toFixed(2)}</div>

            <div className="text-gray-500">Final Cost</div>
            <div className="font-medium text-blue-700 font-bold">৳ {preview.finalCost.toFixed(2)}</div>

            <div className="border-t col-span-2 my-1 border-gray-300"></div>

            <div className="text-gray-500">Customer Price</div>
            <div className="font-medium text-gray-800">৳ {preview.customerPrice.toFixed(2)}</div>

            <div className="text-gray-500 font-semibold">Profit</div>
            <div className={`font-bold text-lg ${preview.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ৳ {preview.profit.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? 'Creating...' : 'Confirm & Create Order'}
          </Button>
          <Button variant="secondary" onClick={handleCancelPreview} disabled={loading}>
            Go Back & Edit
          </Button>
        </div>
      </div>
    );
  }

  // Show form
  return (
    <form onSubmit={handlePreview} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Game Name</label>
        <input
          type="text"
          name="gameName"
          value={formData.gameName}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter game name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Currency</label>
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white"
        >
          {CURRENCIES.map(c => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Game Price ({formData.currency})</label>
        <input
          type="number"
          name="steamPriceInr"
          value={formData.steamPriceInr}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder={`Enter price in ${formData.currency}`}
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Customer Price (BDT)</label>
        <input
          type="number"
          name="customerPrice"
          value={formData.customerPrice}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter customer price"
          step="0.01"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Calculating...' : 'Preview Order'}
      </Button>
    </form>
  );
};
