import express from 'express';
import {
  submitInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry
} from '../controllers/inquiryController.js';
import { protectAdmin, checkPermission } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitInquiry)         // Public: Submit an inquiry
  .get(protectAdmin, checkPermission('manage_orders'), getInquiries); // Admin: Get all inquiries (now with pagination)

router.route('/:id')
  .put(protectAdmin, checkPermission('manage_orders'), updateInquiryStatus)
  .delete(protectAdmin, checkPermission('manage_orders'), deleteInquiry); // Add delete route

export default router;