import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, quoteService, inquiryService } from '../../services/api';
import { Package, ClipboardList, MessageSquare, ArrowRight } from 'lucide-react';

// A new component for the stat cards
const StatCard = ({ title, value, icon: Icon, color, link, bg }) => (
  <Link to={link} className="block rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md hover:scale-[1.02]">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <span className={`rounded-lg p-3 ${bg}`}>
        <Icon size={24} className={color} />
      </span>
    </div>
  </Link>
);

export const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    newQuotes: 0,
    newInquiries: 0
  });
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Get user permissions
        const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
        const isAdmin = user.isAdmin;
        const permissions = user.permissions || [];

        const promises = [];
        // Always fetch products (public or managed)
        promises.push(productService.getProducts());

        // Fetch quotes if allowed
        if (isAdmin || permissions.includes('manage_orders')) {
          promises.push(quoteService.getQuotes({ page: 1, search: '' }));
        } else {
          promises.push(Promise.resolve(null)); // Return null if not allowed
        }

        // Fetch inquiries if allowed
        if (isAdmin || permissions.includes('manage_orders')) {
          promises.push(inquiryService.getInquiries({ page: 1, search: '' }));
        } else {
          promises.push(Promise.resolve(null)); // Return null if not allowed
        }

        const [productsRes, quotesRes, inquiriesRes] = await Promise.all(promises);

        let newQuotesCount = null;
        let newInquiriesCount = null;
        let recentQuotesData = [];
        let recentInquiriesData = [];

        if (quotesRes && quotesRes.data && quotesRes.data.quotes) {
          const newQuotes = quotesRes.data.quotes.filter(q => q.status === 'New');
          newQuotesCount = newQuotes.length;
          recentQuotesData = newQuotes.slice(0, 5);
        }

        if (inquiriesRes && inquiriesRes.data && inquiriesRes.data.inquiries) {
          const newInquiries = inquiriesRes.data.inquiries.filter(i => i.status === 'New');
          newInquiriesCount = newInquiries.length;
          recentInquiriesData = newInquiries.slice(0, 5);
        }

        setStats({
          products: productsRes.data.length,
          newQuotes: newQuotesCount,
          newInquiries: newInquiriesCount
        });

        setRecentQuotes(recentQuotesData);
        setRecentInquiries(recentInquiriesData);

      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setError("Could not load dashboard data. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-4 text-gray-600">
        Welcome to the admin panel. Here's a summary of your site.
      </p>

      {loading ? (
        <div className="text-center text-lg mt-8">Loading dashboard data...</div>
      ) : error ? (
        <div className="text-center text-lg mt-8 text-red-600">{error}</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Products Card - Visible to everyone or specific permission */}
            <StatCard
              title="Total Products"
              value={stats.products}
              icon={Package}
              color="text-blue-600"
              bg="bg-blue-50"
              link="/admin/products"
            />

            {/* Quotes Card - Conditional */}
            {(stats.newQuotes !== undefined && stats.newQuotes !== null) && (
              <StatCard
                title="New Quotes"
                value={stats.newQuotes}
                icon={ClipboardList}
                color="text-emerald-600"
                bg="bg-emerald-50"
                link="/admin/quotes"
              />
            )}

            {/* Inquiries Card - Conditional */}
            {(stats.newInquiries !== undefined && stats.newInquiries !== null) && (
              <StatCard
                title="New Inquiries"
                value={stats.newInquiries}
                icon={MessageSquare}
                color="text-amber-600"
                bg="bg-amber-50"
                link="/admin/inquiries"
              />
            )}
          </div>

          {/* Recent Activity */}
          {/* Recent Activity Grid */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Recent Quotes */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Quotes</h2>
                <Link to="/admin/quotes" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors">
                  View All <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
              {recentQuotes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">No new quotes.</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentQuotes.map((quote) => (
                    <li key={quote._id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{quote.name}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{quote.productName || 'General Quote'}</p>
                        </div>
                        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Recent Inquiries */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Inquiries</h2>
                <Link to="/admin/inquiries" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors">
                  View All <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
              {stats.newInquiries === 0 && (!recentInquiries || recentInquiries.length === 0) ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">No new inquiries.</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentInquiries.map((inquiry) => (
                    <li key={inquiry._id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{inquiry.firstName} {inquiry.lastName}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{inquiry.company}</p>
                        </div>
                        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
};