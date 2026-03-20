const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders
} = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.route('/')
  .post(authenticate, createOrder)
  .get(authenticate, isAdmin, getOrders);

router.route('/myorders')
  .get(authenticate, getMyOrders);

router.route('/:id')
  .get(authenticate, getOrderById);

router.route('/:id/pay')
  .put(authenticate, updateOrderToPaid);

router.route('/:id/deliver')
  .put(authenticate, isAdmin, updateOrderToDelivered);

module.exports = router;