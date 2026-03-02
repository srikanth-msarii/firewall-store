import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/public/Home';
import { Products } from './pages/public/Products';
import { ProductDetail } from './pages/public/ProductDetail';
import { Contact } from './pages/public/Contact';
import { Inquiry } from './pages/public/Inquiry';
import { Promotions } from './pages/public/Promotions';
import { NotFound } from './pages/public/NotFound';
import { ComparePage } from './pages/public/ComparePage';
import { AboutPage } from './pages/public/AboutPage';
import { WarrantyPage } from './pages/public/WarrantyPage';
import { TermsPage } from './pages/public/TermsPage';
import { PublicLayout } from './layouts/PublicLayout';
import { ScrollToTop } from './components/shared/ScrollToTop';

// 1. Import new admin components
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './layouts/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminQuotes } from './pages/admin/AdminQuotes';
import { AdminInquiries } from './pages/admin/AdminInquiries';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminBrands } from './pages/admin/AdminBrands';
// 2. Import the AdminPromotions page
import { AdminPromotions } from './pages/admin/AdminPromotions';
import { ForgotPassword } from './pages/admin/ForgotPassword';
import { ResetPassword } from './pages/admin/ResetPassword';
import { AdminUsers } from './pages/admin/AdminUsers';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* === Public Website Routes (with Header/Footer) === */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:productId" element={<ProductDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="inquiry" element={<Inquiry />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="warranty" element={<WarrantyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* === Admin Portal Routes (No Header/Footer) === */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        {/* 2. Add new protected admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="quotes" element={<AdminQuotes />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="users" element={<AdminUsers />} />
          {/* 3. Add the new route for promotions */}
          <Route path="promotions" element={<AdminPromotions />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;