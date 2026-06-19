import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../api/services.js';
import { Card, Button } from '../components/Common.jsx';

export const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await getSettings();
        setSettings(response.data.settings);
        setFormData(response.data.settings);
      } catch (err) {
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

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
    setSuccess(false);

    try {
      await updateSettings(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !settings) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      <Card title="System Configuration">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">Settings updated successfully!</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Currency API URL</label>
            <input
              type="text"
              name="currencyApiUrl"
              value={formData.currencyApiUrl || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter currency API URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Charge Per 1000</label>
            <input
              type="number"
              name="chargePer1000"
              value={formData.chargePer1000 || ''}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Min Profit (BDT)</label>
            <input
              type="number"
              name="minProfit"
              value={formData.minProfit || ''}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Max Profit (BDT)</label>
            <input
              type="number"
              name="maxProfit"
              value={formData.maxProfit || ''}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
