import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { bulkUploadProducts } from '../controllers/bulkUploadController.js';
import { protectAdmin, checkPermission } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Set up multer for in-memory file storage
const storage = multer.memoryStorage();
// 1. Updated upload fields
const upload = multer({
  storage: storage,
  // Optional: Add file size limits
  // limits: { fileSize: 1024 * 1024 * 5 } // 5MB
});

// Public Routes
router.route('/')
  .get(getAllProducts);

router.route('/:id')
  .get(getProductById);

// Admin-only Routes
router.post('/bulk-upload', protectAdmin, checkPermission('manage_products'), upload.single('file'), bulkUploadProducts);

router.route('/')
  .post(
    protectAdmin,
    checkPermission('manage_products'),
    // 2. Added 'datasheet' and 'images' to fields
    upload.fields([
      { name: 'image', maxCount: 1 },       // Main image
      { name: 'specImage', maxCount: 1 },  // Specs image
      { name: 'datasheet', maxCount: 1 },  // PDF Datasheet
      { name: 'images', maxCount: 3 }       // Gallery images
    ]),
    createProduct
  );

router.route('/:id')
  .put(
    protectAdmin,
    checkPermission('manage_products'),
    // 2. Added 'datasheet' and 'images' to fields
    upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'specImage', maxCount: 1 },
      { name: 'datasheet', maxCount: 1 },
      { name: 'images', maxCount: 3 }
    ]),
    updateProduct
  )
  .delete(protectAdmin, checkPermission('manage_products'), deleteProduct);

export default router;