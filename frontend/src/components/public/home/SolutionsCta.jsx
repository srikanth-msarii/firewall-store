import React from 'react';
import { Link } from 'react-router-dom';

// We use the real background image from the original site
const bgImage = "/assets/images/solutions-cta-bg.webp";

export const SolutionsCta = () => {
  return (
    <section 
      className="flex items-center bg-cover bg-center py-24" 
      // This applies the dark overlay just like the screenshot
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgImage})` }}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="w-full md:w-1/2">
          {/* These text sizes are translated from the site's custom classes:
            h2023_font_size_14_to_m_12 -> text-xs md:text-sm
            h2023_font_size_40_to_m_32 -> text-3xl md:text-4xl
            h2023_font_size_16_to_m_14 -> text-sm md:text-base
          */}
          <span className="text-xs font-semibold text-white md:text-sm">
            Firewall Store Solutions
          </span>
          <h2 className="my-4 text-3xl font-bold text-white md:text-4xl">
            Together with Trace, Create Connections, Amplify Innovation
          </h2>
          <p className="mb-8 mt-3 text-sm text-gray-200 md:text-base">
            Solving problems encountered in your business and help you build the ecosystems of business, people, IT hardware and technology.
          </p>
          <div className="flex space-x-4">
            {/* Translated button styles:
              h2023_0073ED_blue_color_bg_button -> bg-[#0073ED]
              h2023_0073ED_white_color_border_button -> border-white
            */}
            <Link 
              to="/products"
              className="rounded-full bg-[#0073ED] px-5 py-3 font-semibold text-white no-underline transition-colors hover:bg-blue-700"
            >
              Find Products
            </Link>
            <Link 
              to="/inquiry"
              className="rounded-full border border-white px-5 py-3 font-semibold text-white no-underline transition-colors hover:bg-white hover:text-black"
            >
              Ask the Expert
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};