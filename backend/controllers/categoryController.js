import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Admin
const createCategory = async (req, res) => {
  try {
    const category = new Category({ name: req.body.name, description: req.body.description });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = req.body.name || category.name;
      category.description = req.body.description || category.description;
      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      // TODO: Add logic here to check if any product is using this category
      await category.deleteOne();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- THIS IS THE FIX ---
// This block makes the functions available for import in other files.
export { getCategories, createCategory, updateCategory, deleteCategory };