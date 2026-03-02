import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const CategoryBrandFormModal = ({ item, type, onClose, onSave, service }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(item);
  const itemType = type || 'Item'; // 'Category' or 'Brand'

  useEffect(() => {
    if (isEditing) {
      setName(item.name);
    } else {
      setName('');
    }
    setError('');
  }, [item, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError(`${itemType} name is required`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await service.update(item._id, { name });
      } else {
        await service.create({ name });
      }
      onSave(); // Notify parent to refresh
    } catch (err) {
      const serverError = err.response?.data?.message || `Failed to save ${itemType}.`;
      setError(serverError);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? `Edit ${itemType}` : `Add New ${itemType}`}
        </h2>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`${itemType} Name (e.g., ${type === 'Brand' ? 'Cisco' : 'Routers'})`}
            className="w-full p-3 border rounded-md"
            required
          />
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (isEditing ? `Update ${itemType}` : `Add ${itemType}`)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};