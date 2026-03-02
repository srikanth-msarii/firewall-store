import Brand from '../models/Brand.js';

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new brand
// @route   POST /api/brands
// @access  Admin
const createBrand = async (req, res) => {
  try {
    // Removed all S3 logic
    const brand = new Brand({ name: req.body.name });
    const createdBrand = await brand.save();
    res.status(201).json(createdBrand);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Brand name already exists' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a brand
// @route   PUT /api/brands/:id
// @access  Admin
const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    brand.name = req.body.name || brand.name;
    // Removed all S3 logic

    const updatedBrand = await brand.save();
    res.json(updatedBrand);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Brand name already exists' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Admin
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (brand) {
      // Removed all S3 logic
      await brand.deleteOne();
      res.json({ message: 'Brand removed' });
    } else {
      res.status(404).json({ message: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { getBrands, createBrand, updateBrand, deleteBrand };