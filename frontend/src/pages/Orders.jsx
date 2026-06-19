import React, { useState, useEffect } from 'react';
import { getOrders, deleteOrder, updateOrderStatus } from '../api/services.js';
import { Card, Table, Button } from '../components/Common.jsx';
import { OrderForm } from '../components/OrderForm.jsx';
import { formatCurrency } from '../utils/helpers.js';

const StatusBadge = ({ order, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const statuses = ['Pending', 'Purchased', 'Delivered', 'Cancelled'];

  const statusColors = {
    Delivered: 'bg-green-100 text-green-800 border-green-300',
    Purchased: 'bg-blue-100 text-blue-800 border-blue-300',
    Cancelled: 'bg-red-100 text-red-800 border-red-300',
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300'
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
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={updating}
        className={`px-3 py-1 rounded-full text-sm font-medium border cursor-pointer transition hover:opacity-80 ${statusColors[order.status] || statusColors.Pending}`}
      >
        {updating ? '...' : order.status} ▾
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-20 min-w-[140px]">
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
    </div>
  );
};

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      await deleteOrder(id);
      setOrders(orders.filter(order => order.id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const tableRows = orders.map(order => [
    order.gameName,
    order.steamPriceInr,
    Number(order.exchangeRate).toFixed(2),
    formatCurrency(order.roundedBdt),
    formatCurrency(order.finalCost),
    formatCurrency(order.customerPrice),
    formatCurrency(order.profit),
    <StatusBadge key={`status-${order.id}`} order={order} onStatusChange={handleStatusChange} />,
    <Button key={`del-${order.id}`} variant="danger" onClick={() => handleDelete(order.id)}>
      Delete
    </Button>
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
            fetchOrders();
          }} />
        </Card>
      )}

      <Card title="All Orders">
        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders found</p>
        ) : (
          <Table
            headers={['Game', 'Price', 'Exchange', 'Rounded (BDT)', 'Final Cost', 'Customer Price', 'Profit', 'Status', 'Action']}
            rows={tableRows}
          />
        )}
      </Card>
    </div>
  );
};
