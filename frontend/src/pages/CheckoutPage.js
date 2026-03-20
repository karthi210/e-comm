import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const orderItems = cartItems.map(item => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price
      }));

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress,
          paymentMethod,
          totalPrice: cartTotal
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Order creation failed');
      }

      clearCart();
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      <div className="checkout-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Shipping</span>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Payment</span>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Confirm</span>
        </div>
      </div>

      <div className="checkout-container">
        <div className="checkout-form">
          {step === 1 && (
            <form onSubmit={handleAddressSubmit}>
              <h2>Shipping Address</h2>
              
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="continue-btn">
                Continue to Payment
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePaymentSubmit}>
              <h2>Payment Method</h2>
              
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Credit Card</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>PayPal</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="back-btn"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="place-order-btn"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          
          {cartItems.map(item => (
            <div key={item._id} className="summary-item">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          
          <div className="summary-total">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;