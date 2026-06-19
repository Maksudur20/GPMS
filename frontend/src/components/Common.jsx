import React from 'react';

export const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className="text-3xl opacity-50">{icon}</div>
      </div>
    </div>
  );
};

export const Button = ({ children, onClick, variant = 'primary', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600'
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export const Card = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {title && <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>}
      {children}
    </div>
  );
};

export const Table = ({ headers, rows }) => {
  return (
    <div className="overflow-x-auto overflow-y-visible" style={{ overflow: 'visible' }}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {headers.map((header, idx) => (
              <th key={idx} className="text-left py-3 px-4 font-semibold text-gray-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-b border-gray-100 hover:bg-gray-50">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="py-3 px-4 text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
