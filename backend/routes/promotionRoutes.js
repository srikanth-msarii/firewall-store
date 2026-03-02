import express from 'express';
import {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion
} from '../controllers/promotionController.js';
import { protectAdmin, checkPermission } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Set up multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Public route
router.route('/')
  .get(getPromotions);

// Admin routes
router.route('/')
  .post(protectAdmin, checkPermission('manage_promotions'), upload.single('image'), createPromotion);

router.route('/:id')
  .put(protectAdmin, checkPermission('manage_promotions'), upload.single('image'), updatePromotion)
  .delete(protectAdmin, checkPermission('manage_promotions'), deletePromotion);

export default router;