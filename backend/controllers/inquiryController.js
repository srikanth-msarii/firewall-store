import Inquiry from '../models/Inquiry.js';

// @desc    Submit a new inquiry
// @route   POST /api/inquiries
// @access  Public
const submitInquiry = async (req, res) => {
  try {
    // TODO: Handle S3 file uploads for inquiry
    const newInquiry = new Inquiry(req.body);
    const savedInquiry = await newInquiry.save();
    res.status(201).json(savedInquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all inquiries (with pagination/search)
// @route   GET /api/inquiries
// @access  Admin
const getInquiries = async (req, res) => {
  try {
    const pageSize = 10; // Number of items per page
    const page = Number(req.query.page) || 1;
    const search = req.query.search || '';

    // Create a search query
    const query = search 
      ? {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phoneNumber: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
          ]
        }
      : {};

    const count = await Inquiry.countDocuments(query);
    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // --- THIS IS THE FIX ---
    // We send an object, not just the array
    res.json({
      inquiries,
      page,
      totalPages: Math.ceil(count / pageSize)
    });
    // --- END OF FIX ---

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update an inquiry status
// @route   PUT /api/inquiries/:id
// @access  Admin
const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (inquiry) {
      inquiry.status = req.body.status || inquiry.status;
      const updatedInquiry = await inquiry.save();
      res.json(updatedInquiry);
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete an inquiry
// @route   DELETE /api/inquiries/:id
// @access  Admin
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (inquiry) {
      // TODO: Delete any associated files from S3
      await inquiry.deleteOne();
      res.json({ message: 'Inquiry removed' });
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { submitInquiry, getInquiries, updateInquiryStatus, deleteInquiry };