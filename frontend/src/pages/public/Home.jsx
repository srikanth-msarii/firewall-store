import React, { useState, useEffect } from 'react';
import { Hero } from '../../components/public/home/Hero';
import { PartnerLogos } from '../../components/public/home/PartnerLogos';
import { ProductCard } from '../../components/shared/ProductCard';
import { SolutionsCta } from '../../components/public/home/SolutionsCta';
import { ServicesList } from '../../components/public/home/ServicesList';
import { ConnectCta } from '../../components/public/home/ConnectCta';
import { productService } from '../../services/api';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  // 2. Add loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Update useEffect to fetch from the API
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // 4. Call the API to get products where 'featured: true'
        const { data } = await productService.getProducts({ featured: true });
        setFeaturedProducts(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch featured products", err);
        setError("Could not load featured products at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []); // Runs once on component mount

  return (
    <div className="w-full bg-white">
      <Hero />
      
      <PartnerLogos />

      {/* Featured Products Section */}
      <section id="featured" className="py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Featured Products
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Check out our latest and most popular hardware
            </p>
          </div>
          
          {/* 5. Add loading and error handling */}
          {loading ? (
            <div className="text-center text-lg text-gray-600">Loading products...</div>
          ) : error ? (
            <div className="text-center text-lg text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                // 6. Use product._id (from MongoDB) as the key
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* These components are static, so they remain unchanged */}
      <SolutionsCta />
      <ServicesList />
      <ConnectCta />

    </div>
  );
};