import QuoteRequest from '../models/QuoteRequest.js';

// @desc    Submit a new quote request
// @route   POST /api/quotes
// @access  Public
const submitQuote = async (req, res) => {
  try {
    const newQuote = new QuoteRequest(req.body);
    const savedQuote = await newQuote.save();
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