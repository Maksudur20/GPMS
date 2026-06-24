import React, { useState, useEffect } from 'react';
import { Button } from './Common.jsx';

export const OrderEditForm = ({ order, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    gameName: '',
    customerName: '',
    steamPriceInr: '',
    customerPrice: ''
  });

  useEffect(() => {
    if (order) {
      setFormData({
        gameName: order.gameName || '',
        customerName: order.customerName || '',
        steamPriceInr: order.steamPriceInr || '',
        customerPrice: order.customerPrice || ''
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Order</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Game Name</label>
            <input
              type="text"
              name="gameName"
              value={formData.gameName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Game Price ({order.currencyCode || 'INR'})</label>
            <input
              type="number"
              name="steamPriceInr"
              value={formData.steamPriceInr}
              onChange={handleChange}
              required
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
