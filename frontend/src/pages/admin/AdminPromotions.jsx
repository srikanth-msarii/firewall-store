import React, { useState, useEffect } from 'react';
import { promotionService } from '../../services/api';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { PromotionFormModal } from '../../components/admin/PromotionFormModal';
import { DeleteConfirmationModal } from '../../components/admin/DeleteConfirmationModal';

export const AdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const { data } = await promotionService.getPromotions();
      setPromotions(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch promotions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleOpenModal = (promo = null) => {
    setSelectedPromo(promo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPromo(null);
  };

  const handleSave = () => {
    handleCloseModal();
    fetchPromotions(); // Refresh list
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
      await promotionService.deletePromotion(itemToDelete._id);
      fetchPromotions();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      setError('Failed to delete promotion.');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Promotions</h1>
        <button
          onClick={() => handleOpenModal(null)}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          Add New Promotion
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {loading ? (
        <p>Loading promotions...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Deal Text</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Featured</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {promotions.map((promo) => (
                <tr key={promo._id}>
                  <td className="px-6 py-4">
                    <img src={promo.image} alt={promo.title} className="h-12 w-20 object-contain" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{promo.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{promo.dealText}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {promo.isFeatured ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : (
                      <XCircle size={18} className="text-gray-400" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(promo)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => confirmDelete(promo)}
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

      {isModalOpen && (
        <PromotionFormModal
          promo={selectedPromo}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Promotion"
        itemName={itemToDelete?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
};