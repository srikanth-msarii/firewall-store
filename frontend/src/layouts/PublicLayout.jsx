import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
// 1. Import motion, AnimatePresence, and an icon for the alert
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

// Import our real components
import { Header } from '../components/public/Header';
import { Footer } from '../components/public/Footer';
import { QuoteModal } from '../components/shared/QuoteModal';
// 2. Import the Compare Provider, Bar, and hook
import { CompareProvider, useCompare } from '../context/CompareContext';
import { CompareBar } from '../components/public/CompareBar';
import { WhatsAppFloat } from '../components/public/WhatsAppFloat';

// 3. Create a new component to render the layout and toasts
// This is necessary so it can be *inside* the CompareProvider
const LayoutRenderer = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState(null);
  const [showQuoteSuccess, setShowQuoteSuccess] = useState(false);
  
  // 4. Get the compare toast message from the context
  const { toast: compareToast } = useCompare();

  const handleOpenQuoteModal = (product = null) => {
    setQuoteProduct(product);
    setIsQuoteModalOpen(true);
  };

  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  const handleSubmitQuoteSuccess = () => {
    setIsQuoteModalOpen(false); 
    setTimeout(() => setQuoteProduct(null), 300); 

    setShowQuoteSuccess(true);
    setTimeout(() => setShowQuoteSuccess(false), 3000);
  };

  return (
    <div className="flex min-h-screen flex-col font-sans text-gray-900">
      
      {/* 5. Render the "pretty alert" for compare errors */}
      <AnimatePresence>
        {compareToast && (
          <motion.div
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] flex items-center space-x-2 rounded-full bg-red-600 px-4 py-2 text-white shadow-lg"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
          >
            <AlertCircle size={16} />
            <span className="text-sm font-medium">{compareToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 6. Render the success toast for quotes */}
      <AnimatePresence>
        {showQuoteSuccess && (
          <motion.div
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] flex items-center space-x-2 rounded-full bg-green-600 px-4 py-2 text-white shadow-lg"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
          >
            <CheckCircle size={16} />
            <span className="text-sm font-medium">Quote request submitted!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Header onQuoteClick={handleOpenQuoteModal} />

      <main className="flex-1">
        <Outlet context={{ handleOpenQuoteModal }} />
      </main>

      <Footer />

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={handleCloseQuoteModal}
        onSubmitSuccess={handleSubmitQuoteSuccess}
        product={quoteProduct}
      />
      
      <CompareBar />
      <WhatsAppFloat />
    </div>
  );
};

// 7. The main PublicLayout now just sets up the Provider
export const PublicLayout = () => {
  return (
    <CompareProvider>
      <LayoutRenderer />
    </CompareProvider>
  );
};