// server.js - CORRECTED VERSION
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= IMPORT MODELS (CORRECTED) =================
// Instead of defining schemas in server.js, import from model files
// Make sure your model files exist in the backend/models/ folder
const User = require('./models/User');
const Product = require('./models/Product');

// ================= DB CONNECTION =================
// IMPORTANT: Use environment variable, not hardcoded
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

// ================= ROUTES =================
// Import your route files (make sure they exist)
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// ================= SEED ROUTE (for testing) =================
app.get('/api/seed', async (req, res) => {
  try {
    // Only use this in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Seed endpoint disabled in production' });
    }
    
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

// ================= HEALTH CHECK =================
app.get('/api/status', async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    
    res.json({
      status: 'running',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      productCount,
      userCount
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'error', 
      message: err.message 
    });
  }
});

// ================= ERROR HANDLING =================
// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: ${MONGODB_URI}`);
});
