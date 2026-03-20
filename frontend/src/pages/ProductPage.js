import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductPage.css';

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert('Product added to cart!');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-gallery">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        
        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="product-category">{product.category}</p>
          
          <div className="product-rating">
            {[...Array(5)].map((_, index) => (
              <span key={index} className={index < Math.floor(product.rating) ? 'star filled' : 'star'}>
                ★
              </span>
            ))}
            <span className="rating-count">({product.numReviews} reviews)</span>
          </div>
          
          <div className="product-price">
            ${product.price.toFixed(2)}
          </div>
          
          <div className="product-stock">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          {product.stock > 0 && (
            <div className="product-actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </div>
              
              <div className="action-buttons">
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <button className="buy-now-btn" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;