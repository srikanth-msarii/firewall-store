import React from 'react';
import { Check } from 'lucide-react'; 
// 1. Import Link
import { Link } from 'react-router-dom';

export const ExpertCallout = ({ onAskExpertClick }) => {
  return (
    // 1. Adjusted top margin
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Profile Images */}
      <div className="flex justify-center">
          <img
            className="inline-block h-16 w-auto"
            src="/assets/images/expert.webp"
            alt="Expert 1"
          />
      </div>
      
      <h3 className="mt-4 text-center text-xl font-bold text-blue-600">
        Expertise Builds Trust
      </h3>

      <ul className="mt-4 space-y-2 text-gray-700">
        <li className="flex items-start">
          <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
          <span>22 Years, 200+ Countries</span>
        </li>
        <li className="flex items-start">
          <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
          <span>18000+ Customers/Projects</span>
        </li>
        <li className="flex items-start">
          <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
          <span>CCIE, CISSP, JNCIE, NSE 7, AWS, Google Cloud Experts</span>
        </li>
      </ul>

      {/* 2. Changed from <button> to <Link> and set the `to` prop */}
      <Link
        to="/inquiry"
        className="mt-6 block w-full rounded-full border border-blue-600 bg-white px-6 py-2.5
                   text-center text-sm font-semibold text-blue-600 shadow-sm
                   transition-all hover:bg-blue-600 hover:text-white"
      >
        Ask an Expert Now
      </Link>
    </div>
  );
};

