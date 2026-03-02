import React, { useMemo } from 'react';
import { useCompare } from '../../context/CompareContext';
import { Link } from 'react-router-dom';
import { Check, X, ArrowRight, Layers, Plus } from 'lucide-react';

export const ComparePage = () => {
  const { compareList, removeFromCompare, maxCompare } = useCompare();

  // Get all unique spec names from all products
  const allSpecNames = useMemo(() => {
    const specSet = new Set();
    specSet.add("Price");
    specSet.add("Stock");
    compareList.forEach(product => {
      product.specs.forEach(spec => {
        specSet.add(spec.name);
      });
    });
    return Array.from(specSet);
  }, [compareList]);

  // Helper to get a product's spec value by name
  const getSpecValue = (product, specName) => {
    if (specName === "Price") return <span className="text-lg font-semibold text-gray-900">{product.price || "On Request"}</span>;
    if (specName === "Stock") {
      return product.stock > 0 ? (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          In Stock
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
          Out of Stock
        </span>
      );
    }
    
    const spec = product.specs.find(s => s.name === specName);
    return spec ? spec.value : <span className="text-gray-400">N/A</span>;
  };

  return (
    <>
      <title>Compare Products | Trace Networks</title>
      
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center" 
        style={{ backgroundImage: "url('/assets/images/solutions-cta-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="container relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 text-white">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Compare Products</h1>
          <p className="mt-4 text-lg text-gray-200">
            Compare specifications side-by-side ({compareList.length}/{maxCompare} items).
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-16">
        {compareList.length === 0 ? (
          <div className="flex flex-col items-center text-center">
            <Layers className="h-16 w-16 text-blue-200" />
            <h2 className="mt-4 text-2xl font-semibold">Your compare list is empty.</h2>
            <p className="mt-4 text-gray-600">Add products to compare their features.</p>
            <Link 
              to="/products"
              className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div>
            {/* Mobile-only scroll hint */}
            <div className="mb-2 flex items-center justify-end text-sm text-gray-500 lg:hidden">
              Scroll to see more
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <div 
                className="flex" 
                style={{ minWidth: `${12 + (compareList.length + (compareList.length < maxCompare ? 1 : 0)) * 16}rem` }}
              >
                
                {/* --- 1. Features Column (Sticky Left) --- */}
                <div className="sticky left-0 z-20 w-48 flex-shrink-0 border-r border-gray-200 bg-white shadow-lg">
                  {/* Header Cell */}
                  <div className="sticky top-0 z-10 flex h-52 items-end justify-start border-b border-gray-200 bg-gray-50 p-4">
                    <h3 className="text-lg font-semibold text-gray-900">Feature</h3>
                  </div>
                  {/* Feature Name Rows */}
                  {allSpecNames.map(name => (
                    <div 
                      key={name} 
                      className="flex h-20 items-center border-b border-gray-100 p-4 text-sm font-medium text-gray-700"
                    >
                      {name}
                    </div>
                  ))}
                  <div className="h-20 border-b border-gray-100"></div>
                </div>

                {/* --- 2. Product Columns (Scrollable) --- */}
                {compareList.map(product => (
                  <div 
                    key={product._id} // FIX: Use _id
                    className="relative w-64 flex-shrink-0 border-r border-gray-200"
                  >
                    {/* Sticky Product Header */}
                    <div className="sticky top-0 z-10 flex h-52 flex-col justify-between border-b border-gray-200 bg-white p-4">
                      <button
                        onClick={() => removeFromCompare(product._id)} // FIX: Use _id
                        className="absolute top-2 right-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                        title="Remove"
                      >
                        <X size={18} />
                      </button>
                      <Link to={`/products/${product._id}`} className="flex flex-col items-center text-center"> {/* FIX: Use _id */}
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-24 w-24 object-contain" 
                        />
                        <span className="mt-2 block text-base font-bold text-blue-600 hover:underline">{product.model}</span>
                        <span className="block text-xs text-gray-500">{product.name}</span>
                      </Link>
                    </div>
                    {/* Product Spec Values */}
                    {allSpecNames.map(name => (
                      <div 
                        key={name} 
                        className="flex h-20 items-center justify-center border-b border-gray-100 p-4 text-center text-sm text-gray-600"
                      >
                        {getSpecValue(product, name)}
                      </div>
                    ))}
                    <div className="h-20 border-b border-gray-100"></div>
                  </div>
                ))}

                {/* --- 3. "Add Product" Column --- */}
                {compareList.length < maxCompare && (
                  <div 
                    className="w-64 flex-shrink-0 border-r border-gray-200"
                  >
                    {/* Sticky "Add" Header */}
                    <div className="sticky top-0 z-10 flex h-52 flex-col items-center justify-center border-b border-gray-200 bg-gray-50 p-4">
                      <Link 
                        to="/products" 
                        className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed
                                   border-gray-400 text-gray-400 transition-colors
                                   hover:border-blue-500 hover:text-blue-500 hover:bg-white"
                      >
                        <Plus size={48} />
                      </Link>
                      <span className="mt-2 block text-base font-bold text-blue-600">
                        Add Product
                      </span>
                    </div>
                    {/* Empty Spec Cells for alignment */}
                    {allSpecNames.map(name => (
                      <div 
                        key={name} 
                        className="flex h-20 items-center justify-center border-b border-gray-100 p-4"
                      >
                        <span className="text-gray-300">-</span>
                      </div>
                    ))}
                    <div className="h-20 border-b border-gray-100"></div>
                  </div>
                )}
                
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};