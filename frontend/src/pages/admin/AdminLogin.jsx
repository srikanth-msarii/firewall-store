import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FloatingLabelInput } from '../../components/shared/FloatingLabelInput';
// 1. Import the auth service
import { authService } from '../../services/api';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 2. Use the authService to log in
      const { data } = await authService.login(email, password);

      // 3. Save the token and user info to localStorage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify({
        email: data.email,
        permissions: data.permissions,
        isAdmin: data.isAdmin
      }));

      console.log('Admin login successful');
      setLoading(false);
      navigate('/admin/dashboard'); // Redirect to dashboard

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Link to="/">
            <img src="/assets/images/logo.png" alt="Trace" className="h-12" />
          </Link>
        </div>

        <div className="mt-8 rounded-xl bg-white p-8 shadow-xl md:p-10">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Admin Portal Sign In
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <FloatingLabelInput
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <FloatingLabelInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-center text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end">
              <Link
                to="/admin/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading} // Disable button while loading
              className="w-full rounded-md bg-blue-600 px-6 py-3.5 text-lg font-semibold text-white shadow-md
                         transition-transform hover:scale-[1.02] hover:bg-blue-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};