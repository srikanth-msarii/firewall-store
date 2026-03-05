import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, Phone, DollarSign, BadgeCheck, Headset, ShieldCheck, Lock,
  ListChecks, HelpCircle, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Data for the visual "Guarantees" grid ---
const guaranteeItems = [
  {
    icon: DollarSign,
    title: '100% Low Price Guarantee',
    text: 'Firewall-Store.com provides high-quality products at low wholesale prices.'
  },
  {
    icon: BadgeCheck,
    title: '100% Quality Assurance',
    text: 'All items are brand new and factory-sealed. Units can be tested by a certified engineer upon request.'
  },
  {
    icon: Headset,
    title: 'Free CCIE Technical Support',
    text: 'Our FREE Cisco CCIE Expert Consultancy Support is available via phone, chat, email, or remote login.'
  },
  {
    icon: ShieldCheck,
    title: 'Easy Returns & Replacement',
    text: 'Contact our customer service team within 48 hours to exchange or return defective or damaged products.'
  },
  {
    icon: Lock,
    title: 'Flexible Secure Payment & Shipment',
    text: 'Verified authorization: McAfee Secure, VeriSign Secured.'
  }
];

// --- Data for the Accordion ---
const policyItems = [
  {
    title: '1. Manufacturer Warranty — Primary Coverage',
    content: "All products sold through Firewall Store are covered only by the warranty provided by the product’s manufacturer (the “OEM”). Warranty type (onsite, carry-in, replacement) and duration vary by OEM and product model. Any manufacturer-specific terms (including firmware, subscriptions, or licenses) apply as specified by the OEM."
  },
  {
    title: '2. Customer Responsibilities',
    content: "Warranty claims require a valid proof of purchase (invoice), the product serial number, and reasonable cooperation during the claim process. Customers must follow OEM instructions and avoid unauthorized repairs or tampering."
  },
  {
    title: '3. Exclusions — What Is Not Covered',
    content: "The manufacturer warranty and Firewall Store do not cover damage or claims resulting from: Accidents, misuse, neglect, theft, loss, or cosmetic damage (scratches, dents). Unauthorized modifications, repairs, or installations. Electrical surges, lightning, flooding, fire, or other acts of God. Software issues not covered by the OEM, data loss, or virus/malware infection. Consumables and accessories such as batteries, cables, or detachable consumable parts unless the OEM specifically covers them."
  },
  {
    title: '4. Returns, Repairs & Replacement Process',
    content: "For warranty service, contact Firewall Store support with your order invoice and product serial number. We will help coordinate the claim with the OEM or their authorized service center. Repair, replacement, or refund will be provided only in accordance with the OEM’s warranty policy. Firewall Store does not guarantee outcomes beyond what the OEM provides."
  },
  {
    title: '5. Limitation of Liability',
    content: "To the fullest extent permitted by applicable law, Firewall Store’s liability for any claim arising out of or related to products sold is limited to one of the following, at our discretion: (a) repair, (b) replacement, or (c) refund of the original purchase price paid for the defective product. Under no circumstances shall Firewall Store be liable for any indirect, incidental, special, consequential, or punitive damages — including but not limited to loss of revenue, loss of business, loss of data, or loss of profits — even if Firewall Store was advised of the possibility of such damages."
  },
  {
    title: '6. Third-Party Software, Subscriptions & Services',
    content: "Some security appliances and network devices include third-party software, cloud services, or subscriptions (e.g., threat intelligence feeds, management consoles). Those services are governed by the OEM’s or vendor’s terms and may require separate activation, registration, or subscription fees. Firewall Store is not responsible for third-party service availability or content."
  },
  {
    title: '7. Governing Law & Consumer Rights',
    content: "These warranty terms are subject to applicable law and do not affect any statutory consumer rights that cannot be excluded or limited under local law. Where local consumer protection laws provide stronger rights, those laws will apply. If a court finds part of this policy unenforceable, the remainder will continue to apply."
  },
  {
    title: '8. Changes to Warranty Policy',
    content: "Firewall Store reserves the right to update or modify this Warranty & Liability Information at any time. Any material changes affecting existing orders will be applied only as allowed by applicable law."
  }
];

// --- Accordion Item Component ---
const AccordionItem = ({ title, content }) => {
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
            {/* Using `prose` here for just the content is perfect */}
            <div className="prose max-w-none pb-5 text-gray-600">
              <p>{content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export const WarrantyPage = () => {
  return (
    <>
      {/* --- SEO Tags (React 19) --- */}
      <title>Warranty Information | Trace Networks</title>
      <meta
        name="description"
        content="Review the warranty and liability information for all products sold by Trace Networks (Firewall-Store.com)."
      />
      <link rel="canonical" href="https://www.tracenetworks.com/warranty" />
      <meta property="og:title" content="Warranty Information | Trace Networks" />
      <meta property="og:description" content="Learn about our guarantees, RMA process, and warranty policies." />

      {/* --- Page Content --- */}
      <div className="bg-gray-50 pb-20">

        {/* Hero Section */}
        <div
          className="relative h-64 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/images/solutions-cta-bg.webp')" }}
        >
          <div className="absolute inset-0 bg-blue-900/70" />
          <div className="container relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 text-white">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Warranty Information</h1>
            <p className="mt-4 text-lg text-gray-200">
              Our commitment to quality, authenticity, and support.
            </p>
          </div>
        </div>

        {/* Floating Card Content */}
        <div className="container mx-auto max-w-7xl -translate-y-16 px-4">
          <div className="rounded-xl bg-white p-8 shadow-md md:p-12">

            {/* --- 1. Our Guarantees (Visual Grid) --- */}
            <h2 className="text-3xl font-bold text-gray-900">Our Guarantees</h2>
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
              {guaranteeItems.map((item) => (
                <div key={item.title} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <item.icon className="h-6 w-6" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-gray-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* --- 2. RMA Process (from screenshot) --- */}
            <div className="mt-12 border-t border-gray-300 pt-12">
              <h2 className="text-3xl font-bold text-gray-900">Return Material Authorization (RMA) Process</h2>
              <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <ListChecks className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Standard Warranty Policy:</h3>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
                      <li>Original New Sealed Enterprise Hardware: 3 Years</li>
                      <li>Original New Sealed Consumer Devices: 1 Year</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <HelpCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">The Support Contacts:</h3>
                    <p className="mt-2 text-gray-600">
                      If your Cisco products failed, you must contact your sales representative. If the problem still can't be corrected by remote support, the RMA procedure will issue.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- 3. Full Policy Details (Accordion) --- */}
            <div className="mt-12 border-t border-gray-300 pt-10">
              <h2 className="text-3xl font-bold text-gray-900">Warranty & Liability Details</h2>
              <div className="mt-6 flow-root">
                <div className="-my-4 divide-y divide-gray-200">
                  {policyItems.map((item) => (
                    <AccordionItem key={item.title} title={item.title} content={item.content} />
                  ))}
                </div>
              </div>
            </div>

            {/* --- 4. Contact & Support Section --- */}
            <div className="mt-12 pt-10">
              <h3 className="text-2xl font-bold text-gray-900">9. Contact & Support</h3>
              <p className="mt-4 text-lg text-gray-600">
                For warranty assistance or questions, please include your order invoice and product serial number so we can assist quickly.
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