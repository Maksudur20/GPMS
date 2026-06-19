import React, { useState, useEffect } from 'react';
import { getOrders, deleteOrder } from '../api/services.js';
import { Card, Table, Button } from '../components/Common.jsx';
import { OrderForm } from '../components/OrderForm.jsx';
import { formatCurrency, formatDate } from '../utils/helpers.js';

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

  const tableRows = orders.map(order => [
    order.gameName,
    order.steamPriceInr,
    order.exchangeRate.toFixed(2),
    formatCurrency(order.roundedBdt),
    formatCurrency(order.finalCost),
    formatCurrency(order.customerPrice),
    formatCurrency(order.profit),
    <span key={order.id} className={`px-2 py-1 rounded text-sm ${
      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
      order.status === 'Purchased' ? 'bg-blue-100 text-blue-800' :
      order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
      'bg-yellow-100 text-yellow-800'
    }`}>
      {order.status}
    </span>,
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
            headers={['Game', 'Price (INR)', 'Exchange', 'Rounded (BDT)', 'Final Cost', 'Customer Price', 'Profit', 'Status', 'Action']}
            rows={tableRows}
          />
        )}
      </Card>
    </div>
  );
};
