import React, { useState, useEffect } from 'react';
import { promotionService } from '../../services/api';
import { X, UploadCloud } from 'lucide-react';

export const PromotionFormModal = ({ promo, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    model: '',
    description: '',
    dealText: '',
    link: '',
    isFeatured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(promo);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: promo.title,
        model: promo.model || '',
        description: promo.description,
        dealText: promo.dealText,
        link: promo.link,
        isFeatured: promo.isFeatured || false,
      });
      setImagePreview(promo.image);
    } else {
      setFormData({
        title: '', model: '', description: '',
        dealText: '', link: '', isFeatured: false,
      });
      setImagePreview('');
    }
    setImageFile(null);
    setError('');
  }, [promo, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (isEditing) {
        await promotionService.updatePromotion(promo._id, data);
      } else {
        await promotionService.createPromotion(data);
      }
      onSave(); // Notify parent to refresh
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save promotion.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Promotion' : 'Add New Promotion'}
        </h2>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title (e.g., Cisco Bundle)" className="w-full p-3 border rounded-md" required />
          <div className="grid grid-cols-2 gap-4">
            <input name="model" value={formData.model} onChange={handleChange} placeholder="Model (e.g., C9300-24T-A)" className="w-full p-3 border rounded-md" />
            <input name="dealText" value={formData.dealText} onChange={handleChange} placeholder="Deal Text (e.g., 15% OFF)" className="w-full p-3 border rounded-md" required />
          </div>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-3 border rounded-md" rows="3" required />
          <input name="link" value={formData.link} onChange={handleChange} placeholder="Link (e.g., /products/PRODUCT_ID)" className="w-full p-3 border rounded-md" required />
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Promotion Image (Required)</label>
            <div className="mt-2 flex items-center space-x-6">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <img className="h-24 w-24 rounded-md object-contain border" src={imagePreview} alt="Preview" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-md border border-dashed text-gray-400">
                    <UploadCloud size={32} />
                  </div>
                )}
              </div>
              <label htmlFor="promo-image-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500">
                <span>{imageFile ? 'File selected!' : 'Upload file'}</span>
                <input id="promo-image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
              </label>
            </div>
          </div>
          
          <div className="flex items-center">
            <input name="isFeatured" id="isFeatured" type="checkbox" checked={formData.isFeatured} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
            <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">Make this a "Featured Deal"</label>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-3 pt-4 border-t">
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
              {loading ? 'Saving...' : (isEditing ? 'Update Promotion' : 'Add Promotion')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};