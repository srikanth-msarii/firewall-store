import express from 'express';
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand
} from '../controllers/brandController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
// Removed multer

const router = express.Router();

// Public route
router.route('/')
  .get(getBrands)
  // Admin route (no multer)
  .post(protectAdmin, createBrand);

// Admin routes
router.route('/:id')
  .put(protectAdmin, updateBrand)
  .delete(protectAdmin, deleteBrand);

export default router;