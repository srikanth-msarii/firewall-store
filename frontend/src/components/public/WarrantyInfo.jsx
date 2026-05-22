import React from "react";
import {
  DollarSign,
  ShieldCheck,
  Headset,
  BadgeCheck,
  Lock,
  ClipboardList,
  Users,
  ListChecks,
  HelpCircle,
} from "lucide-react";

// 1. Moved array outside component, as it's a constant
const warrantyItems = [
  {
    icon: DollarSign,
    title: "Low Price Commitment:",
    text: "Firewall-store.com delivers genuine IT and security products at competitive pricing with value-driven solutions for businesses of all sizes.",
  },
  {
    icon: BadgeCheck,
    title: "Assured Product Quality:",
    text: "All products are sourced from authorized channels and delivered brand-new with OEM warranty and quality assurance.",
  },
  {
    icon: Headset,
    title: "Technical Support Assistance:",
    text: "Our team provides pre-sales and post-sales technical guidance through phone, email, chat, and remote assistance.",
  },
  {
    icon: ShieldCheck,
    title: "Easy Return & Replacement:",
    text: "We offer hassle-free support for eligible product returns, replacements, and warranty-related assistance.",
  },
  {
    icon: Lock,
    title: "Secure Payments & Reliable Shipping:",
    text: "Firewall-store.com ensures secure payment processing and dependable nationwide delivery for all orders.",
  },
  {
    icon: ClipboardList,
    title: "Warranty & RMA Support:",
    text: "We provide OEM-backed warranty support and streamlined RMA assistance for eligible networking, security, and IT infrastructure products.",
  },
  {
    icon: Users,
    title: "Dedicated Customer Support:",
    text: "For any technical or service-related concerns, our support and sales teams are available to assist throughout the purchase lifecycle.",
  },
];

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
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-gray-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Remaining warranty items */}
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 border-t border-gray-300 pt-10 md:grid-cols-2">
          {warrantyItems.slice(4).map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-gray-600">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* RMA Process */}
        <div className="mt-12 border-t border-gray-300 pt-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Return Material Authorization (RMA) Process
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <ListChecks className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Standard Warranty Policy:
                </h3>
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
                <h3 className="text-lg font-semibold text-gray-900">
                  The Support Contacts:
                </h3>
                <p className="mt-2 text-gray-600">
                  If your Cisco products failed, you must contact your sales
                  representative. If the problem still can't be corrected by
                  remote support, the RMA procedure will issue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
