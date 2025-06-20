const express = require('express');
const router = express.Router();
const {createOrUpdateCategory,getAllCategories,deleteCategory} = require('../controllers/categoryController');

const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', getAllCategories);
router.post('/', protect, isAdmin, createOrUpdateCategory); 
router.delete('/:id', protect, isAdmin, deleteCategory);


module.exports = router;
