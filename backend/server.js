require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  imageUrl: String,
  stock: Number,
  rating: Number,
  numReviews: Number
});

const Product = mongoose.model('Product', productSchema);

// Sample Products Data
const sampleProducts = [
  {
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 199.99,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 50,
    rating: 4.5,
    numReviews: 128
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health tracking, GPS, and heart rate monitor.',
    price: 299.99,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 35,
    rating: 4.8,
    numReviews: 95
  },
  {
    name: 'Cotton Casual T-Shirt',
    description: 'Comfortable 100% organic cotton t-shirt, breathable and soft.',
    price: 24.99,
    category: 'clothing',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    stock: 150,
    rating: 4.3,
    numReviews: 67
  },
  {
    name: 'JavaScript: The Definitive Guide',
    description: 'Master JavaScript with this comprehensive guide.',
    price: 39.99,
    category: 'books',
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    stock: 100,
    rating: 4.9,
    numReviews: 245
  }
];

// ============ USER ROUTES ============

// Register
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user
    const user = new User({ name, email, password });
    await user.save();
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret_key', { expiresIn: '7d' });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret_key', { expiresIn: '7d' });
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile (protected)
app.get('/api/users/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, 'your_jwt_secret_key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Update user profile
app.put('/api/users/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, 'your_jwt_secret_key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    await user.save();
    
    const newToken = jwt.sign({ userId: user._id }, 'your_jwt_secret_key', { expiresIn: '7d' });
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: newToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ PRODUCT ROUTES ============

app.get('/api/products', async (req, res) => {
  try {
    const { page = 1, limit = 12, keyword = '', category = '' } = req.query;
    
    let query = {};
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    
    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/products/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Seed database
app.get('/api/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(sampleProducts);
    res.json({ 
      success: true,
      message: '✅ Database seeded successfully!', 
      count: inserted.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check status
app.get('/api/status', async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    res.json({
      database: 'MongoDB',
      status: 'connected',
      productCount,
      userCount,
      message: 'Server is running'
    });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`📦 API: http://localhost:${PORT}/api/products`);
  console.log(`👤 Register: POST http://localhost:${PORT}/api/users/register`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/api/users/login`);
  console.log(`🌱 Seed: http://localhost:${PORT}/api/seed\n`);
});
