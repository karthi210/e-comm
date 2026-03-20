import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-image">
          <img src={product.imageUrl} alt={product.name} />
          {product.stock === 0 && (
            <div className="out-of-stock">Out of Stock</div>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>
          
          <div className="product-rating">
            {[...Array(5)].map((_, index) => (
              <span key={index} className={index < Math.floor(product.rating) ? 'star filled' : 'star'}>
                ★
              </span>
            ))}
            <span className="rating-count">({product.numReviews})</span>
          </div>
          
          <div className="product-price">${product.price.toFixed(2)}</div>
        </div>
      </Link>
      
      <button 
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;