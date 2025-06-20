const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserProfile,
  deleteUser
} = require('../controllers/userController');

const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', protect, isAdmin, getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/profile', protect, updateUserProfile);
router.delete('/:id', protect, isAdmin, deleteUser);

module.exports = router;
