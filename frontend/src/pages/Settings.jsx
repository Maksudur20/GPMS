import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../api/services.js';
import { Card, Button } from '../components/Common.jsx';

let cachedSettings = null;
let cachedSettingsTime = 0;
const CACHE_TTL = 30000;

export const Settings = () => {
  const [settings, setSettings] = useState(cachedSettings);
  const [formData, setFormData] = useState(cachedSettings || {});
  const [loading, setLoading] = useState(!cachedSettings);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (cachedSettings && Date.now() - cachedSettingsTime < CACHE_TTL) {
        setLoading(false);
        return;
      }

      if (!cachedSettings) setLoading(true);
      try {
        const response = await getSettings();
        cachedSettings = response.data.settings;
        cachedSettingsTime = Date.now();
        setSettings(cachedSettings);
        setFormData(cachedSettings);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setPasswordError(null);
    setPassword('');
    setShowPasswordModal(true);
  };

  const handleConfirmSave = async () => {
    if (!password) {
      setPasswordError('Please enter your password');
      return;
    }

    setLoading(true);
    setPasswordError(null);

    try {
      const response = await updateSettings({ ...formData, password });
      cachedSettings = response.data.settings;
      cachedSettingsTime = Date.now();
      setSettings(cachedSettings);
      setSuccess(true);
      setShowPasswordModal(false);
      setPassword('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update settings';
      if (errorMsg.toLowerCase().includes('password') || err.response?.status === 401) {
        setPasswordError(errorMsg);
      } else {
        setError(errorMsg);
        setShowPasswordModal(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordError(null);
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
            <label className="block text-sm font-medium text-gray-700">Steam Fee Percentage (%)</label>
            <input
              type="number"
              name="steamFeePercent"
              value={formData.steamFeePercent || ''}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="3.65"
            />
            <p className="text-xs text-gray-400 mt-1">Includes foreign transaction markup, card network fees, and bank conversion charges</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Steam Fee Calculation Mode</label>
            <select
              name="steamFeeCalcMode"
              value={formData.steamFeeCalcMode || 'Fixed Percentage'}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white"
            >
              <option value="Fixed Percentage">Fixed Percentage</option>
              <option value="Auto Calculation">Auto Calculation (Future)</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">Auto Calculation will use actual bank charges to determine fee percentage</p>
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

      {/* Password Confirmation Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Password</h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter your admin password to save settings changes.
            </p>

            {passwordError && (
              <div className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">
                {passwordError}
              </div>
            )}

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 mb-4"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmSave()}
            />

            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={handleCancelModal} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleConfirmSave} disabled={loading}>
                {loading ? 'Verifying...' : 'Confirm & Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
