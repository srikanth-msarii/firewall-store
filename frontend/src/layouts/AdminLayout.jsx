import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tag,
  ClipboardList,
  MessageSquare,
  Users,
  LogOut,
  Megaphone, // 1. Import new icon for Promotions
  FileText
} from 'lucide-react';

// 2. Main navigation items updated
const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'Brands', href: '/admin/brands', icon: Tag },
  { name: 'Users', href: '/admin/users', icon: Users },
  // Bulk Upload is now part of Products
  { name: 'Promotions', href: '/admin/promotions', icon: Megaphone }, // 3. Added Promotions
  { name: 'Quote Requests', href: '/admin/quotes', icon: ClipboardList },
  { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
];

export const AdminLayout = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  // Filter nav items based on permissions
  const filteredNavItems = navItems.filter((item) => {
    if (!user) return false;
    if (user.isAdmin) return true; // Super admin sees all

    const permissions = user.permissions || [];

    // Map permissions to nav items
    if (item.name === 'Dashboard') return true; // Everyone sees dashboard
    if (['Products', 'Brands', 'Categories', 'Bulk Upload'].includes(item.name)) {
      return permissions.includes('manage_products');
    }
    if (item.name === 'Users') {
      return permissions.includes('manage_users');
    }
    if (['Quote Requests', 'Inquiries'].includes(item.name)) {
      return permissions.includes('manage_orders'); // Assuming 'manage_orders' covers this
    }
    if (item.name === 'Promotions') {
      return permissions.includes('manage_promotions');
    }

    return false;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- 4. Redesigned Sidebar --- */}
      <nav className="sticky top-0 h-screen flex w-64 flex-col bg-white text-gray-600 shadow-lg border-r border-gray-200 overflow-y-auto">

        {/* 5. Logo Area */}
        <div className="flex h-16 flex-shrink-0 items-center justify-center px-4 border-b border-gray-200">
          <Link to="/">
            <img
              src="/assets/images/logo.png" // Your site's logo
              alt="Trace Networks Logo"
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Nav Links */}
        <ul className="flex-1 space-y-1 overflow-y-auto p-4">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex w-full items-center rounded-md px-4 py-2.5 
                              transition-colors
                              ${isActive
                      ? 'bg-blue-50 text-blue-600' // New active state
                      : 'hover:bg-gray-100 hover:text-gray-900' // New inactive state
                    }`}
                >
                  <item.icon
                    size={20}
                    className={`mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                  />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-md px-4 py-2.5 
                       text-gray-600 transition-colors font-medium
                       hover:bg-red-50 hover:text-red-600" // New hover state
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="flex-1 overflow-x-hidden">
        {/* 6. Redesigned Top Bar */}
        <div className="h-16 bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-full items-center justify-end px-8">
            <span className="text-sm font-medium text-gray-700">
              Welcome, {user?.email || 'Admin'}
            </span>
          </div>
        </div>

        {/* Page content gets rendered here */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};