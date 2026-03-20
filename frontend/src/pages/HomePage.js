import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('search') || '';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, selectedCategory, keyword]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:5000/api/products?page=${page}`;
      
      if (keyword) {
        url += `&keyword=${keyword}`;
      }
      
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      setProducts(data.products);
      setPages(data.pages);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <button onClick={fetchProducts}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to ShopEase</h1>
        <p>Discover amazing products at great prices</p>
      </div>

      <div className="products-section">
        <div className="filters">
          <h3>Categories</h3>
          <button 
            className={`category-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {products.length === 0 ? (
            <p className="no-products">No products found</p>
          ) : (
            products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>

        {pages > 1 && (
          <div className="pagination">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span>Page {page} of {pages}</span>
            <button 
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;