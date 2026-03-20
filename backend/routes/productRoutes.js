const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview
} = require('../controllers/productController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.route('/')
  .get(getProducts)
  .post(authenticate, isAdmin, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(authenticate, isAdmin, updateProduct)
  .delete(authenticate, isAdmin, deleteProduct);

router.route('/:id/reviews')
  .post(authenticate, createProductReview);

module.exports = router;