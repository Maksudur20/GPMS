import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Button } from './Common.jsx';

export const InvoiceModal = ({ order, onClose }) => {
  const invoiceRef = useRef();

  const handleDownloadPdf = () => {
    const element = invoiceRef.current;
    const opt = {
      margin:       10,
      filename:     `Invoice-${order.invoiceNumber || order.productId}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    // Simplest way to print specific div without external libraries
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    // Reload the page to restore react bindings
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header Actions */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Invoice</h2>
          <div className="space-x-2">
            <Button variant="secondary" onClick={handlePrint}>Print</Button>
            <Button variant="primary" onClick={handleDownloadPdf}>Download PDF</Button>
            <Button variant="danger" onClick={onClose}>Close</Button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8 overflow-y-auto" ref={invoiceRef}>
          {/* Company Header */}
          <div className="text-center mb-8 border-b pb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">MRS Game Store</h1>
          </div>

          {/* Invoice Details */}
          <div className="flex justify-between mb-8">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Invoice To</p>
              <p className="text-lg font-bold text-gray-800">{order.customerName || 'Customer'}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Invoice Info</p>
              <p className="text-gray-800"><span className="font-medium">Invoice No:</span> {order.invoiceNumber || 'N/A'}</p>
              <p className="text-gray-800"><span className="font-medium">Product ID:</span> {order.productId || 'N/A'}</p>
              <p className="text-gray-800"><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Order Details */}
          <div className="mb-8 border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-3 px-4 font-semibold text-gray-700">Item</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 text-right">Status</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b last:border-0">
                  <td className="py-4 px-4 text-gray-800">{order.gameName}</td>
                  <td className="py-4 px-4 text-right">
                    <span 
                      className={`text-sm font-bold ${
                        order.status === 'Delivered' ? 'text-green-600' :
                        order.status === 'Pending' ? 'text-yellow-600' :
                        order.status === 'Cancelled' ? 'text-red-600' :
                        'text-blue-600'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-900 text-right">
                    {order.customerPrice} BDT
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-1/2">
              <div className="flex justify-between py-2 border-t-2 border-gray-800 font-bold text-lg">
                <span>Total Amount:</span>
                <span>{order.customerPrice} BDT</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t text-gray-500 mt-auto">
            <p className="italic">Thank you for purchasing from MRS Game Store.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
