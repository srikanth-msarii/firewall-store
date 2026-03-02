import axios from 'axios';

// Set up the base URL for your backend

// const API_URL = 'http://localhost:8080/api';
const API_URL = 'https://firewall-store-66415620472.asia-east1.run.app/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
});

// --- Auth Token Interceptor ---
// This automatically adds the "Authorization: Bearer <token>" header
// to every request *if* a token exists in localStorage.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // This logic ensures JSON is default, but lets FormData override
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// === Auth Service ===
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  forgotPassword: (email) => api.post('/auth/forgotpassword', { email }),
  resetPassword: (token, password) => api.put(`/auth/resetpassword/${token}`, { password }),
};

// === Product Service ===
export const productService = {
  // Public
  getProducts: (params = {}) => api.get('/products', { params }), // e.g., { category: 'Switches', featured: true }
  getProductById: (id) => api.get(`/products/${id}`),

  // Admin (Protected)
  createProduct: (formData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateProduct: (id, formData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  bulkUpload: (formData) => api.post('/products/bulk-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// === Category Service ===
export const categoryService = {
  getCategories: () => api.get('/categories'),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

// === Brand Service ===
export const brandService = {
  getBrands: () => api.get('/brands'),
  createBrand: (brandData) => api.post('/brands', brandData),
  updateBrand: (id, brandData) => api.put(`/brands/${id}`, brandData),
  deleteBrand: (id) => api.delete(`/brands/${id}`),
};

// === Quote Service ===
export const quoteService = {
  submitQuote: (quoteData) => api.post('/quotes', quoteData),
  getQuotes: (params) => api.get('/quotes', { params }),
  updateQuoteStatus: (id, status) => api.put(`/quotes/${id}`, { status }),
  deleteQuote: (id) => api.delete(`/quotes/${id}`),
};

// === Inquiry Service ===
export const inquiryService = {
  // Public
  submitInquiry: (inquiryData) => api.post('/inquiries', inquiryData),

  // Admin (Protected)
  // 1. Now accepts params for page and search
  getInquiries: (params) => api.get('/inquiries', { params }),
  updateInquiryStatus: (id, status) => api.put(`/inquiries/${id}`, { status }),
  // 2. Add delete function
  deleteInquiry: (id) => api.delete(`/inquiries/${id}`),
};

// === NEW Promotion Service ===
export const promotionService = {
  // Public
  getPromotions: (params = {}) => api.get('/promotions', { params }), // e.g., { featured: true }

  // Admin (Protected)
  createPromotion: (formData) => api.post('/promotions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updatePromotion: (id, formData) => api.put(`/promotions/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deletePromotion: (id) => api.delete(`/promotions/${id}`),
};

// === User Service ===
export const userService = {
  getUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// This default export is for S3 (which we removed, but might add back)
export default api;