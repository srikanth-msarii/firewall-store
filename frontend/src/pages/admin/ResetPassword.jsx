import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FloatingLabelInput } from '../../components/shared/FloatingLabelInput';
import { authService } from '../../services/api';

export const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { resetToken } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { data } = await authService.resetPassword(resetToken, password);
            setMessage(data.data);
            setLoading(false);
            setTimeout(() => {
                navigate('/admin/login');
            }, 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Something went wrong');
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
                        Reset Password
                    </h2>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <FloatingLabelInput
                            id="password"
                            label="New Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <FloatingLabelInput
                            id="confirmPassword"
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        {message && (
                            <div className="rounded-md bg-green-50 p-3 text-center text-sm font-medium text-green-600">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-center text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-blue-600 px-6 py-3.5 text-lg font-semibold text-white shadow-md
                         transition-transform hover:scale-[1.02] hover:bg-blue-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
