import React, { useState } from 'react';
import { createOrder } from '../api/services.js';
import { Button } from './Common.jsx';

export const OrderForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    gameName: '',
    steamPriceInr: '',
    customerPrice: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createOrder(formData);
      setFormData({ gameName: '', steamPriceInr: '', customerPrice: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <label className="block text-sm font-medium text-gray-700">Steam Price (INR)</label>
        <input
          type="number"
          name="steamPriceInr"
          value={formData.steamPriceInr}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter price in INR"
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
        {loading ? 'Creating...' : 'Create Order'}
      </Button>
    </form>
  );
};
