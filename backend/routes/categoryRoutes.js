import express from 'express';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.route('/')
  .get(getCategories)
  // Admin routes
  .post(protectAdmin, createCategory);
  
router.route('/:id')
  .put(protectAdmin, updateCategory)
  .delete(protectAdmin, deleteCategory);

export default router;