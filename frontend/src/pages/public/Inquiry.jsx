import React, { useState, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { FloatingLabelInput } from '../../components/shared/FloatingLabelInput';
import { DropdownMenu } from '../../components/shared/DropdownMenu';
import { Link } from 'react-router-dom';
import { Check, Plus, Shield, Users, Globe, Settings } from 'lucide-react';
// 1. Import the inquiry service
import { inquiryService } from '../../services/api';

export const Inquiry = () => {
  // State for the form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    company: '',
    countryRegion: 'India', // Default country
    technicalRequirements: '',
    productType: '',
    budgetRange: '',
    expectedDeliveryTime: '',
    additionalInfo: '',
    contactByEmail: true,
    contactByPhone: false,
    // files: [], // This is no longer used
  });

  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 2. Add loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handlers for form state
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDropdownChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Update handleSubmit to call the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 4. Send the formData to the backend
      await inquiryService.submitInquiry(formData);

      // On success, show the success message
      setIsSubmitted(true);
    } catch (err) {
      console.error('Inquiry submission failed:', err);
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
      setLoading(false); // Stop loading on error
    }
    // Don't setLoading(false) on success, as the component will unmount
  };

  // Options for dropdowns
  const productTypeOptions = ['Network Switch', 'Router', 'Firewall', 'Server', 'Storage', 'Other'];
  const budgetRangeOptions = ['<$1,000', '$1,000 - $5,000', '$5,000 - $10,000', '$10,000 - $50,000', '>$50,000'];
  const deliveryTimeOptions = ['Within 1 month', '1-3 months', '3-6 months', '6-12 months', 'More than 1 year'];
  const countryRegionOptions = ['India', 'United States', 'Canada', 'Mexico', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'China', 'Brazil', 'Other'];

  // Success message screen
  if (isSubmitted) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-24 text-center">
        <Check className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Thank You for Your Inquiry!</h1>
        <p className="mt-2 text-lg text-gray-700">
          Our team of experts will review your request and get back to you shortly.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-white shadow-md hover:bg-blue-700">
          Return to Home
        </Link>
      </div>
    );
  }

  // Main component render
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white pb-20 pt-12">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">

          {/* --- Left Column --- */}
          <div className="md:col-span-5">
            {/* Project Inquiry Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Project Inquiry</h2>
              <p className="mt-2 text-gray-600">Start your journey with Our ICT Expert Team</p>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Shield size={24} className="h-8 w-8 flex-shrink-0 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Advanced Security</h3>
                    <p className="text-sm text-gray-500">Measures</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users size={24} className="h-8 w-8 flex-shrink-0 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Customized Project</h3>
                    <p className="text-sm text-gray-500">Support</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Settings size={24} className="h-8 w-8 flex-shrink-0 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Scalable & Flexible</h3>
                    <p className="text-sm text-gray-500">Solutions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe size={24} className="h-8 w-8 flex-shrink-0 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Global Support &</h3>
                    <p className="text-sm text-gray-500">Services</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trusted by Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900">Trusted by Industrial Leaders</h2>
              <div className="mt-6 grid grid-cols-4 gap-6">
                <img src="/assets/images/clients/Cyient_logo.svg" alt="AIS" className="h-6 w-auto bg-gray-500 p-1 rounded" />
                <img src="/assets/images/clients/GlobalLogic-Logo.png" alt="Vocus" className="h-6 w-auto" />
                <img src="/assets/images/clients/Highradius_Logo.png" alt="TATA" className="h-6 w-auto" />
                <img src="/assets/images/clients/Kl University_Logo.png" alt="Etisalat" className="h-6 w-auto" />
                <img src="/assets/images/clients/Natco_Pharma_Logo.svg" alt="MTC" className="h-6 w-auto" />
              </div>
            </div>
          </div>

          {/* --- Right Column (Form Card) --- */}
          <div className="md:col-span-7">
            <div className="rounded-lg bg-white p-8 shadow-lg">

              {/* Ask the Expert Header */}
              <div className="flex items-center space-x-4">
                <img
                  className="h-16 w-auto"
                  src="/assets/images/expert.webp" // Ensure this path is correct
                  alt="Expert"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Ask the Expert</h2>
                  <p className="mt-1 text-gray-600">Provide Your Details for Instant Expert Consultation.</p>
                </div>
              </div>

              {/* Main Inquiry Form */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <FloatingLabelInput
                    id="firstName"
                    name="firstName"
                    label="First Name *"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <FloatingLabelInput
                    id="lastName"
                    name="lastName"
                    label="Last Name *"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  <FloatingLabelInput
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number *"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <FloatingLabelInput
                    id="email"
                    name="email"
                    label="Email *"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <FloatingLabelInput
                    id="company"
                    name="company"
                    label="Company Name *"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                  <DropdownMenu
                    label="Country/Region *"
                    options={countryRegionOptions}
                    selected={formData.countryRegion}
                    onChange={(value) => handleDropdownChange('countryRegion', value)}
                  />
                </div>

                <FloatingLabelInput
                  id="technicalRequirements"
                  name="technicalRequirements"
                  label="Technical Requirements *"
                  as="textarea"
                  rows="4"
                  value={formData.technicalRequirements}
                  onChange={handleInputChange}
                  required
                  placeholder="Please specify the technologies required for the project?"
                  className="resize-y"
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <DropdownMenu
                    label="Product Type(s) *"
                    options={productTypeOptions}
                    selected={formData.productType}
                    onChange={(value) => handleDropdownChange('productType', value)}
                  />
                  <DropdownMenu
                    label="Budget Range *"
                    options={budgetRangeOptions}
                    selected={formData.budgetRange}
                    onChange={(value) => handleDropdownChange('budgetRange', value)}
                  />
                  <FloatingLabelInput
                    id="expectedDeliveryTime"
                    name="expectedDeliveryTime"
                    label="Expected Delivery Time *"
                    type="date"
                    value={formData.expectedDeliveryTime}
                    onChange={handleInputChange}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                {/* Additional Information Toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    + Additional Information (For More Precise Support)
                  </button>
                  <Transition
                    show={showAdditionalInfo}
                    as={Fragment}
                    enter="transition-all ease-out duration-300"
                    enterFrom="opacity-0 max-h-0"
                    enterTo="opacity-100 max-h-screen"
                    leave="transition-all ease-in duration-200"
                    leaveFrom="opacity-100 max-h-screen"
                    leaveTo="opacity-0 max-h-0"
                  >
                    <div className="mt-4 overflow-hidden">
                      <FloatingLabelInput
                        id="additionalInfo"
                        name="additionalInfo"
                        label="Tell us more about your needs (Optional)"
                        as="textarea"
                        rows="4"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        className="resize-y"
                      />
                    </div>
                  </Transition>
                </div>


                {/* Contact Preference (Checkboxes) */}
                <div>
                  <p className="text-gray-700">How would you like us to contact you?</p>
                  <div className="mt-2 flex space-x-6">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="contactByEmail"
                        checked={formData.contactByEmail}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">E-mail</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="contactByPhone"
                        checked={formData.contactByPhone}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Telephone</span>
                    </label>
                  </div>
                </div>

                {/* 5. Add error message display */}
                {error && (
                  <div className="text-center text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading} // 6. Disable button while loading
                  className="mt-8 w-full rounded-md bg-blue-600 px-6 py-3 text-lg font-bold text-white shadow-md transition-transform hover:scale-[1.01] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Inquiry Now'}
                </button>

                <p className="mt-4 text-center text-sm text-gray-500">
                  Firewall Storewill not provide your information to the third parties. For more information on how
                  Firewall Storemanages, uses, and protects your information please refer to{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    Terms & Conditions
                  </Link>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};