import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>ShopEase</h3>
          <p>Your one-stop e-commerce destination</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li><a href="/returns">Returns Policy</a></li>
            <li><a href="/shipping">Shipping Info</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@shopease.com</p>
          <p>Phone: +1 234 567 890</p>
          <div className="social-links">
            <a href="#">📘</a>
            <a href="#">📷</a>
            <a href="#">🐦</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 ShopEase. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;