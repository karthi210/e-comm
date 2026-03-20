import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './OrdersPage.css';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/myorders', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order #{order._id.slice(-8)}</span>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className={`order-status ${order.status}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.product?.name || 'Product'}</span>
                    <span>x{item.quantity}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="order-footer">
                <span className="order-total">Total: ${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;