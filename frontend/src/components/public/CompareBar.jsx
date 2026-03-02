import React from 'react';
import { useCompare } from '../../context/CompareContext';
import { Link, useLocation } from 'react-router-dom';
import { X, Layers, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const CompareBar = () => {
  const { compareList, removeFromCompare, clearCompare, maxCompare } = useCompare();
  const location = useLocation();

  const shouldShowBar = compareList.length > 0 && location.pathname !== '/compare';

  return (
    <AnimatePresence>
      {shouldShowBar && (
        <motion.div
          className="fixed bottom-0 left-0 z-50 w-full"
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex flex-col rounded-t-lg bg-blue-900 p-4 text-white shadow-2xl lg:flex-row lg:items-center lg:justify-between">
              
              {/* Left Side: Title & Product Chips */}
              <div className="flex-1 lg:pr-4">
                <div className="flex items-center space-x-3">
                  <Layers className="h-6 w-6 text-blue-300" />
                  <h4 className="text-lg font-semibold">
                    Compare Products ({compareList.length}/{maxCompare})
                  </h4>
                </div>
                
                <div className="mt-3 flex h-10 flex-nowrap items-center gap-2 overflow-x-auto overflow-y-hidden">
                  <AnimatePresence>
                    {compareList.map((product) => (
                      <motion.div
                        key={product._id} // FIX: Use _id
                        className="flex flex-shrink-0 items-center space-x-2 rounded-full bg-blue-700 py-1 pl-1 pr-3"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={product.image}
                          alt={product.model}
                          className="h-6 w-6 rounded-full object-contain bg-white"
                        />
                        <span className="text-sm font-medium">{product.model}</span>
                        <button
                          onClick={() => removeFromCompare(product._id)} // FIX: Use _id
                          className="rounded-full text-blue-200 hover:bg-black/20 hover:text-white"
                          title={`Remove ${product.model}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Side: Action Buttons */}
              <div className="mt-4 flex flex-shrink-0 space-x-3 border-t border-blue-700 pt-4 lg:mt-0 lg:border-t-0 lg:pt-0">
                <Link
                  to="/compare"
                  className="flex-1 rounded-md bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600 lg:flex-auto"
                >
                  Compare Now
                </Link>
                <button
                  onClick={clearCompare}
                  className="flex items-center rounded-md bg-gray-600 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-700"
                  title="Clear all items"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};