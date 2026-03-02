import React, { createContext, useState, useContext, useEffect } from 'react';

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

// Helper function to get initial state from localStorage
const getInitialState = () => {
  try {
    const item = window.localStorage.getItem('compareList');
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return [];
  }
};

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(getInitialState);
  const [toast, setToast] = useState(null);
  const MAX_COMPARE = 4;

  // Save to localStorage whenever compareList changes
  useEffect(() => {
    try {
      window.localStorage.setItem('compareList', JSON.stringify(compareList));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [compareList]);

  // Auto-clear the toast message
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addToCompare = (product) => {
    if (compareList.length >= MAX_COMPARE) {
      setToast(`You can only compare up to ${MAX_COMPARE} products.`);
      return;
    }
    
    // --- THIS IS THE FIX ---
    // We must check using `_id`
    if (!compareList.find(p => p._id === product._id)) {
      // We only store the serializable data
      const productToAdd = {
        _id: product._id, // Use _id
        name: product.name,
        model: product.model,
        image: product.image,
        price: product.price,
        stock: product.stock,
        specs: product.specs
      };
      setCompareList(prevList => [...prevList, productToAdd]);
    }
  };

  const removeFromCompare = (productId) => {
    // --- THIS IS THE FIX ---
    // We must filter using `_id`
    setCompareList(prevList => prevList.filter(p => p._id !== productId));
  };

  const isCompared = (productId) => {
    // --- THIS IS THE FIX ---
    // We must find using `_id`
    return !!compareList.find(p => p._id === productId);
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const value = {
    compareList, // We will now pass the *data*
    addToCompare,
    removeFromCompare,
    isCompared, // This function is now correct
    clearCompare,
    maxCompare: MAX_COMPARE,
    toast
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
};