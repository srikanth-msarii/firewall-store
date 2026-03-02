import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PromoCard } from '../../components/public/PromoCard';
import { ArrowRight, Tag } from 'lucide-react';
// 1. Import the service
import { promotionService } from '../../services/api';

export const Promotions = () => {
  // 2. Add loading/error states
  const [featuredPromo, setFeaturedPromo] = useState(null);
  const [standardPromos, setStandardPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 3. Fetch data from API
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        setLoading(true);
        const { data } = await promotionService.getPromotions();
        
        // Find the first featured promo
        setFeaturedPromo(data.find(p => p.isFeatured) || null);
        // Get the rest
        setStandardPromos(data.filter(p => !p.isFeatured));
        
      } catch (err) {
        console.error("Failed to fetch promotions", err);
        setError("Could not load promotions at this time.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPromos();
  }, []);


  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center" 
        style={{ backgroundImage: "url('/assets/images/solutions-cta-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="container relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 text-white">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Promotions & Deals</h1>
          <p className="mt-4 text-lg text-gray-200">
            Get the best value on top-tier networking and server hardware.
          </p>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
          
          {/* 4. Add Loading/Error states */}
          {loading ? (
            <div className="text-center text-lg text-gray-600">Loading deals...</div>
          ) : error ? (
            <div className="text-center text-lg text-red-600">{error}</div>
          ) : (
            <>
              {/* Featured Promotion Card */}
              {featuredPromo && (
                <div className="mb-16 overflow-hidden rounded-xl bg-white shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-3">
                      <img 
                        src={featuredPromo.image} 
                        alt={featuredPromo.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-8 md:col-span-2">
                      <span className="mb-2 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                        <Tag className="mr-1.5 h-4 w-4" />
                        Featured Deal
                      </span>
                      <h2 className="text-3xl font-bold text-gray-900">{featuredPromo.title}</h2>
                      <p className="mt-1 text-lg font-medium text-gray-500">{featuredPromo.model}</p>
                      <p className="mt-4 text-base text-gray-600">{featuredPromo.description}</p>
                      <p className="mt-6 text-2xl font-bold text-blue-600">{featuredPromo.dealText}</p>
                      <Link 
                        // 5. Use MongoDB _id for the link
                        to={featuredPromo.link}
                        className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-6
                                  py-3 font-semibold text-white shadow-md transition-colors
                                  hover:bg-blue-700 sm:w-auto"
                      >
                        View Deal
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Standard Promotions Grid */}
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">More Deals</h2>
              <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {standardPromos.map(promo => (
                  // 5. Use MongoDB _id for the key
                  <PromoCard key={promo._id} promo={promo} />
                ))}
              </div>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
};