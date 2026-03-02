import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Hero = () => {
  // We'll use a placeholder background. 
  // Later, we can replace this with a real image.
  const placeholderBg = '/assets/images/switch-solutions_banner.webp';

  return (
    <div 
      className="relative w-full bg-cover bg-center text-white" 
      style={{ 
        backgroundImage: `url(${placeholderBg})`,
        height: '500px' // Adjust height as needed
      }}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-full max-w-xl flex-col justify-center pt-24">
          <span className="mb-2 text-lg font-semibold text-blue-300">
            Protect What Matters Most
          </span>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Advanced security solutions designed for reliability and scalability.
          </h1>
          <p className="mt-4 text-xl text-gray-200">
            A new generation of server technology
          </p>
          <div className="mt-8">
            <a
              href="#featured" // We'll link to our featured section
              className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3
                         text-base font-semibold text-white shadow-lg 
                         transition-transform hover:scale-105"
            >
              Explore Products
              <ArrowRight size={20} className="ml-2" />
            </a>
          </div>
        </div>
      </div>
      
      {/* You can add the server images here later */}
      {/* <div className="absolute right-0 bottom-0 ..."> ... </div> */}
    </div>
  );
};
