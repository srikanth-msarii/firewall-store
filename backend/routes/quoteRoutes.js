import express from 'express';
// 1. Import the controller functions
import {
  submitQuote,
  getQuotes,
  updateQuoteStatus,
  deleteQuote
} from '../controllers/quoteController.js';
import { protectAdmin, checkPermission } from '../middleware/authMiddleware.js';

const router = express.Router();

// 2. Refactor to use controller
router.route('/')
  .post(submitQuote)         // Public: Submit a quote
  .get(protectAdmin, checkPermission('manage_orders'), getQuotes); // Admin: Get all quotes (with search/pagination)

// 3. Refactor to use controller
router.route('/:id')
  .put(protectAdmin, checkPermission('manage_orders'), updateQuoteStatus)
  .delete(protectAdmin, checkPermission('manage_orders'), deleteQuote); // 4. Add a DELETE route

export default router;