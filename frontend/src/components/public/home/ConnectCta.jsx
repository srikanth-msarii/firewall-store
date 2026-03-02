import React from 'react';
import { Link } from 'react-router-dom';

// Real background image from the original site
const bgImage = "/assets/images/quote-bg.webp";

export const ConnectCta = () => {
  return (
    <section 
      className="flex items-center bg-cover bg-center py-32"
      // Apply the dark overlay
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bgImage})` }}
    >
      <div className="container mx-auto max-w-7xl px-4 text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Start Connecting Today</h2>
        <p className="mb-8 mt-3 text-sm text-gray-200 md:text-base">
          Let's create more possibilities together.
        </p>
        <Link 
          to="/inquiry"
          // Translated blue button class
          className="rounded-full bg-[#0073ED] px-8 py-3.5 font-semibold text-white no-underline transition-colors hover:bg-blue-700"
        >
          Ask the Expert
        </Link>
      </div>
    </section>
  );
};