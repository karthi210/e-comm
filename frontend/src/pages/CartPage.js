import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

function CartPage() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      <div className="cart-container">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.imageUrl} alt={item.name} />
              </div>
              
              <div className="cart-item-details">
                <Link to={`/product/${item._id}`} className="cart-item-name">
                  {item.name}
                </Link>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
                
                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="cart-item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          
          <div className="summary-row total">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          
          <button 
            className="checkout-btn"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
          
          <Link to="/" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;