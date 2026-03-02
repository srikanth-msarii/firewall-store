import React from 'react';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
// 1. Import `useCompare` (already present)
import { useCompare } from '../../context/CompareContext';

export const ProductCard = ({ product }) => {
  const { handleOpenQuoteModal } = useOutletContext();
  
  // --- THIS IS THE FIX ---
  // 2. Get `compareList` (the data) not just the functions
  const { addToCompare, removeFromCompare, compareList } = useCompare();

  const { _id, name, model, image, price, stock } = product;
  
  // 3. Check against the *live* compareList array
  // This will re-calculate every time the context updates
  const isProductCompared = compareList.some(p => p._id === _id);
  // --- END OF FIX ---

  const placeholderImg = `https://placehold.co/300x300/e0e7ff/3741b1?text=${model}`;

  const handleQuoteClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    handleOpenQuoteModal(product);
  };

  const handleCompareChange = (e) => {
    e.stopPropagation(); 
    if (e.target.checked) {
      addToCompare(product);
    } else {
      removeFromCompare(_id);
    }
  };

  return (
    <div className="group relative flex w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-xl">
      
      <div 
        className="absolute top-2 right-2 z-10 flex items-center rounded-full bg-black/50 p-1.5 pr-2.5 transition-all hover:bg-blue-600"
        onClick={(e) => e.stopPropagation()} 
      >
        <input
          type="checkbox"
          id={`compare-${_id}`}
          // This `checked` prop is now reactive
          checked={isProductCompared}
          onChange={handleCompareChange}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label 
          htmlFor={`compare-${_id}`} 
          className="ml-1.5 cursor-pointer text-xs font-medium text-white"
        >
          Compare
        </label>
      </div>

      <Link to={`/products/${_id}`} className="block">
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={image || placeholderImg}
            alt={name}
            className="h-full w-full object-contain object-center p-4 transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.target.src = placeholderImg; }}
          />
        </div>
        <div className="border-t border-gray-200 p-4">
          <p className="truncate text-sm font-medium text-blue-600">{name}</p>
          <h3 className="mt-1 text-base font-semibold text-gray-900">{model}</h3>
          
          <div className="mt-2 flex items-center justify-between">
            {stock > 0 ? (
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                In Stock
              </span>
            ) : (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                Out of Stock
              </span>
            )}
            
            {price ? (
              <p className="text-lg font-bold text-gray-900">{price}</p>
            ) : (
              <p className="text-sm font-semibold text-blue-600">On Request</p>
            )}
          </div>
        </div>
      </Link>
      
      <div className="p-4 pt-0">
        <button
          onClick={handleQuoteClick}
          className="w-full rounded-md border border-blue-600 bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition-all
                     hover:bg-blue-600 hover:text-white"
        >
          Get a Quote
        </button>
      </div>
    </div>
  );
};