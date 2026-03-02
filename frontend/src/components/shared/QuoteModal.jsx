import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, CheckCircle } from 'lucide-react';
import { FloatingLabelInput } from './FloatingLabelInput';
// 1. Import the new quote service
import { quoteService } from '../../services/api';

export const QuoteModal = ({ isOpen, onClose, product, onSubmitSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [generalProductName, setGeneralProductName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // 2. Add loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form fields when modal opens/product changes
  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setQuantity(product?.defaultQuantity || 1); 
      setMessage('');
      setGeneralProductName('');
      setIsSubmitted(false);
      setLoading(false); // Reset loading state
      setError(''); // Reset error state
    }
  }, [isOpen, product]); // Dependency array is correct


  // 3. Make handleSubmit async and call the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const productName = product?.name || generalProductName;
    
    // 4. Build the data object for the API
    const quoteData = {
      productId: product?._id, // <-- FIX: Use _id from MongoDB
      productName: productName || "General Quote",
      quantity,
      name,
      email,
      phone,
      company,
      message,
    };
    
    try {
      // 5. Call the API
      await quoteService.submitQuote(quoteData);
      
      setIsSubmitted(true);
      setTimeout(() => {
        onSubmitSuccess(); // This closes the modal & shows toast
      }, 2000);

    } catch (err) {
      console.error("Quote submission failed", err);
      setError(err.response?.data?.message || 'Failed to submit quote. Please try again.');
      setLoading(false); // Stop loading on error
    }
  };

  const handleClose = () => {
    // 6. Prevent closing while loading
    if (isSubmitted || loading) return;
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={handleClose}>
        {/* ... (Backdrop) ... */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-lg transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                
                <button
                  onClick={handleClose}
                  className="absolute -top-4 -right-4 z-[101] flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-lg transition-transform hover:scale-110 hover:text-red-500"
                >
                  <X size={24} />
                </button>

                {isSubmitted ? (
                  // ... (Success message) ...
                  <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                    <CheckCircle size={64} className="text-green-500" />
                    <h3 className="mt-4 text-2xl font-semibold text-gray-800">Request Sent!</h3>
                    <p className="mt-2 text-gray-600">Our team will get back to you shortly.</p>
                  </div>
                ) : (
                  <>
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-bold leading-6 text-gray-900"
                    >
                      Get a Quote
                    </Dialog.Title>
                    
                    {product ? (
                      <p className="mt-2 text-base text-gray-600">
                        For Product: <span className="font-semibold text-blue-600">{product.name} ({product.model})</span>
                      </p>
                    ) : (
                       <p className="mt-2 text-base text-gray-600">
                        Ask an expert or get a general quote.
                      </p>
                    )}
                    
                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FloatingLabelInput
                          id="name"
                          label="Your Name *"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                        <FloatingLabelInput
                          id="email"
                          label="Your Email *"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FloatingLabelInput
                          id="phone"
                          name="phone"
                          label="Phone Number *"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                         <FloatingLabelInput
                          id="company"
                          label="Company (Optional)"
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                        />
                      </div>
                      
                      {product ? (
                        <FloatingLabelInput
                          id="quantity"
                          label="Quantity *"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          min="1"
                          required
                        />
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <FloatingLabelInput
                            id="general-product-name"
                            label="Product Name / Model"
                            type="text"
                            value={generalProductName}
                            onChange={(e) => setGeneralProductName(e.target.value)}
                          />
                          <FloatingLabelInput
                            id="quantity"
                            label="Quantity *"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="1"
                            required
                          />
                        </div>
                      )}

                      <div>
                        <FloatingLabelInput
                          id="message"
                          label={product ? "Message (Optional)" : "Your Question *"}
                          as="textarea"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required={!product} // Message is required if it's a general question
                        />
                      </div>
                      
                      {/* 7. Show error message if it exists */}
                      {error && (
                        <div className="text-center text-sm font-medium text-red-600">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        // 8. Disable button when loading
                        disabled={loading}
                        className="w-full rounded-md bg-blue-600 px-6 py-3.5 text-lg font-semibold text-white shadow-md transition-transform hover:scale-[1.02] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {/* 9. Change button text based on loading state */}
                        {loading ? 'Submitting...' : 'Submit Quote Request'}
                      </button>
                    </form>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};