import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { ProductCard } from '../../components/shared/ProductCard';
import { ProductSidebar } from '../../components/public/ProductSidebar';
// 1. Import the new services
import { productService, brandService } from '../../services/api';

// Helper function to parse price strings
const parsePrice = (priceString) => {
  if (!priceString) return null;
  const num = parseFloat(priceString.replace(/[$,]/g, ''));
  return isNaN(num) ? null : num;
};

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // State for ALL products
  const [allProducts, setAllProducts] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  // 2. Add loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 3. Fetch data from API on load
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // 4. Fetch all products AND all brands in parallel
        const [productsRes, brandsRes] = await Promise.all([
          productService.getProducts(), // Gets all products
          brandService.getBrands()      // Gets all brands
        ]);
        
        setAllProducts(productsRes.data);
        setAllBrands(brandsRes.data.map(b => b.name)); // Just get the names
        setError(null);

      } catch (err) {
        console.error("Failed to fetch products or brands", err);
        setError("Could not load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []); // Empty array means run once on mount

  // --- Read filter values from URL (This is all correct) ---
  const selectedBrands = searchParams.getAll('brand');
  const inStockOnly = searchParams.get('stock') === 'true';
  const minPrice = searchParams.get('min') || '';
  const maxPrice = searchParams.get('max') || '';
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const searchTerm = searchParams.get('q');
  // --- End of reading filters ---

  // --- Filter Handlers (These are all correct) ---
  const handleBrandChange = (brand) => {
    const currentBrands = searchParams.getAll('brand');
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];

    const newParams = new URLSearchParams(searchParams);
    newParams.delete('brand');
    newBrands.forEach(b => newParams.append('brand', b));
    setSearchParams(newParams);
  };
  const handleStockChange = (isChecked) => {
    const newParams = new URLSearchParams(searchParams);
    if (isChecked) { newParams.set('stock', 'true'); } else { newParams.delete('stock'); }
    setSearchParams(newParams);
  };
  const handleMinPriceChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) { newParams.set('min', value); } else { newParams.delete('min'); }
    setSearchParams(newParams);
  };
  const handleMaxPriceChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) { newParams.set('max', value); } else { newParams.delete('max'); }
    setSearchParams(newParams);
  };
  // --- End Filter Handlers ---

  // 5. Filter logic (This is correct)
  // This filters the "allProducts" list based on the URL params
  const filteredProducts = useMemo(() => {
    const numMinPrice = parseFloat(minPrice);
    const numMaxPrice = parseFloat(maxPrice);
    const priceFilterActive = !isNaN(numMinPrice) || !isNaN(numMaxPrice);

    return allProducts.filter(p => {
      // Filter by Search Term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const inName = p.name.toLowerCase().includes(query);
        const inModel = p.model.toLowerCase().includes(query);
        const inBrand = p.brand.toLowerCase().includes(query);
        if (!inName && !inModel && !inBrand) return false;
      }
      // Filter by Category
      if (category && p.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }
      // Filter by Stock
      if (inStockOnly && p.stock <= 0) return false;
      // Filter by Brand
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }
      // Filter by Price
      const productPrice = parsePrice(p.price);
      if (productPrice === null) {
        return !priceFilterActive; // Hide if price filter is on
      }
      if (!isNaN(numMinPrice) && productPrice < numMinPrice) return false;
      if (!isNaN(numMaxPrice) && productPrice > numMaxPrice) return false;

      return true;
    });
  }, [allProducts, searchParams]); // Use searchParams as dependency

  // --- Dynamic Title & Description ---
  const title = searchTerm ? `Search results for "${searchTerm}"` : (subcategory || category || 'All Products');
  const description = searchTerm 
    ? `Found ${filteredProducts.length} results for "${searchTerm}" on Trace Networks.`
    : `Browse our full selection of ${title.toLowerCase()}. Get a quote for any product from Trace Networks.`;
  
  const canonicalUrl = `https://www.tracenetworks.com${location.pathname}${location.search}`;

  return (
    <>
      {/* --- SEO Tags (React 19) --- */}
      <title>{`${title} | Trace Networks`}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={`${title} | Trace Networks`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content="https://www.tracenetworks.com/assets/images/solutions-cta-bg.webp" />
      <meta property="og:type" content="website" />
      
      {/* --- Page Content --- */}
      <div className="bg-gray-50 pb-20">
        {/* Hero Section */}
        <div 
          className="relative h-64 bg-cover bg-center" 
          style={{ backgroundImage: "url('/assets/images/solutions-cta-bg.webp')" }}
        >
          <div className="absolute inset-0 bg-blue-900/70" />
          <div className="container relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 text-white">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
            <p className="mt-4 text-lg text-gray-200">
              {description}
            </p>
          </div>
        </div>
        
        <div className="container relative z-10 mx-auto max-w-7xl -translate-y-16 px-4">
          <div className="rounded-xl bg-white p-6 shadow-md md:p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              
              {/* --- Sidebar (Column 1) --- */}
              <div className="lg:col-span-1">
                <ProductSidebar
                  brands={allBrands}
                  selectedBrands={selectedBrands}
                  onBrandChange={handleBrandChange}
                  inStockOnly={inStockOnly}
                  onStockChange={handleStockChange}
                  minPrice={minPrice}
                  onMinPriceChange={handleMinPriceChange}
                  maxPrice={maxPrice}
                  onMaxPriceChange={handleMaxPriceChange}
                />
              </div>
              
              {/* --- Product Grid (Column 2) --- */}
              <div className="lg:col-span-3">
                {/* 6. Add Loading/Error/Empty states */}
                {loading ? (
                  <div className="flex h-64 items-center justify-center rounded-md border border-dashed bg-gray-50">
                    <p className="text-lg text-gray-500">Loading products...</p>
                  </div>
                ) : error ? (
                   <div className="flex h-64 items-center justify-center rounded-md border border-dashed bg-red-50">
                    <p className="text-lg text-red-600">{error}</p>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((product) => (
                      // 7. Use ._id from MongoDB
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-md border border-dashed bg-gray-50">
                    <p className="text-lg text-gray-500">No products match your filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};