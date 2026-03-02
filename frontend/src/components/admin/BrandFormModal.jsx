import React, { useState, useEffect } from 'react';
import { brandService } from '../../services/api';
import { X, UploadCloud } from 'lucide-react';

export const BrandFormModal = ({ brand, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(brand);

  useEffect(() => {
    if (isEditing) {
      setName(brand.name);
      setLogoPreview(brand.logoUrl);
    } else {
      setName('');
      setLogoPreview('');
    }
    setLogoFile(null);
    setError('');
  }, [brand, isEditing]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError('Brand name is required');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    try {
      if (isEditing) {
        await brandService.updateBrand(brand._id, formData);
      } else {
        await brandService.createBrand(formData);
      }
      onSave(); // Notify parent to refresh
    } catch (err) {
      setError('Failed to save brand. It may already exist.');
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
          {isEditing ? 'Edit Brand' : 'Add New Brand'}
        </h2>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Brand Name (e.g., Cisco)"
            className="w-full p-3 border rounded-md"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">Brand Logo</label>
            <div className="mt-2 flex items-center space-x-6">
              <div className="flex-shrink-0">
                {logoPreview ? (
                  <img className="h-20 w-20 rounded-md object-contain border" src={logoPreview} alt="Logo Preview" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed text-gray-400">
                    <UploadCloud size={32} />
                  </div>
                )}
              </div>
              <label
                htmlFor="logo-upload"
                className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500"
              >
                <span>{logoFile ? 'File selected!' : 'Upload file'}</span>
                <input id="logo-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/svg+xml" />
              </label>
            </div>
          </div>
          
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
              {loading ? 'Saving...' : (isEditing ? 'Update Brand' : 'Add Brand')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};