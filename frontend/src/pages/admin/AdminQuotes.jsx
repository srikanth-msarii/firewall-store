import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { quoteService } from '../../services/api';
import { Pagination } from '../../components/admin/Pagination';
import { Search, Trash2 } from 'lucide-react';
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

export const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]); // Initial state is an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for pagination
  const [totalPages, setTotalPages] = useState(1);

  // State for URL params
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');

  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay
  const currentPage = Number(searchParams.get('page')) || 1;

  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        search: debouncedSearchTerm,
      };
      const { data } = await quoteService.getQuotes(params);
      console.log(data);

      // --- THIS IS THE FIX ---
      // 'data' is the object { quotes: [], ... }
      // We must set our state to data.quotes (the array)
      if (data && Array.isArray(data.quotes)) {
        setQuotes(data.quotes);
        setTotalPages(data.totalPages);
      } else {
        // Handle unexpected API response
        setQuotes([]);
        setTotalPages(1);
      }
      // --- END OF FIX ---

      setError('');
    } catch (err) {
      setError('Failed to fetch quotes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]); // `fetchQuotes` is now stable due to useCallback

  // Update URL when search term changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (debouncedSearchTerm) {
      newParams.set('search', debouncedSearchTerm);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1'); // Reset to page 1 on new search
    setSearchParams(newParams, { replace: true });
  }, [debouncedSearchTerm, setSearchParams]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await quoteService.updateQuoteStatus(id, newStatus);
      // Optimistic update (faster UI)
      setQuotes(prev =>
        prev.map(q => q._id === id ? { ...q, status: newStatus } : q)
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
      await quoteService.deleteQuote(itemToDelete._id);
      fetchQuotes();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      alert('Failed to delete quote');
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
        <h1 className="text-3xl font-bold text-gray-900">Quote Requests</h1>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search by name, email, product..."
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
        <div className="text-lg text-center">Loading quotes...</div>
      ) : error ? (
        <div className="text-lg text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg bg-white shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* This .map() is now safe because `quotes` is an array */}
                {quotes.map((quote) => (
                  <tr key={quote._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {quote.name}<br />
                      <span className="text-xs text-gray-500">{quote.email}</span><br />
                      <span className="text-xs text-gray-500">{quote.phone}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{quote.productName || 'General Quote'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{quote.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${quote.status === 'New' ? 'bg-blue-100 text-blue-800' :
                          quote.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                            quote.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <select
                        value={quote.status}
                        onChange={(e) => handleStatusChange(quote._id, e.target.value)}
                        className="rounded-md border-gray-300 text-sm"
                      >
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Resolved</option>
                        <option>Archived</option>
                      </select>
                      <button
                        onClick={() => confirmDelete(quote)}
                        className="ml-2 text-red-600 hover:text-red-900 p-1"
                        title="Delete Quote"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
        title="Delete Quote Request"
        itemName={itemToDelete ? `Quote from ${itemToDelete.name}` : ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};