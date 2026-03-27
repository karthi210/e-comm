require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Import models (make sure these files exist)
const User = require('./models/User');
const Product = require('./models/Product');

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/status', async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    
    res.json({
      status: 'running',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      productCount,
      userCount
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Seed endpoint (development only)
app.get('/api/seed', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Seed endpoint disabled in production' });
  }
  
  try {
    await Product.deleteMany();
    const products = [
      { name: 'Headphones', price: 199, description: 'High quality headphones', category: 'electronics', imageUrl: 'https://via.placeholder.com/300', stock: 10, rating: 4.5, numReviews: 10 },
      { name: 'Smart Watch', price: 299, description: 'Feature-rich smartwatch', category: 'electronics', imageUrl: 'https://via.placeholder.com/300', stock: 15, rating: 4.2, numReviews: 8 }
    ];
    const inserted = await Product.insertMany(products);
    res.json({ message: 'Database seeded', count: inserted.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});
