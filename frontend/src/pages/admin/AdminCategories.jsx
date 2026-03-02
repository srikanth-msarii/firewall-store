import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { CategoryBrandFormModal } from '../../components/admin/CategoryBrandFormModal';
import { DeleteConfirmationModal } from '../../components/admin/DeleteConfirmationModal';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await categoryService.getCategories();
      setCategories(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (item = null) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSave = () => {
    handleCloseModal();
    fetchCategories(); // Refresh list
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteCategory(itemToDelete._id);
      fetchCategories();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      setError('Failed to delete category.');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
        <button
          onClick={() => handleOpenModal(null)}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          Add New Category
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Category Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Date Added</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(cat)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => confirmDelete(cat)}
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
      )}

      {/* Render the modal */}
      {isModalOpen && (
        <CategoryBrandFormModal
          item={selectedItem}
          type="Category"
          onClose={handleCloseModal}
          onSave={handleSave}
          service={{
            create: categoryService.createCategory,
            update: categoryService.updateCategory
          }}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        itemName={itemToDelete?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
};