import React, { useState } from 'react';
import { Button } from './Common.jsx';

export const PasswordModal = ({ isOpen, onClose, onSubmit, title = "Confirm Password", message = "Enter your admin password to proceed." }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password');
      return;
    }
    onSubmit(password, setError, () => {
      setPassword('');
      setError(null);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="secondary" onClick={() => { setPassword(''); setError(null); onClose(); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
