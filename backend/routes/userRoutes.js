const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser
} = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.route('/profile')
  .get(authenticate, getUserProfile)
  .put(authenticate, updateUserProfile);

router.route('/')
  .get(authenticate, isAdmin, getUsers);

router.route('/:id')
  .delete(authenticate, isAdmin, deleteUser)
  .get(authenticate, isAdmin, getUserById)
  .put(authenticate, isAdmin, updateUser);

module.exports = router;