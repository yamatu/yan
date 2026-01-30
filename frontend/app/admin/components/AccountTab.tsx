'use client';

import { useState } from 'react';
import axios from 'axios';
import { getApiBase } from '../../lib/api';

interface AccountTabProps {
    currentUsername: string;
    onLogout: () => void;
}

export default function AccountTab({ currentUsername, onLogout }: AccountTabProps) {
    const [accountForm, setAccountForm] = useState({
        currentPassword: '',
        newUsername: '',
        newPassword: '',
    });

    const handleUpdateCredentials = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) return;

            const baseUrl = getApiBase();

            await axios.put(
                `${baseUrl}/api/admin/credentials`,
                {
                    current_password: accountForm.currentPassword,
                    new_username: accountForm.newUsername,
                    new_password: accountForm.newPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Credentials updated successfully. Please log in again.');
            onLogout();
        } catch (error: any) {
            console.error('Failed to update credentials:', error);
            alert('Update failed: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-8 bg-gradient-to-br from-sky-50 to-white border-b border-gray-100">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-sky-600 text-3xl font-bold shadow-sm ring-4 ring-white">
                            {currentUsername.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Admin Account</h2>
                            <p className="text-gray-500 mt-1">Manage your login credentials and security</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="p-8">
                    <form onSubmit={handleUpdateCredentials} className="space-y-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Verification</h3>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={accountForm.currentPassword}
                                    onChange={(e) => setAccountForm({ ...accountForm, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 placeholder-gray-400 bg-white"
                                    placeholder="Enter current password to authorize changes"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">New Credentials</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">New Username</label>
                                    <input
                                        type="text"
                                        value={accountForm.newUsername}
                                        onChange={(e) => setAccountForm({ ...accountForm, newUsername: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 placeholder-gray-400"
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                                    <input
                                        type="password"
                                        value={accountForm.newPassword}
                                        onChange={(e) => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 placeholder-gray-400"
                                        placeholder="Leave blank to keep current"
                                    />
                                    <p className="mt-2 text-xs text-gray-400">
                                        Password must be at least 6 characters long.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                className="px-8 py-3 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 shadow-sm hover:shadow-md transition-all flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Update Credentials
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
