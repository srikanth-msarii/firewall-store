import React, { useState, useEffect } from 'react';
import { productService } from '../../services/api';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DeleteConfirmationModal } from '../../components/admin/DeleteConfirmationModal';
import { ProductForm } from '../../components/admin/ProductForm';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await productService.getProducts();
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(productToDelete._id);
      fetchProducts(); // Refresh list after delete
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null); // Clear selection for a new product
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setSelectedProduct(null);
    fetchProducts(); // Refresh list after save
  };

  // Bulk Upload Logic
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkStats, setBulkStats] = useState(null);
  const [bulkError, setBulkError] = useState('');

  const handleBulkFileChange = (e) => {
    setBulkFile(e.target.files[0]);
    setBulkStats(null);
    setBulkError('');
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) {
      setBulkError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', bulkFile);

    setBulkLoading(true);
    setBulkError('');
    setBulkStats(null);

    try {
      const { data } = await productService.bulkUpload(formData);
      setBulkStats(data.stats);
      setBulkLoading(false);
      fetchProducts(); // Refresh product list
    } catch (err) {
      console.error(err);
      setBulkError(err.response?.data?.message || 'Upload failed');
      setBulkLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-lg">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  // Main View: List or Form
  if (showForm) {
    return (
      <ProductForm
        product={selectedProduct}
        onClose={handleFormClose}
        onSave={handleFormSave}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowBulkUpload(!showBulkUpload)}
            className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
          >
            {showBulkUpload ? 'Hide Bulk Upload' : 'Bulk Upload'}
          </button>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={18} className="mr-2" />
            Add New Product
          </button>
        </div>
      </div>

      {/* Bulk Upload Section */}
      {showBulkUpload && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Bulk Upload Products (CSV)</h2>
            <a href="/assets/sample_products.csv" download="sample_products.csv" className="text-sm text-blue-600 hover:underline">
              Download Sample CSV
            </a>
          </div>
          <form onSubmit={handleBulkUpload} className="flex items-center space-x-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleBulkFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <button
              type="submit"
              disabled={bulkLoading || !bulkFile}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {bulkLoading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
          {bulkError && <p className="mt-2 text-sm text-red-600">{bulkError}</p>}
          {bulkStats && (
            <div className="mt-4 flex space-x-6 text-sm">
              <span className="text-green-600 font-medium">Created: {bulkStats.created}</span>
              <span className="text-blue-600 font-medium">Updated: {bulkStats.updated}</span>
              <span className="text-red-600 font-medium">Errors: {bulkStats.errors}</span>
            </div>
          )}
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.model}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.brand}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => confirmDelete(product)}
                    className="ml-4 text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        itemName={productToDelete?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
};