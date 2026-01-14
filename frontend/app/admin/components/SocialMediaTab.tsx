'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { SocialLink } from './types';

export default function SocialMediaTab() {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
    const [isCreatingSocialLink, setIsCreatingSocialLink] = useState(false);
    const [socialLinkFormData, setSocialLinkFormData] = useState({
        platform: 'facebook',
        url: '',
        sort_order: 0,
    });

    useEffect(() => {
        fetchSocialLinks();
    }, []);

    const fetchSocialLinks = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/social-links`);
            setSocialLinks((response.data as SocialLink[]) || []);
        } catch (error) {
            console.error('Failed to fetch social links:', error);
            setSocialLinks([]);
        }
    };

    const handleCreateSocialLink = () => {
        setSocialLinkFormData({
            platform: 'facebook',
            url: '',
            sort_order: socialLinks.length,
        });
        setIsCreatingSocialLink(true);
        setEditingSocialLink(null);
    };

    const handleEditSocialLink = (link: SocialLink) => {
        setSocialLinkFormData({
            platform: link.platform,
            url: link.url,
            sort_order: link.sort_order,
        });
        setEditingSocialLink(link);
        setIsCreatingSocialLink(false);
    };

    const handleSaveSocialLink = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                alert('Authentication token not found. Please log in again.');
                return;
            }

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            const payload = {
                ...socialLinkFormData,
                sort_order: Number(socialLinkFormData.sort_order) || 0,
            };

            if (editingSocialLink) {
                await axios.put(
                    `${baseUrl}/api/admin/social-links/${editingSocialLink.id}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert('Social link updated successfully');
            } else {
                await axios.post(
                    `${baseUrl}/api/admin/social-links`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert('Social link created successfully');
            }

            setEditingSocialLink(null);
            setIsCreatingSocialLink(false);
            fetchSocialLinks();
        } catch (error: any) {
            console.error('Failed to save social link:', error);
            alert('Save failed: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDeleteSocialLink = async (id: number) => {
        if (!confirm('Are you sure you want to delete this social link?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) return;
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/admin/social-links/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Social link deleted successfully');
            fetchSocialLinks();
        } catch (error: any) {
            console.error('Failed to delete social link:', error);
            alert('Delete failed: ' + (error.response?.data?.error || error.message));
        }
    };

    if (editingSocialLink || isCreatingSocialLink) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-900">
                            {editingSocialLink ? 'Edit Social Link' : 'Add New Social Link'}
                        </h2>
                        <button
                            onClick={() => {
                                setEditingSocialLink(null);
                                setIsCreatingSocialLink(false);
                            }}
                            className="text-gray-500 hover:text-gray-700 font-medium text-sm"
                        >
                            Cancel
                        </button>
                    </div>

                    <form onSubmit={handleSaveSocialLink} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Platform</label>
                            <select
                                value={socialLinkFormData.platform}
                                onChange={(e) => setSocialLinkFormData({ ...socialLinkFormData, platform: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 bg-white"
                                required
                            >
                                <option value="facebook">Facebook</option>
                                <option value="twitter">Twitter</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="instagram">Instagram</option>
                                <option value="youtube">YouTube</option>
                                <option value="github">GitHub</option>
                                <option value="wechat">WeChat (微信)</option>
                                <option value="weibo">Weibo (微博)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">URL</label>
                            <input
                                type="url"
                                value={socialLinkFormData.url}
                                onChange={(e) => setSocialLinkFormData({ ...socialLinkFormData, url: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 placeholder-gray-400"
                                placeholder="https://facebook.com/yourpage"
                                required
                            />
                            <p className="mt-2 text-xs text-gray-400">Enter the full URL to your profile page.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Sort Order</label>
                            <input
                                type="number"
                                value={socialLinkFormData.sort_order}
                                onChange={(e) => setSocialLinkFormData({ ...socialLinkFormData, sort_order: Number(e.target.value) })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 placeholder-gray-400"
                            />
                            <p className="mt-2 text-xs text-gray-400">Lower numbers appear first in the footer.</p>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingSocialLink(null);
                                    setIsCreatingSocialLink(false);
                                }}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-xl bg-sky-600 text-white font-medium text-sm hover:bg-sky-700 shadow-sm hover:shadow-md transition-all"
                            >
                                Save Link
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Social Media</h2>
                    <p className="text-gray-500 mt-1">Manage footer social icons</p>
                </div>
                <button
                    onClick={handleCreateSocialLink}
                    className="inline-flex items-center px-5 py-2.5 bg-sky-600 text-white text-sm font-medium rounded-xl hover:bg-sky-700 shadow-sm hover:shadow-md transition-all"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Social Link
                </button>
            </div>

            {socialLinks.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="inline-flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mb-2">
                            <svg className="w-10 h-10 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">No social links yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Connect with your audience by adding social media links.</p>
                        <button
                            onClick={handleCreateSocialLink}
                            className="mt-4 px-6 py-2 bg-white border border-gray-200 text-slate-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Add Link
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {socialLinks.map((link) => (
                            <div
                                key={link.id}
                                className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex items-center space-x-5">
                                    <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 text-xl font-bold capitalize shadow-sm">
                                        {link.platform.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-3">
                                            <h3 className="text-lg font-bold text-slate-900 capitalize">{link.platform}</h3>
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
                                                Order: {link.sort_order}
                                            </span>
                                        </div>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-gray-500 hover:text-sky-600 hover:underline mt-1 block truncate max-w-md"
                                        >
                                            {link.url}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditSocialLink(link)}
                                        className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSocialLink(link.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
