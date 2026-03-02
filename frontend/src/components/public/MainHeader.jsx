import React, { useState, useEffect, useRef } from 'react';
import { Search, User, ClipboardList, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// 1. Import the product service
import { productService } from '../../services/api';

// 2. Extracted Search Bar into its own component
const SearchComponent = ({
  searchTerm,
  suggestions,
  handleSearchChange,
  handleSearchSubmit,
  clearSearch,
  handleSuggestionClick,
  isMobile = false
}) => (
  <div className="relative w-full">
    <form onSubmit={handleSearchSubmit} className="relative flex w-full">
      <input
        type="text"
        placeholder="I'm looking for..."
        className={`w-full rounded-full border py-3 pl-6 pr-24 text-base
                   text-gray-800 placeholder-gray-500
                   focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300
                   ${isMobile ? 'border-gray-300 bg-gray-100' : 'border-gray-300 bg-white'}`}
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={handleSearchChange}
        autoFocus={isMobile} 
      />

      {searchTerm && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-12 top-0 bottom-0 z-10 my-auto flex h-full 
                     items-center rounded-r-full bg-transparent px-2
                     text-gray-400 transition-colors hover:text-red-600"
        >
          <X size={20} />
        </button>
      )}

      <button
        type="submit"
        className="absolute right-0 top-0 bottom-0 z-10 my-auto flex h-full 
                   items-center rounded-r-full bg-transparent px-5
                   text-gray-500 transition-colors hover:text-blue-600"
      >
        <Search size={22} />
      </button>
    </form>

    {/* Suggestions Dropdown */}
    {suggestions.length > 0 && (
      <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
        <ul className="divide-y divide-gray-100">
          {suggestions.map((product) => (
            <li key={product._id}>
              <Link
                to={`/products/${product._id}`}
                onClick={handleSuggestionClick}
                className="flex items-center space-x-4 p-3 transition-colors hover:bg-gray-50"
              >
                <img
                  src={product.image || `https://placehold.co/60x60/e0e7ff/3741b1?text=${product.model}`}
                  alt={product.name}
                  className="h-12 w-12 flex-shrink-0 rounded-md object-contain"
                />
                <div>
                  <p className="font-semibold text-gray-800">{product.model}</p>
                  <p className="text-sm text-gray-500">{product.name}</p>
                </div>
              </Link>
            </li>
          ))}
          <li className="bg-gray-50 text-center">
            <Link
              to={`/products?q=${searchTerm}`}
              onClick={handleSuggestionClick}
              className="block py-3 font-semibold text-blue-600 hover:underline"
            >
              View all results for "{searchTerm}"
            </Link>
          </li>
        </ul>
      </div>
    )}
  </div>
);


export const MainHeader = ({ onQuoteClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const navigate = useNavigate();
  const searchRef = useRef(null); 
  const mobileSearchRef = useRef(null);

  // 5. Fetch all product data from API
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const { data } = await productService.getProducts();
        setAllProducts(data);
      } catch (err) {
        console.error("Failed to fetch all products for search", err);
      }
    };
    
    fetchAllProducts();
  }, []); // Runs once on mount

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (searchRef.current && !searchRef.current.contains(event.target)) &&
        (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target))
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef, mobileSearchRef]);

  // Handle typing in the search bar
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.length > 1) {
      // Filter from the "allProducts" state
      const filteredSuggestions = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.model.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Handle submitting the search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?q=${searchTerm}`);
      setSearchTerm('');
      setSuggestions([]);
      setIsMobileSearchOpen(false); // Close mobile search on submit
    }
  };

  // Handle clicking a suggestion
  const handleSuggestionClick = () => {
    setSearchTerm('');
    setSuggestions([]);
    setIsMobileSearchOpen(false); // Close mobile search on click
  };

  // Clear the search
  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <div className="bg-white py-4 shadow-sm border-b border-gray-200">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-12 items-center gap-x-4 gap-y-3">
          
          {/* Logo */}
          <div className="col-span-4 sm:col-span-3">
            <Link to="/" className="cursor-pointer">
              <img src="/assets/images/logo.png" alt="Trace" className='h-12' />
            </Link>
          </div>

          {/* Icons (Order 2 on mobile, Order 3 on desktop) */}
          <div className="col-span-8 sm:col-span-9 lg:col-span-3 order-2 lg:order-3">
            <div className="flex items-center justify-end space-x-4 md:space-x-6">
              <button
                onClick={() => setIsMobileSearchOpen(true)}
                className="flex items-center space-x-1.5 text-gray-600 hover:text-blue-600 lg:hidden"
              >
                <Search size={22} />
              </button>

              <button
                onClick={() => onQuoteClick()}
                className="flex items-center space-x-1.5 text-gray-600 hover:text-blue-600"
              >
                <ClipboardList size={20} />
                <span className="hidden md:inline text-sm font-medium">Get a Quote</span>
              </button>
              
              <Link to="/admin/login" className="flex items-center space-x-1.5 sm:me-5 text-gray-600 hover:text-blue-600">
                <User size={20} />
                <span className="hidden md:inline text-sm font-medium">Sign In</span>
              </Link>
            </div>
          </div>

          {/* Desktop Search Bar (hidden on mobile) */}
          <div className="relative col-span-12 lg:col-span-6 order-3 lg:order-2 hidden lg:block" ref={searchRef}>
            <SearchComponent
              searchTerm={searchTerm}
              suggestions={suggestions}
              handleSearchChange={handleSearchChange}
              handleSearchSubmit={handleSearchSubmit}
              clearSearch={clearSearch}
              handleSuggestionClick={handleSuggestionClick}
            />
          </div>

        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-white z-50"
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="container mx-auto max-w-7xl px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Search Products</span>
                <button 
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div ref={mobileSearchRef}>
                <SearchComponent
                  searchTerm={searchTerm}
                  suggestions={suggestions}
                  handleSearchChange={handleSearchChange}
                  handleSearchSubmit={handleSearchSubmit}
                  clearSearch={clearSearch}
                  handleSuggestionClick={handleSuggestionClick}
                  isMobile={true}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};