import React from 'react';
import { Link } from 'react-router-dom';
import { ServerCrash, Home } from 'lucide-react'; // Using a relevant icon

export const NotFound = () => {
  return (
    <>
      {/* SEO Tags for 404 */}
      <title>404: Page Not Found | Firewall Store</title>
      <meta name="robots" content="noindex, nofollow" />

      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center" 
        style={{ backgroundImage: "url('/assets/images/solutions-cta-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-red-800/60" />
        <div className="container relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 text-white">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Page Not Found (404)</h1>
          <p className="mt-4 text-lg text-gray-200">
            Sorry, the page you're looking for doesn't exist.
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto max-w-7xl -translate-y-16 px-4">
        <div className="rounded-xl bg-white p-8 shadow-md md:p-12">
          <div className="flex flex-col items-center text-center">
            <ServerCrash className="h-20 w-20 text-red-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Oops! You've hit a dead end.</h2>
            <p className="mt-4 max-w-xl text-lg text-gray-600">
              The page you are trying to access might have been moved, deleted, or never existed. You can go back to our homepage or try searching for what you need.
            </p>
            <Link 
              to="/"
              className="mt-10 inline-flex items-center rounded-md bg-blue-600 px-6 py-3
                         text-base font-semibold text-white shadow-md
                         transition-transform hover:scale-105 hover:bg-blue-700"
            >
              <Home className="mr-2 h-5 w-5" />
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};