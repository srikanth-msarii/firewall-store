import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FloatingLabelInput } from '../../components/shared/FloatingLabelInput';
import { MapPin, Phone, Mail, Clock, Check } from 'lucide-react';
// 1. Import the inquiry service
import { inquiryService } from '../../services/api';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  // 2. Add loading, error, and submitted states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Update handleSubmit to be async and call the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- Map Contact Form to Inquiry API ---
    // Split "Full Name" into first and last
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '(None)'; // Provide a default

    const inquiryData = {
      // --- Mapped Fields ---
      firstName: firstName,
      lastName: lastName,
      phoneNumber: formData.phone, // Now required
      email: formData.email,
      technicalRequirements: `Contact Form Subject: ${formData.subject}`, // Map to this required field
      additionalInfo: formData.message,

      // --- Dummy Data for Required Fields ---
      company: "N/A (Contact Form)",
      countryRegion: "N/A",
      productType: "General Contact",
      budgetRange: "N/A",
      expectedDeliveryTime: new Date().toISOString(), // Use today's date
      contactByEmail: true,
      contactByPhone: true,
    };
    
    try {
      // 4. Send to the inquiry service
      await inquiryService.submitInquiry(inquiryData);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Contact form submission failed", err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show a success message after submission
  if (isSubmitted) {
    return (
      <div className="bg-white">
        <div className="container mx-auto max-w-7xl px-4 py-24 text-center">
          <Check className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Message Sent!</h1>
          <p className="mt-2 text-lg text-gray-700">
            Thank you for contacting us. We'll get back to you as soon as possible.
          </p>
          <Link to="/" className="mt-6 inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-white shadow-md hover:bg-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* --- SEO Tags (React 19) --- */}
      <title>Contact Us | Trace Networks</title>
      <meta name="description" content="Get in touch with the Trace Networks team. We're here to help with sales, support, and any inquiries." />
      <link rel="canonical" href="https://www.tracenetworks.com/contact" />
      <meta property="og:title" content="Contact Us | Trace Networks" />
      <meta property="og:description" content="Get in touch with the Trace Networks team. We're here to help with sales, support, and any inquiries." />

      <div className="bg-gradient-to-b from-blue-50 to-white pb-20">
        {/* Hero Section */}
        <div 
          className="relative h-64 bg-cover bg-center" 
          style={{ backgroundImage: "url('/assets/images/solutions-cta-bg.webp')" }}
        >
          <div className="absolute inset-0 bg-blue-900/70" />
          <div className="container relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center text-white">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Contact Us</h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-200">
              We're here to help. Reach out to us with any questions or inquiries.
            </p>
          </div>
        </div>

        {/* Main Content Area (Cards float on top) */}
        <div className="container mx-auto max-w-7xl -translate-y-16 px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            
            {/* Left Column: Contact Form (White Card) */}
            <div className="rounded-xl bg-white p-8 shadow-2xl md:col-span-7">
              <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <FloatingLabelInput
                  id="name"
                  name="name"
                  label="Full Name *"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FloatingLabelInput
                    id="email"
                    name="email"
                    label="Email Address *"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  {/* 5. Phone number is now required */}
                  <FloatingLabelInput
                    id="phone"
                    name="phone"
                    label="Phone Number *"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <FloatingLabelInput
                  id="subject"
                  name="subject"
                  label="Subject *"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
                <FloatingLabelInput
                  id="message"
                  name="message"
                  label="Your Message *"
                  as="textarea"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="resize-y"
                />

                {/* 6. Show error message */}
                {error && (
                  <div className="text-center text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading} // 7. Disable on loading
                  className="w-full rounded-md bg-blue-600 px-6 py-3.5 text-lg font-semibold text-white shadow-md
                             transition-transform hover:scale-[1.02] hover:bg-blue-700
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Right Column: Contact Details (Dark Card) */}
            <div className="rounded-xl bg-blue-900 p-8 shadow-2xl md:col-span-5">
              <h2 className="text-2xl font-bold text-white">Contact Information</h2>
              <p className="mt-2 text-blue-200">Find us at our office or give us a call.</p>
              <div className="mt-8 space-y-6">
                
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Our Address</h3>
                    <p className="text-blue-200">
                      Madhapur, Hyderabad, Telangana, India
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Call Us</h3>
                    <a href="tel:+917032224513" className="text-blue-200 hover:text-white">
                      +91-7032224513
                    </a>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email Us</h3>
                    <a href="mailto:sales@firewall-store.com" className="block text-blue-200 hover:text-white">
                      sales@firewall-store.com
                    </a>
                    <a href="mailto:support@firewall-store.com" className="block text-blue-200 hover:text-white">
                      support@firewall-store.com
                    </a>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Business Hours</h3>
                    <p className="text-blue-200">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-blue-200">Saturday - Sunday: Closed</p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="container mx-auto mt-16 max-w-7xl px-4">
          <div className="overflow-hidden rounded-xl shadow-2xl">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25731.738173405167!2d78.39164569999998!3d17.44843705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9158f201b205%3A0x11bbe7be7792411b!2sMadhapur%2C%20Hyderabad%2C%20Telangana!5e1!3m2!1sen!2sin!4v1762523521671!5m2!1sen!2sin" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>
    </>
  );
};