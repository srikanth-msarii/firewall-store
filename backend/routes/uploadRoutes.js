import express from 'express';
import { getPresignedUploadUrl } from '../utils/s3.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @desc    Get a presigned URL for file upload
 * @route   POST /api/upload
 * @access  Admin
 * @body    { "fileType": "image/jpeg" }
 */
router.post('/', protectAdmin, async (req, res) => {
  const { fileType } = req.body;
  if (!fileType) {
    return res.status(400).json({ message: 'fileType is required' });
  }

  try {
    const { uploadUrl, publicFileUrl } = await getPresignedUploadUrl(fileType);
    res.json({ uploadUrl, publicFileUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;