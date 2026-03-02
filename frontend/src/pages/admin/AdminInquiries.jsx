import React, { useState, useEffect, useCallback, useRef } from 'react'; // 1. Import useRef
import { useSearchParams } from 'react-router-dom';
import { inquiryService } from '../../services/api';
import { Pagination } from '../../components/admin/Pagination';
import { Search, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { DeleteConfirmationModal } from '../../components/admin/DeleteConfirmationModal';

// Use a hook for debouncing the search input
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export const InquiryCard = ({ inquiry, onStatusChange, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-lg bg-white shadow-md transition-all hover:shadow-lg border border-gray-100">
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-gray-500">{new Date(inquiry.createdAt).toLocaleString()}</p>
              {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{inquiry.firstName} {inquiry.lastName}</h3>
            <p className="text-sm text-gray-600">{inquiry.company}</p>
          </div>

          <div className="flex flex-col items-end space-y-2" onClick={(e) => e.stopPropagation()}>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold
              ${inquiry.status === 'New' ? 'bg-blue-100 text-blue-800' :
                inquiry.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                  inquiry.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
              }`}
            >
              {inquiry.status}
            </span>
            <div className="flex items-center space-x-2">
              <select
                value={inquiry.status}
                onChange={(e) => onStatusChange(inquiry._id, e.target.value)}
                className="rounded-md border-gray-300 text-sm py-1"
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Resolved</option>
                <option>Archived</option>
              </select>
              <button
                onClick={() => onDelete(inquiry._id)}
                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                title="Delete Inquiry"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {!isExpanded && (
          <div className="mt-2 text-sm text-gray-500 truncate">
            {inquiry.email} | {inquiry.productType}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 pt-0 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-medium text-gray-900">Contact Details</p>
              <p>{inquiry.email}</p>
              <p>{inquiry.phoneNumber}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Project Details</p>
              <p><span className="text-gray-500">Type:</span> {inquiry.productType}</p>
              <p><span className="text-gray-500">Budget:</span> {inquiry.budgetRange}</p>
              <p><span className="text-gray-500">Timeline:</span> {new Date(inquiry.expectedDeliveryTime).toLocaleDateString()}</p>
            </div>
            <div className="md:col-span-2">
              <p className="font-medium text-gray-900">Requirements</p>
              <p className="whitespace-pre-wrap">{inquiry.technicalRequirements}</p>
            </div>
            {inquiry.additionalInfo && (
              <div className="md:col-span-2">
                <p className="font-medium text-gray-900">Additional Notes</p>
                <p className="whitespace-pre-wrap">{inquiry.additionalInfo}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const currentPage = Number(searchParams.get('page')) || 1;

  // 2. Create a ref to track the initial mount
  const isInitialMount = useRef(true);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        search: debouncedSearchTerm,
      };
      const { data } = await inquiryService.getInquiries(params);

      if (data && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
        setTotalPages(data.totalPages);
      } else {
        setInquiries([]);
        setTotalPages(1);
      }
      setError('');
    } catch (err) {
      setError('Failed to fetch inquiries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Update URL when search term *changes* (but not on initial load)
  useEffect(() => {
    // 3. Check if this is the first render
    if (isInitialMount.current) {
      isInitialMount.current = false; // Set it to false for future renders
      return; // 4. Do not run on initial render
    }

    // 5. Now, this only runs when the user actually types
    const newParams = new URLSearchParams(searchParams);
    if (debouncedSearchTerm) {
      newParams.set('search', debouncedSearchTerm);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1'); // Reset to page 1 on new search
    setSearchParams(newParams, { replace: true });
  }, [debouncedSearchTerm, setSearchParams]); // Dependency is correct

  const handleStatusChange = async (id, newStatus) => {
    try {
      await inquiryService.updateInquiryStatus(id, newStatus);
      setInquiries(prev =>
        prev.map(i => i._id === id ? { ...i, status: newStatus } : i)
      );
    } catch (err) {
      alert('Failed to update status');
    }
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
      await inquiryService.deleteInquiry(itemToDelete._id);
      fetchInquiries();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      alert('Failed to delete inquiry');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Project Inquiries</h1>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-lg text-center">Loading inquiries...</div>
      ) : error ? (
        <div className="text-lg text-center text-red-500">{error}</div>
      ) : (
        <>
          {/* 6. Add a check for inquiries.length */}
          {inquiries.length > 0 ? (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <InquiryCard
                  key={inquiry._id}
                  inquiry={inquiry}
                  onStatusChange={handleStatusChange}
                  onDelete={() => confirmDelete(inquiry)}
                />
              ))}
            </div>
          ) : (
            // 7. Show a "No results" message
            <div className="flex h-64 items-center justify-center rounded-md border border-dashed bg-gray-50">
              <p className="text-lg text-gray-500">
                {searchTerm ? 'No inquiries match your search.' : 'No inquiries found.'}
              </p>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Inquiry"
        itemName={itemToDelete ? `Inquiry from ${itemToDelete.firstName} ${itemToDelete.lastName}` : ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};