import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, Phone, Gavel, ShieldCheck, Box, CreditCard, UserCheck, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Accordion Item Component ---
const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <ChevronDown 
          size={20} 
          className={`transform text-blue-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="prose prose-lg prose-blue max-w-none pb-5 text-gray-600">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Summary Card Component (THE FIX) ---
// Changed `{ text }` to `{ children }` to render the text correctly.
const SummaryCard = ({ icon: Icon, title, children }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Icon className="h-6 w-6" />
      </span>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {/* This now renders the text passed between the tags */}
      <p className="mt-1 text-gray-600">{children}</p>
    </div>
  </div>
);


export const TermsPage = () => {
  return (
    <>
      {/* --- SEO Tags (React 19) --- */}
      <title>Terms & Conditions | Trace Networks</title>
      <meta name="description" content="Review the terms and conditions for using Firewall-Store.com (Trace Networks) and purchasing products." />
      <link rel="canonical" href="https://www.tracenetworks.com/terms" />
      <meta property="og:title" content="Terms & Conditions | Trace Networks" />

      {/* --- Page Content --- */}
      <div className="bg-gray-50 pb-20">
        
        {/* Hero Section */}
        <div 
          className="relative h-64 bg-cover bg-center" 
          style={{ backgroundImage: "url('/assets/images/solutions-cta-bg.webp')" }}
        >
          <div className="absolute inset-0 bg-blue-900/70" />
          <div className="container relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 text-white">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Terms & Conditions</h1>
            <p className="mt-4 text-lg text-gray-200">
              Please read carefully before using our services.
            </p>
          </div>
        </div>

        {/* Floating Card Content */}
        <div className="container mx-auto max-w-7xl -translate-y-16 px-4">
          <div className="rounded-xl bg-white p-8 shadow-2xl md:p-12">
            
            {/* --- 1. Quick Summary Section --- */}
            <h2 className="text-3xl font-bold text-gray-900">Summary of Terms</h2>
            <p className="mt-4 text-lg text-gray-600">
              Welcome to Firewall-Store.com. By using our site, you agree to these terms. Here are the key points:
            </p>
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
              <SummaryCard icon={UserCheck} title="Your Agreement">
                You must be at least 18 years old to use this site. All terms are subject to change.
              </SummaryCard>
              <SummaryCard icon={ShieldCheck} title="Manufacturer Warranty">
                All products are covered by the manufacturer's (OEM) warranty. We help coordinate claims.
              </SummaryCard>
              <SummaryCard icon={Box} title="Products & Shipping">
                Products are 100% genuine. We ship pan-India, but timelines may vary.
              </SummaryCard>
              <SummaryCard icon={CreditCard} title="Pricing & Payment">
                Prices are subject to change. All payments are processed securely through authorized gateways.
              </SummaryCard>
            </div>

            {/* --- 2. Full Terms (Accordion) --- */}
            <div className="mt-12 border-t border-gray-300 pt-10">
              <h2 className="text-3xl font-bold text-gray-900">Full Terms & Conditions</h2>
              <p className="mt-4 text-gray-600">
                If you do not agree to these Terms, please discontinue use of this website immediately.
              </p>
              <div className="mt-6 flow-root">
                <div className="-my-4 divide-y divide-gray-200">
                  
                  <AccordionItem title="1. General Information">
                    <p>Firewall-Store.com (“we,” “our,” or “us”) operates this e-commerce platform to offer genuine IT hardware, networking products, and security solutions to customers.</p>
                    <p>By accessing our website, you confirm that you are at least 18 years of age and legally capable of entering into binding agreements.</p>
                    <p>We reserve the right to modify, update, or revise these Terms at any time without prior notice. The updated version will take effect immediately upon publication on this page.</p>
                  </AccordionItem>
                  
                  <AccordionItem title="2. Product Information">
                    <p>All product descriptions, images, and specifications are provided for general information. While we strive for accuracy, Firewall-Store.com does not guarantee that product details are error-free, complete, or current.</p>
                    <p>Product images are for illustration purposes only; actual product packaging and appearance may vary depending on manufacturer updates.</p>
                    <p>All items are subject to stock availability. In case a product becomes unavailable after order confirmation, customers will be informed and offered an alternative or full refund.</p>
                  </AccordionItem>
                  
                  <AccordionItem title="3. Pricing & Payment">
                    <p>Prices displayed on our website are in Indian Rupees (INR) and inclusive or exclusive of taxes, as indicated.</p>
                    <p>We reserve the right to revise prices, discounts, and promotions without prior notice.</p>
                    <p>Payment must be made through authorized and secure online payment gateways. We do not store, process, or have access to customers’ payment card details.</p>
                  </AccordionItem>
                  
                  <AccordionItem title="4. Orders & Confirmation">
                    <p>Orders are processed only after successful payment confirmation.</p>
                    <p>An order confirmation email or SMS will be sent upon completion of your purchase.</p>
                    <p>We reserve the right to cancel or refuse any order in cases of pricing errors, suspected fraud, or stock unavailability. Any payment collected for such orders will be refunded in full.</p>
                  </AccordionItem>
                  
                  <AccordionItem title="5. Shipping & Delivery">
                    <p>We strive to deliver products within the estimated timelines, though delays may occur due to logistics or unforeseen events beyond our control.</p>
                    <p>Firewall-Store.com is not liable for delays caused by courier partners, natural calamities, or regulatory processes.</p>
                    <p>Once an order has been dispatched, tracking information will be provided for your reference.</p>
                  </AccordionItem>
                  
                  <AccordionItem title="6. Warranty & Returns">
                    <p>All products are covered solely by the manufacturer’s warranty. Please refer to the <Link to="/warranty" className="text-blue-600 hover:underline">Warranty Information page</Link> for full details.</p>
                    <p>Returns are accepted only for products received in damaged or defective condition, or due to shipment errors.</p>
                    <p>Customers must report issues within 48 hours of delivery with proof (such as photographs or unboxing videos).</p>
                    <p>Return requests made beyond this period or without valid proof may not be accepted.</p>
                  </AccordionItem>
                  
                  <AccordionItem title="7. Intellectual Property">
                    <p>All content on this website—including text, images, product data, logos, and design—is owned by or licensed to Firewall-Store.com and is protected under applicable copyright and trademark laws.</p>
                    <p>Unauthorized reproduction, modification, or redistribution of content is strictly prohibited.</p>
                  </AccordionItem>
                  
                  <AccordionItem title="8. Limitation of Liability">
                    <p>To the maximum extent permitted by law, Firewall-Store.com shall not be held liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the website or any product purchased.</p>
                    <p>Our total liability shall not exceed the total amount paid by the customer for the specific product in question.</p>
                    <p>We make no warranties, express or implied, about the availability, suitability, or performance of any product or service.</p>
                  </AccordionItem>
                  
                  <AccordionItem title="9. Cookies & Data Policy">
                    <p>Firewall-Store.com uses cookies and similar technologies to improve your browsing experience, personalize content, and analyze website performance.</p>
                    <p>Cookies are small text files stored on your device that help us remember preferences and understand site usage.</p>
                    <p>You can manage or disable cookies through your browser settings at any time. However, certain website functions may not operate properly without them.</p>
                    <p>We do not use cookies to collect personally identifiable information unless you voluntarily provide it (e.g., during checkout or registration). For more information about how we handle personal data, please refer to our Privacy Policy.</p>
                  </AccordionItem>
                  
                  <AccordionItem title="10. Third-Party Links">
                    <p>Our website may include links to third-party sites or services for convenience. These are beyond our control, and Firewall-Store.com is not responsible for their content, privacy practices, or terms.</p>
                    <p>Accessing third-party sites is at your own risk.</p>
                  </AccordionItem>
                  
                  <AccordionItem title="11. Governing Law & Jurisdiction">
                    <p>These Terms are governed by and construed under the laws of India.</p>
                    <p>Any disputes shall fall under the exclusive jurisdiction of the courts in Hyderabad, Telangana.</p>
                  </AccordionItem>

                </div>
              </div>
            </div>

            {/* --- 3. Contact & Support Section --- */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900">12. Contact Us</h3>
              <p className="mt-4 text-lg text-gray-600">
                For any questions or clarifications regarding these Terms & Conditions, please reach out to:
              </p>
              <div className="mt-6 flex flex-col space-y-4 sm:flex-row sm:space-x-8 sm:space-y-0">
                <a href="mailto:sales@firewall-store.com" className="inline-flex items-center text-lg font-medium text-blue-600 hover:text-blue-800">
                  <Mail className="mr-2 h-5 w-5" />
                  sales@firewall-store.com
                </a>
                <a href="tel:+917032224513" className="inline-flex items-center text-lg font-medium text-blue-600 hover:text-blue-800">
                  <Phone className="mr-2 h-5 w-5" />
                  +91-7032224513
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};