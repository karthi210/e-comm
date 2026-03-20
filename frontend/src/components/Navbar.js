import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛍️</span>
          ShopEase
        </Link>

        <div className="navbar-search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>
        </div>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          
          {user ? (
            <>
              <Link to="/orders" className="nav-link">Orders</Link>
              {user.isAdmin && (
                <Link to="/admin" className="nav-link">Admin</Link>
              )}
              <div className="nav-dropdown">
                <button className="nav-link user-menu">
                  👤 {user.name}
                </button>
                <div className="dropdown-content">
                  <Link to="/profile">Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-btn">Register</Link>
            </>
          )}

          <Link to="/cart" className="nav-link cart-link">
            🛒 Cart
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </Link>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
          {user ? (
            <>
              <Link to="/orders" onClick={() => setIsMenuOpen(false)}>Orders</Link>
              {user.isAdmin && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>
              )}
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
            </>
          )}
          <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
            Cart ({cartItemsCount})
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;