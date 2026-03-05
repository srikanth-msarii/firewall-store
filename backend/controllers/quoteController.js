import QuoteRequest from '../models/QuoteRequest.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Submit a new quote request
// @route   POST /api/quotes
// @access  Public
const submitQuote = async (req, res) => {
  try {
    const newQuote = new QuoteRequest(req.body);
    const savedQuote = await newQuote.save();

    // Send email notification to sales/admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL || 'sales@firewall-store.com';
      await sendEmail({
        email: adminEmail,
        subject: `New Quote Request: ${savedQuote.productName || 'General'} from ${savedQuote.name}`,
        message: `You have received a new quote request from the website.\n
Details:
- Name: ${savedQuote.name}
- Email: ${savedQuote.email}
- Phone: ${savedQuote.phone}
- Company: ${savedQuote.company || 'N/A'}
- Product: ${savedQuote.productName || 'N/A'}
- Quantity: ${savedQuote.quantity || 1}
- Message: ${savedQuote.message || 'None'}\n
Please login to the admin dashboard to view the full request.`,
      });
    } catch (emailError) {
      console.error('Failed to send quote notification email:', emailError);
      // Do not fail the request if email fails, log instead.
    }

    res.status(201).json(savedQuote);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all quote requests (with pagination/search)
// @route   GET /api/quotes
// @access  Admin
const getQuotes = async (req, res) => {
  try {
    const pageSize = 10; // Number of items per page
    const page = Number(req.query.page) || 1;
    const search = req.query.search || '';

    // Create a search query
    const query = search
      ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { productName: { $regex: search, $options: 'i' } },
        ]
      }
      : {};

    const count = await QuoteRequest.countDocuments(query);
    const quotes = await QuoteRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      quotes,
      page,
      totalPages: Math.ceil(count / pageSize)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a quote status
// @route   PUT /api/quotes/:id
// @access  Admin
const updateQuoteStatus = async (req, res) => {
  try {
    const quote = await QuoteRequest.findById(req.params.id);
    if (quote) {
      quote.status = req.body.status || quote.status;
      const updatedQuote = await quote.save();
      res.json(updatedQuote);
    } else {
      res.status(404).json({ message: 'Quote not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a quote
// @route   DELETE /api/quotes/:id
// @access  Admin
const deleteQuote = async (req, res) => {
  try {
    const quote = await QuoteRequest.findById(req.params.id);
    if (quote) {
      await quote.deleteOne();
      res.json({ message: 'Quote removed' });
    } else {
      res.status(404).json({ message: 'Quote not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


export { submitQuote, getQuotes, updateQuoteStatus, deleteQuote };