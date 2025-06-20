const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.createOrUpdateCategory = async (req, res) => {
  try {
    const { id, name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    let category;

    if (id) {
      // Update existing category
      category = await Category.findById(id);
      if (!category) return res.status(404).json({ message: 'Category not found' });

      category.name = name;
      await category.save();

      res.status(200).json({ message: 'Category updated successfully', category });
    } else {
      // Create new category
      const exists = await Category.findOne({ name });
      if (exists) return res.status(400).json({ message: 'Category already exists' });

      category = new Category({ name });
      await category.save();

      res.status(201).json({ message: 'Category created successfully', category });
    }
  } catch (error) {
    console.error('Category upsert error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};