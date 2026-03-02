import React, { useState, useEffect } from 'react';
import { productService, categoryService, brandService } from '../../services/api';
import { ArrowLeft, UploadCloud, Plus, Trash2, FileText, Star, MessageSquare } from 'lucide-react';
import { FloatingLabelInput } from '../shared/FloatingLabelInput';
import { DropdownMenu } from '../shared/DropdownMenu';

// --- Sub-component for managing Specs ---
const ManageSpecs = ({ specs, setSpecs }) => {
  const addSpec = () => {
    setSpecs([...specs, { name: '', value: '' }]);
  };
  const removeSpec = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };
  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Specifications</h3>
      <div className="space-y-2">
        {specs.map((spec, index) => (
          <div key={index} className="flex gap-2">
            <input 
              value={spec.name} 
              onChange={(e) => handleSpecChange(index, 'name', e.target.value)}
              placeholder="Spec Name (e.g., Ports)" 
              className="p-2 border rounded-md flex-1 text-sm" 
            />
            <input 
              value={spec.value} 
              onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
              placeholder="Spec Value (e.g., 24 x 1G)" 
              className="p-2 border rounded-md flex-1 text-sm" 
            />
            <button type="button" onClick={() => removeSpec(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      <button 
        type="button" 
        onClick={addSpec}
        className="mt-4 inline-flex items-center rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300"
      >
        <Plus size={16} className="mr-1" /> Add Spec
      </button>
    </div>
  );
};

// --- Sub-component for managing Questions ---
const ManageQuestions = ({ questions, setQuestions }) => {
  const addQuestion = () => {
    setQuestions([...questions, { author: 'Admin', question: '', answer: '', date: new Date().toISOString() }]);
  };
  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Manage Questions</h3>
      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={index} className="border-b pb-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Question {index + 1}</label>
              <button type="button" onClick={() => removeQuestion(index)} className="p-1 text-red-500 hover:bg-red-50 rounded-md">
                <Trash2 size={16} />
              </button>
            </div>
            <input
              value={q.author}
              onChange={(e) => handleQuestionChange(index, 'author', e.target.value)}
              placeholder="Author (e.g., Mike S.)"
              className="w-full p-2 border rounded-md mt-2 text-sm"
            />
            <textarea
              value={q.question}
              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
              placeholder="Question..."
              className="w-full p-2 border rounded-md mt-2"
              rows={2}
            />
            <textarea
              value={q.answer || ''}
              onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
              placeholder="Answer..."
              className="w-full p-2 border rounded-md mt-2"
              rows={2}
            />
          </div>
        ))}
      </div>
      <button 
        type="button" 
        onClick={addQuestion}
        className="mt-4 inline-flex items-center rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300"
      >
        <Plus size={16} className="mr-1" /> Add Question
      </button>
    </div>
  );
};

// --- Sub-component for managing Reviews ---
const ManageReviews = ({ reviews, setReviews }) => {
  const addReview = () => {
    setReviews([...reviews, { author: 'Admin', rating: 5, title: '', body: '', date: new Date().toISOString() }]);
  };
  const removeReview = (index) => {
    setReviews(reviews.filter((_, i) => i !== index));
  };
  const handleReviewChange = (index, field, value) => {
    const newReviews = [...reviews];
    newReviews[index][field] = value;
    setReviews(newReviews);
  };
  
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Manage Reviews</h3>
      <div className="space-y-4">
        {reviews.map((r, index) => (
          <div key={index} className="border-b pb-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Review {index + 1}</label>
              <button type="button" onClick={() => removeReview(index)} className="p-1 text-red-500 hover:bg-red-50 rounded-md">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex gap-4 mt-2">
              <input
                value={r.author}
                onChange={(e) => handleReviewChange(index, 'author', e.target.value)}
                placeholder="Author (e.g., John D.)"
                className="w-1/2 p-2 border rounded-md text-sm"
              />
              <select
                value={r.rating}
                onChange={(e) => handleReviewChange(index, 'rating', Number(e.target.value))}
                className="w-1/2 p-2 border rounded-md bg-white text-sm"
              >
                <option value={5}>5 Stars</option>
                <option value={4.5}>4.5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3.5}>3.5 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </div>
            <input
              value={r.title}
              onChange={(e) => handleReviewChange(index, 'title', e.target.value)}
              placeholder="Review Title"
              className="w-full p-2 border rounded-md mt-2"
            />
            <textarea
              value={r.body}
              onChange={(e) => handleReviewChange(index, 'body', e.target.value)}
              placeholder="Review Body..."
              className="w-full p-2 border rounded-md mt-2"
              rows={3}
            />
          </div>
        ))}
      </div>
      <button 
        type="button" 
        onClick={addReview}
        className="mt-4 inline-flex items-center rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300"
      >
        <Plus size={16} className="mr-1" /> Add Review
      </button>
    </div>
  );
};

// --- NEW File Upload Component (Fixes PDF preview) ---
const FileUploadBox = ({ label, file, setFile, existingUrl, setPreview, preview, accept }) => {
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file); // Store the File object
      if (accept.includes('image')) {
        setPreview(URL.createObjectURL(file)); // Set blob URL for image preview
      } else {
        setPreview(file.name); // Set filename for PDF preview
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  const getPreview = () => {
    const url = preview || existingUrl;
    const isImage = accept.includes('image');
    
    if (isImage) {
      return url ? (
        <img className="h-24 w-24 rounded-md object-contain border" src={url} alt="Preview" />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-md border border-dashed text-gray-400">
          <UploadCloud size={32} />
        </div>
      );
    } else { // Handle non-image (PDF)
      let displayText = "No file";
      if (file) { // New file selected
        displayText = file.name;
      } else if (existingUrl) { // Old file exists
        displayText = existingUrl.split('/').pop();
      }

      return (
        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-md border border-dashed text-gray-400">
          <FileText size={32} />
          {url && (
            <a 
              href={file ? "#" : existingUrl} // Can't link to blob preview
              target="_blank" 
              rel="noopener noreferrer" 
              title={displayText}
              className="mt-1 text-xs text-center text-blue-600 overflow-hidden text-ellipsis px-1 hover:underline"
            >
              {displayText}
            </a>
          )}
        </div>
      );
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-2 flex items-center space-x-6">
        <div className="flex-shrink-0">
          {getPreview()}
        </div>
        <div className="flex flex-col">
          <label
            htmlFor={`file-upload-${label}`}
            className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none hover:text-blue-500"
          >
            <span>{file ? 'Change file' : 'Upload file'}</span>
            <input id={`file-upload-${label}`} type="file" className="sr-only" onChange={handleFileChange} accept={accept} />
          </label>
          {file && (
            <button
              type="button"
              onClick={clearFile}
              className="mt-2 text-xs text-red-500 hover:text-red-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


// --- Main Product Form Component ---
export const ProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '', model: '', brand: '', category: '', price: '',
    stock: 0, featured: false, shortDescription: '', longDescription: '',
    image: '', images: [], specImage: '', datasheetUrl: '',
    specs: [], reviews: [], questions: [],
  });
  
  const [allCategories, setAllCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // File states
  const [datasheetFile, setDatasheetFile] = useState(null);
  const [specImageFile, setSpecImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]); // Array of File objects
  
  // Preview states
  const [specImagePreview, setSpecImagePreview] = useState(null);
  const [datasheetPreview, setDatasheetPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // Effect to load categories and brands
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          categoryService.getCategories(),
          brandService.getBrands()
        ]);
        setAllCategories(catRes.data.map(c => c.name));
        setAllBrands(brandRes.data.map(b => b.name));
      } catch (err) {
        console.error("Failed to load dropdown data", err);
        setError("Failed to load categories and brands.");
      }
    };
    loadDropdownData();
  }, []);

  // Effect to populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({ ...product }); // Load all data
      setGalleryPreviews(product.images || []); // Set existing gallery
    } else {
      // Reset form for "Create New"
      setFormData({
        name: '', model: '', brand: '', category: '', price: '',
        stock: 0, featured: false, shortDescription: '', longDescription: '',
        image: '', images: [], specImage: '', datasheetUrl: '',
        specs: [], reviews: [], questions: [],
      });
      setGalleryPreviews([]);
    }
    // Clear all file states
    setDatasheetFile(null);
    setSpecImageFile(null);
    setGalleryFiles([]);
    setSpecImagePreview(null);
    setDatasheetPreview(null);
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleDropdownChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecsChange = (newSpecs) => {
    setFormData(prev => ({ ...prev, specs: newSpecs }));
  };
  
  const handleQuestionsChange = (newQuestions) => {
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };
  
  const handleReviewsChange = (newReviews) => {
    setFormData(prev => ({ ...prev, reviews: newReviews }));
  };

  // --- UPDATED Gallery File Handler ---
  const handleGalleryFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setGalleryFiles(files); // Set the File objects
    
    const newImagePreviews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(newImagePreviews); // Set blob: previews
    
    // Set main image preview to first file
    setFormData(prev => ({
      ...prev,
      image: newImagePreviews[0] || '',
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    
    // 1. Append all *non-file* fields from formData
    Object.keys(formData).forEach(key => {
      // Exclude file URLs/previews
      if (['image', 'images', 'specImage', 'datasheetUrl'].includes(key)) {
        return;
      }
      // Stringify arrays/objects
      if (Array.isArray(formData[key])) {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    // 2. Append files *only if* they have been changed
    if (galleryFiles.length > 0) {
      galleryFiles.forEach(file => {
        data.append('images', file); // Append each file to 'images'
      });
    }
    if (specImageFile) {
      data.append('specImage', specImageFile);
    }
    if (datasheetFile) {
      data.append('datasheet', datasheetFile);
    }

    try {
      if (product) {
        await productService.updateProduct(product._id, data);
      } else {
        await productService.createProduct(data);
      }
      onSave(); // Notify parent to close and refresh
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={onClose}
        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Products
      </button>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {product ? 'Edit Product' : 'Create New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        
        {/* --- Text Fields (Using FloatingLabelInput) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FloatingLabelInput name="name" value={formData.name} onChange={handleChange} label="Product Name *" />
          <FloatingLabelInput name="model" value={formData.model} onChange={handleChange} label="Model *" />
          
          <DropdownMenu 
            label="Brand *"
            options={allBrands}
            selected={formData.brand}
            onChange={(val) => handleDropdownChange('brand', val)}
          />
          <DropdownMenu 
            label="Category *"
            options={allCategories}
            selected={formData.category}
            onChange={(val) => handleDropdownChange('category', val)}
          />
          
          <FloatingLabelInput name="price" value={formData.price} onChange={handleChange} label="Price (e.g., $2,450)" />
          <FloatingLabelInput name="stock" value={formData.stock} onChange={handleChange} label="Stock Quantity *" type="number" />
        </div>
        
        <FloatingLabelInput name="shortDescription" value={formData.shortDescription} onChange={handleChange} label="Short Description" as="textarea" rows={3} />
        <FloatingLabelInput name="longDescription" value={formData.longDescription} onChange={handleChange} label="Long Description" as="textarea" rows={6} />
        
        <div className="flex items-center">
          <input name="featured" id="featured" type="checkbox" checked={formData.featured} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
          <label htmlFor="featured" className="ml-2 text-sm text-gray-700">Make this a "Featured Product"</label>
        </div>

        {/* --- Image Uploads --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg">
          {/* Gallery Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gallery Images (Max 3)</label>
            <p className="text-xs text-gray-500 mb-2">The first image will be the main product image.</p>
            <input 
              id="gallery-upload"
              type="file" 
              className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
              onChange={handleGalleryFileChange}
              accept="image/png, image/jpeg, image/webp"
              multiple
            />
            {/* Gallery Previews */}
            <div className="mt-4 flex space-x-2">
              {galleryPreviews.map((imgSrc, idx) => (
                <img key={idx} src={imgSrc} alt={`Preview ${idx+1}`} className="h-20 w-20 rounded-md object-contain border" />
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Spec Image Upload */}
            <FileUploadBox 
              label="Specifications Image" 
              file={specImageFile}
              setFile={setSpecImageFile}
              existingUrl={formData.specImage}
              preview={specImagePreview}
              setPreview={setSpecImagePreview}
              accept="image/png, image/jpeg, image/webp"
              fileTypeLabel="Image"
            />
            {/* Datasheet Upload */}
            <FileUploadBox 
              label="Datasheet (PDF)"
              file={datasheetFile}
              setFile={setDatasheetFile}
              existingUrl={formData.datasheetUrl}
              preview={datasheetPreview}
              setPreview={setDatasheetPreview}
              accept="application/pdf"
              fileTypeLabel="PDF"
            />
          </div>
        </div>

        {/* --- Dynamic Specs --- */}
        <ManageSpecs specs={formData.specs} setSpecs={handleSpecsChange} />

        {/* --- Manage Questions & Reviews --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ManageQuestions questions={formData.questions} setQuestions={handleQuestionsChange} />
          <ManageReviews reviews={formData.reviews} setReviews={handleReviewsChange} />
        </div>

        {error && <div className="text-center text-red-500">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-green-600 px-6 py-3 text-lg font-semibold text-white shadow-md
                     transition-transform hover:scale-[1.02] hover:bg-green-700
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </button>
      </form>
    </div>
  );
};