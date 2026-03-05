import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// 1. Import the product service
import { productService } from '../../services/api';

// Main navigation links (can be static)
const mainNav = ['Access Points / Wireless', 'Switches', 'Firewalls', 'Servers'];

export const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null); // 2. Add error state

  const categoryMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const categoryButtonRef = useRef(null);
  const mobileButtonRef = useRef(null);

  // 3. Fetch and process data from the API
  useEffect(() => {
    const fetchNavData = async () => {
      try {
        // 4. Call the API
        const { data } = await productService.getProducts();

        // Process the flat product list into a grouped category map
        const categoryMap = new Map();
        data.forEach(product => {
          if (!product.category || !product.brand) return;

          if (!categoryMap.has(product.category)) {
            categoryMap.set(product.category, new Set());
          }
          categoryMap.get(product.category).add(product.brand);
        });

        // 5. FIX: Changed 'aboutSet' to 'brandsSet'
        const processedCategories = Array.from(categoryMap.entries()).map(([name, brandsSet], index) => ({
          id: index + 1,
          name: name,
          sub: Array.from(brandsSet).slice(0, 5) // Show top 5 brands per category
        }));

        setCategories(processedCategories);
      } catch (err) {
        console.error("Failed to fetch nav categories", err);
        setError("Could not load navigation data.");
      }
    };

    fetchNavData();
  }, []); // Empty array ensures this runs only once

  // Effect to handle clicks outside of the menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close category menu if click is outside
      if (
        isCategoryMenuOpen &&
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target) &&
        categoryButtonRef.current &&
        !categoryButtonRef.current.contains(event.target)
      ) {
        setIsCategoryMenuOpen(false);
      }

      // Close mobile menu if click is outside
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileButtonRef.current &&
        !mobileButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryMenuOpen, isMobileMenuOpen]); // Re-run if menus open/close

  // New toggle handlers to ensure menus are exclusive
  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
    setIsMobileMenuOpen(false); // Close other menu
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsCategoryMenuOpen(false); // Close other menu
  };

  return (
    <nav className="z-40 bg-blue-700 text-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between">

          <div className="group relative" ref={categoryMenuRef}>
            <button
              ref={categoryButtonRef}
              type="button"
              onClick={toggleCategoryMenu}
              className="flex items-center bg-blue-800 px-6 py-3 font-semibold transition-colors hover:bg-blue-900"
            >
              <Menu size={20} className="mr-2" />
              All Categories
              <ChevronDown size={18} className="ml-2" />
            </button>

            <div
              className={`absolute left-0 top-full z-50 w-full lg:min-w-[700px] lg:max-w-[800px] transform rounded-b-md 
                          bg-white text-gray-700 shadow-lg transition-all duration-300
                          ${isCategoryMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                          lg:group-hover:scale-100 lg:group-hover:opacity-100`}
            >
              {/* Handle error state */}
              {error ? (
                <div className="p-6 text-center text-red-600">{error}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-h-[70vh] overflow-y-auto">
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <Link
                        to={`/products?category=${cat.name}`}
                        onClick={() => setIsCategoryMenuOpen(false)} // Close menu on link click
                        className="mb-2 inline-block text-base font-semibold text-gray-800 hover:text-blue-600"
                      >
                        {cat.name}
                      </Link>
                      <ul className="space-y-1.5">
                        {cat.sub.map((brand) => (
                          <li key={brand}>
                            <Link
                              to={`/products?category=${cat.name}&brand=${brand}`}
                              onClick={() => setIsCategoryMenuOpen(false)} // Close menu on link click
                              className="block text-sm hover:text-blue-600 hover:underline"
                            >
                              {brand}
                            </Link>
                          </li>
                        ))}
                        {cat.sub.length > 0 && (
                          <li>
                            <Link
                              to={`/products?category=${cat.name}`}
                              onClick={() => setIsCategoryMenuOpen(false)} // Close menu on link click
                              className="mt-1 block text-sm font-semibold text-blue-600 hover:underline"
                            >
                              View All {cat.name} <ArrowRight size={14} className="ml-1 inline" />
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Nav Links (Desktop) */}
          <div className="hidden items-center space-x-1 lg:flex">
            {mainNav.map(link => (
              <Link
                key={link}
                to={`/products?category=${link}`}
                className="px-4 py-3 text-sm font-medium transition-colors hover:bg-blue-800"
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Right-side Links (Desktop) */}
          <div className="hidden items-center space-x-1 lg:flex">
            <Link to="/about" className="px-4 py-3 text-sm font-medium transition-colors hover:bg-blue-800">About Us</Link>
            <Link to="/promotions" className="px-4 py-3 text-sm font-medium transition-colors hover:bg-blue-800">Promotions</Link>
            <Link
              to="/contact"
              className="px-4 py-3 text-sm font-medium transition-colors hover:bg-blue-800"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            ref={mobileButtonRef}
            className="p-2 lg:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Now includes all links */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            ref={mobileMenuRef}
            className="absolute left-0 z-30 w-full bg-blue-800 shadow-lg lg:hidden overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <ul className="flex flex-col">
              {/* Combine all nav links for mobile */}
              {["About Us", "Promotions", "Contact Us", ...mainNav].map((link) => (
                <li key={link} className="border-b border-blue-700">
                  <Link
                    to={
                      link === "Contact Us" ? "/contact" :
                        link === "About Us" ? "/about" :
                          link === "Promotions" ? "/promotions" :
                            `/products?category=${link}`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 font-medium hover:bg-blue-900"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </nav>
  );
};