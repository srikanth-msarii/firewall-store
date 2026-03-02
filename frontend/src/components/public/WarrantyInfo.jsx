import React from 'react';
import { 
  DollarSign, 
  ShieldCheck, 
  Headset, 
  BadgeCheck, 
  Lock, 
  ListChecks, 
  HelpCircle 
} from 'lucide-react';

// 1. Moved array outside component, as it's a constant
const warrantyItems = [
  {
    icon: DollarSign,
    title: '100% Low Price Guarantee:',
    text: 'Router-switch.com provides high-quality products at low wholesale prices'
  },
  {
    icon: BadgeCheck,
    title: '100% Quality Assurance:',
    text: 'All items are brand new and factory-sealed. For added assurance, each unit can be fully tested and verified by a Cisco certified engineer—upon your request.'
  },
  {
    icon: Headset,
    title: 'Free CCIE Technical Support:',
    text: 'Our FREE Cisco CCIE Expert Consultancy Support is over the phone, by chat, by email or by login remotely.'
  },
  {
    icon: ShieldCheck,
    title: '100% Money Back Guarantee:',
    text: 'You can contact our customer service team to exchange or return any product that you bought from us.'
  },
  {
    icon: Lock,
    title: 'Flexible Secure Payment & Shipment:',
    text: 'Verified authorization: McAfee Secure, VeriSign Secured'
  }
];

// 2. Assign the 5th icon to a variable
const FifthIcon = warrantyItems[4].icon;

export const WarrantyInfo = () => {
  return (
    <section className="py-4">
      <div className="container mx-auto max-w-7xl px-4">
        {/* <h2 className="text-3xl font-semibold text-gray-900">Warranty</h2> */}
        
        {/* Top 4 items */}
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
          {warrantyItems.slice(0, 4).map((item) => (
            <div key={item.title} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
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

        {/* 5th item (full width) */}
        <div className="mt-10 border-t border-gray-300 pt-10">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <FifthIcon className="h-6 w-6" />
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{warrantyItems[4].title}</h3>
              <p className="mt-1 text-gray-600">{warrantyItems[4].text}</p>
            </div>
          </div>
        </div>
        
        {/* RMA Process */}
        <div className="mt-12 border-t border-gray-300 pt-10">
          <h2 className="text-2xl font-bold text-gray-900">Return Material Authorization (RMA) Process</h2>
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
      </div>
    </section>
  );
};