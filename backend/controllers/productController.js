import Product from '../models/Product.js';
import { uploadFileToS3, deleteFileFromS3 } from '../utils/s3.js';

// @desc    Fetch all products (public, with filters)
export const getAllProducts = async (req, res) => {
  try {
    const { category, brand, q: searchTerm } = req.query;
    let query = {};
    if (category) query.category = { $regex: category, $options: 'i' };
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (searchTerm) {
      const searchRegex = { $regex: searchTerm, $options: 'i' };
      query.$or = [
        { name: searchRegex }, { model: searchRegex },
        { brand: searchRegex }, { category: searchRegex },
      ];
    }
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- Helper to safely parse JSON from FormData ---
const parseJSON = (string) => {
  try {
    return JSON.parse(string);
  } catch (e) {
    return []; // Default to empty array on fail
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Admin
export const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Parse all JSON string fields
    productData.specs = parseJSON(productData.specs);
    productData.reviews = parseJSON(productData.reviews);
    productData.questions = parseJSON(productData.questions);
    productData.featured = productData.featured === 'true';

    // Handle file uploads
    if (req.files) {
      if (req.files.images) {
        productData.images = [];
        for (const file of req.files.images) {
          const url = await uploadFileToS3(file.buffer, file.originalname, file.mimetype);
          productData.images.push(url);
        }
        if (productData.images.length > 0) {
          productData.image = productData.images[0];
        }
      }
      if (req.files.specImage) {
        const file = req.files.specImage[0];
        productData.specImage = await uploadFileToS3(file.buffer, file.originalname, file.mimetype);
      }
      if (req.files.datasheet) {
        const file = req.files.datasheet[0];
        productData.datasheetUrl = await uploadFileToS3(file.buffer, file.originalname, file.mimetype);
      }
    }

    const product = new Product(productData);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productData = { ...req.body };
    
    // Parse all JSON string fields
    productData.specs = parseJSON(productData.specs);
    productData.reviews = parseJSON(productData.reviews);
    productData.questions = parseJSON(productData.questions);
    productData.featured = productData.featured === 'true';

    // --- THIS IS THE FIX ---
    // The frontend no longer sends old image URLs.
    // We only update images if new files are provided in req.files.
    if (req.files) {
      if (req.files.images && req.files.images.length > 0) {
        // Delete old gallery images
        if (product.images && product.images.length > 0) {
          for (const url of product.images) {
            // Check if it's the main image before deleting
            if (url !== product.image) await deleteFileFromS3(url);
          }
        }
        if (product.image) await deleteFileFromS3(product.image); // Delete old main
        
        // Upload new images
        productData.images = [];
        for (const file of req.files.images) {
          const url = await uploadFileToS3(file.buffer, file.originalname, file.mimetype);
          productData.images.push(url);
        }
        if (productData.images.length > 0) {
          productData.image = productData.images[0]; // Set new main image
        } else {
          productData.image = ''; // Clear main image if no new images
        }
      }

      if (req.files.specImage) {
        if (product.specImage) await deleteFileFromS3(product.specImage);
        const file = req.files.specImage[0];
        productData.specImage = await uploadFileToS3(file.buffer, file.originalname, file.mimetype);
      }

      if (req.files.datasheet) {
        if (product.datasheetUrl) await deleteFileFromS3(product.datasheetUrl);
        const file = req.files.datasheet[0];
        productData.datasheetUrl = await uploadFileToS3(file.buffer, file.originalname, file.mimetype);
      }
    }

    // Update all fields from productData
    // Fields that were not in productData (like 'image' if no new file)
    // will not be changed.
    Object.assign(product, productData);
      
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // Delete all associated images from S3
      if (product.image) await deleteFileFromS3(product.image);
      if (product.specImage) await deleteFileFromS3(product.specImage);
      if (product.datasheetUrl) await deleteFileFromS3(product.datasheetUrl);
      if (product.images && product.images.length > 0) {
        for (const url of product.images) {
          if (url !== product.image) {
            await deleteFileFromS3(url);
          }
        }
      }
      
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};