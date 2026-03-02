import Promotion from '../models/Promotion.js';
import { uploadFileToS3, deleteFileFromS3 } from '../utils/s3.js';

// @desc    Get all promotions
// @route   GET /api/promotions
// @access  Public
const getPromotions = async (req, res) => {
  try {
    // Check if a 'featured=true' query param exists
    const filter = req.query.featured ? { isFeatured: true } : {};
    const promotions = await Promotion.find(filter).sort({ createdAt: -1 });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new promotion
// @route   POST /api/promotions
// @access  Admin
const createPromotion = async (req, res) => {
  try {
    const { title, model, description, dealText, link, isFeatured } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = await uploadFileToS3(file.buffer, file.originalname, file.mimetype);

    const promotion = new Promotion({
      title,
      model,
      description,
      dealText,
      link,
      image: imageUrl,
      isFeatured: isFeatured === 'true' // Convert string from FormData
    });

    const createdPromotion = await promotion.save();
    res.status(201).json(createdPromotion);
  } catch (error) {
    console.error("Create Promotion Error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a promotion
// @route   PUT /api/promotions/:id
// @access  Admin
const updatePromotion = async (req, res) => {
  try {
    const { title, model, description, dealText, link, isFeatured } = req.body;
    const file = req.file;

    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    promotion.title = title || promotion.title;
    promotion.model = model || promotion.model;
    promotion.description = description || promotion.description;
    promotion.dealText = dealText || promotion.dealText;
    promotion.link = link || promotion.link;
    promotion.isFeatured = isFeatured === 'true';

    if (file) {
      // Delete old image and upload new one
      if (promotion.image) {
        await deleteFileFromS3(promotion.image);
      }
      promotion.image = await uploadFileToS3(file.buffer, file.originalname, file.mimetype);
    }

    const updatedPromotion = await promotion.save();
    res.json(updatedPromotion);
  } catch (error) {
    console.error("Update Promotion Error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a promotion
// @route   DELETE /api/promotions/:id
// @access  Admin
const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (promotion) {
      // Delete the image from S3
      if (promotion.image) {
        await deleteFileFromS3(promotion.image);
      }
      await promotion.deleteOne();
      res.json({ message: 'Promotion removed' });
    } else {
      res.status(404).json({ message: 'Promotion not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { getPromotions, createPromotion, updatePromotion, deletePromotion };