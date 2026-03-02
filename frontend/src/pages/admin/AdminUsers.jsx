import React, { useState, useEffect } from 'react';
import { userService } from '../../services/api';

import { DeleteConfirmationModal } from '../../components/admin/DeleteConfirmationModal';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

export const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); // For editing
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        permissions: [],
    });
    const [error, setError] = useState('');

    const availablePermissions = [
        { id: 'manage_products', label: 'Manage Products' },
        { id: 'manage_users', label: 'Manage Users' },
        { id: 'manage_orders', label: 'Manage Orders' },
        { id: 'manage_promotions', label: 'Manage Promotions' },
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await userService.getUsers();
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setCurrentUser(user);
            setFormData({
                email: user.email,
                password: '', // Don't show password
                permissions: user.permissions || [],
            });
        } else {
            setCurrentUser(null);
            setFormData({
                email: '',
                password: '',
                permissions: [],
            });
        }
        setError('');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
    };

    const handlePermissionChange = (permId) => {
        setFormData((prev) => {
            const newPermissions = prev.permissions.includes(permId)
                ? prev.permissions.filter((p) => p !== permId)
                : [...prev.permissions, permId];
            return { ...prev, permissions: newPermissions };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (currentUser) {
                // Update
                await userService.updateUser(currentUser._id, {
                    permissions: formData.permissions,
                    ...(formData.password && { password: formData.password }),
                });
            } else {
                // Create
                await userService.createUser(formData);
            }
            fetchUsers();
            handleCloseModal();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Something went wrong');
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
            await userService.deleteUser(itemToDelete._id);
            fetchUsers();
            setDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (err) {
            setError('Failed to delete user.');
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    <Plus size={20} className="mr-2" />
                    Add User
                </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Permissions
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Admin
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <div className="flex flex-wrap gap-1">
                                        {user.permissions?.map((perm) => (
                                            <span
                                                key={perm}
                                                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                                            >
                                                {perm}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {user.isAdmin ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                            Yes
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                            No
                                        </span>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleOpenModal(user)}
                                        className="mr-4 text-blue-600 hover:text-blue-900"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(user)}
                                        className="ml-4 text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                {currentUser ? 'Edit User' : 'Add User'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    disabled={!!currentUser} // Disable email edit for now
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Password {currentUser && '(Leave blank to keep current)'}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                    required={!currentUser}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Permissions
                                </label>
                                <div className="mt-2 space-y-2">
                                    {availablePermissions.map((perm) => (
                                        <label key={perm.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.permissions.includes(perm.id)}
                                                onChange={() => handlePermissionChange(perm.id)}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                {perm.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    {currentUser ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete User"
                itemName={itemToDelete ? itemToDelete.email : ''}
                isDeleting={isDeleting}
            />
        </div>
    );
};
