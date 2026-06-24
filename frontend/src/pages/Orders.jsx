import React, { useState, useEffect, useMemo } from 'react';
import { getOrders, deleteOrder, updateOrderStatus, updateOrder, verifyAdminPassword } from '../api/services.js';
import { Card, Table, Button } from '../components/Common.jsx';
import { OrderForm } from '../components/OrderForm.jsx';
import { InvoiceModal } from '../components/InvoiceModal.jsx';
import { PasswordModal } from '../components/PasswordModal.jsx';
import { OrderEditForm } from '../components/OrderEditForm.jsx';
import { formatCurrency } from '../utils/helpers.js';

let cachedOrders = null;
let cachedOrdersTime = 0;
const CACHE_TTL = 30000;

const StatusBadge = ({ order, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const statuses = ['Pending', 'Purchased', 'Delivered', 'Cancelled'];

  const statusColors = {
    Delivered: 'bg-green-100 text-green-800 border-green-300',
    Purchased: 'bg-blue-100 text-blue-800 border-blue-300',
    Cancelled: 'bg-red-100 text-red-800 border-red-300',
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  };

  const handleToggle = (e) => {
    if (!isOpen) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.left });
    }
    setIsOpen(!isOpen);
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === order.status) {
      setIsOpen(false);
      return;
    }
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      onStatusChange(order.id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={updating}
        className={`px-3 py-1 rounded-full text-sm font-medium border cursor-pointer transition hover:opacity-80 ${statusColors[order.status] || statusColors.Pending}`}
      >
        {updating ? '...' : order.status}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div 
            className="fixed bg-white border rounded-lg shadow-lg z-50 min-w-[140px]"
            style={{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }}
          >
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition ${
                  status === order.status ? 'font-bold bg-gray-50' : ''
                }`}
              >
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  status === 'Pending' ? 'bg-yellow-500' :
                  status === 'Purchased' ? 'bg-blue-500' :
                  status === 'Delivered' ? 'bg-green-500' :
                  'bg-red-500'
                }`}></span>
                {status}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export const Orders = () => {
  const [orders, setOrders] = useState(cachedOrders || []);
  const [loading, setLoading] = useState(!cachedOrders);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordAction, setPasswordAction] = useState(null);
  const [selectedEditOrder, setSelectedEditOrder] = useState(null);
  const [validPasswordForEdit, setValidPasswordForEdit] = useState(null);

  const fetchOrders = async (force = false) => {
    if (!force && cachedOrders && Date.now() - cachedOrdersTime < CACHE_TTL) {
      setLoading(false);
      return;
    }
    
    if (!cachedOrders) setLoading(true);
    
    try {
      const response = await getOrders();
      const newOrders = response.data.orders || [];
      cachedOrders = newOrders;
      cachedOrdersTime = Date.now();
      setOrders(newOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const triggerDelete = (id) => {
    setPasswordAction({ type: 'delete', payload: id });
    setShowPasswordModal(true);
  };

  const triggerEdit = (order) => {
    setPasswordAction({ type: 'verify_edit', payload: order });
    setShowPasswordModal(true);
  };

  const handleEditSubmit = async (formData) => {
    try {
      await updateOrder(selectedEditOrder.id, { ...formData, password: validPasswordForEdit });
      fetchOrders(true);
      setSelectedEditOrder(null);
      setValidPasswordForEdit(null);
    } catch (error) {
      console.error('Error updating order:', error);
      alert(error.response?.data?.error || 'Failed to update order');
    }
  };

  const handlePasswordSubmit = async (password, setError, onSuccess) => {
    try {
      if (passwordAction.type === 'delete') {
        await deleteOrder(passwordAction.payload, password);
        const newOrders = orders.filter(order => order.id !== passwordAction.payload);
        setOrders(newOrders);
        cachedOrders = newOrders;
      } else if (passwordAction.type === 'verify_edit') {
        await verifyAdminPassword(password);
        setValidPasswordForEdit(password);
        setSelectedEditOrder(passwordAction.payload);
      }
      onSuccess();
      setShowPasswordModal(false);
      setPasswordAction(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    const newOrders = orders.map(order => {
      if (order.id === orderId) {
        // If changing to Delivered, generate dummy invoice number in UI until refreshed
        let updatedOrder = { ...order, status: newStatus };
        if (newStatus === 'Delivered' && !order.invoiceNumber) {
          const currentYear = new Date().getFullYear();
          updatedOrder.invoiceNumber = `INV-${currentYear}-XXXX`; 
          // Note: In real app, we'd fetch the exact new order from backend,
          // but here we force a refetch after status update.
          setTimeout(() => fetchOrders(true), 500); 
        }
        return updatedOrder;
      }
      return order;
    });
    setOrders(newOrders);
    cachedOrders = newOrders;
  };

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    const query = searchQuery.toLowerCase();
    return orders.filter(order => {
      const productIdMatch = order.productId && order.productId.toLowerCase().includes(query);
      const customerNameMatch = order.customerName && order.customerName.toLowerCase().includes(query);
      const gameNameMatch = order.gameName && order.gameName.toLowerCase().includes(query);
      return productIdMatch || customerNameMatch || gameNameMatch;
    });
  }, [orders, searchQuery]);

  const tableRows = filteredOrders.map(order => [
    order.productId || '—',
    order.gameName,
    order.customerName || '—',
    order.currencyCode || 'INR',
    Number(order.steamPriceInr).toFixed(2),
    formatCurrency(order.baseCost || order.convertedBdt),
    formatCurrency(order.steamFeeAmount || 0),
    formatCurrency(order.steamCost || 0),
    formatCurrency(order.bkashSendAmount || 0),
    formatCurrency(order.finalCost),
    formatCurrency(order.customerPrice),
    formatCurrency(order.profit),
    <StatusBadge key={`status-${order.id}`} order={order} onStatusChange={handleStatusChange} />,
    <span key={`date-${order.id}`} className="text-xs text-gray-500 whitespace-nowrap">
      {new Date(order.createdAt).toLocaleString('en-BD', { dateStyle: 'short', timeStyle: 'short' })}
    </span>,
    <div key={`actions-${order.id}`} className="flex space-x-2">
      <Button variant="secondary" onClick={() => triggerEdit(order)}>
        Edit
      </Button>
      <Button variant="danger" onClick={() => triggerDelete(order.id)}>
        Delete
      </Button>
    </div>,
    order.status === 'Delivered' ? (
      <Button key={`inv-${order.id}`} variant="primary" onClick={() => setSelectedInvoiceOrder(order)}>
        Invoice
      </Button>
    ) : (
      <span key={`no-inv-${order.id}`} className="text-gray-400">—</span>
    )
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Order'}
        </Button>
      </div>

      {showForm && (
        <Card title="Create New Order">
          <OrderForm onSuccess={() => {
            setShowForm(false);
            fetchOrders(true); // Force refresh after new order
          }} />
        </Card>
      )}

      <Card title="All Orders">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Product ID, Customer Name, or Game Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-gray-500">No orders found</p>
        ) : (
          <Table
            headers={['Product ID', 'Game', 'Customer', 'Currency', 'Price', 'Base Cost', 'Steam Fee', 'Card Amount', 'bKash Send', 'Final Cost', 'Customer Price', 'Profit', 'Status', 'Date & Time', 'Action', 'Invoice']}
            rows={tableRows}
          />
        )}
      </Card>

      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {selectedEditOrder && (
        <OrderEditForm
          order={selectedEditOrder}
          onClose={() => setSelectedEditOrder(null)}
          onSubmit={handleEditSubmit}
        />
      )}

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordAction(null);
        }}
        onSubmit={handlePasswordSubmit}
        title={passwordAction?.type === 'delete' ? 'Confirm Deletion' : 'Confirm Access'}
        message={`Enter your admin password to ${passwordAction?.type === 'delete' ? 'delete this order' : 'edit this order'}.`}
      />
    </div>
  );
};

