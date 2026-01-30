'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Solution } from './types';
import SeoPreview from './SeoPreview';
import { getApiBase } from '../../lib/api';

export default function SolutionsTab() {
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
    const [isCreatingSolution, setIsCreatingSolution] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
    const [solutionFormData, setSolutionFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        path: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
    });

    const fetchSolutions = async () => {
        try {
            const baseUrl = getApiBase();
            const response = await axios.get(`${baseUrl}/api/solutions`);
            setSolutions((response.data as Solution[]) || []);
        } catch (error) {
            console.error('Failed to fetch solutions:', error);
            setSolutions([]);
        }
    };

    useEffect(() => {
        fetchSolutions();
    }, []);

    const handleCreateSolution = () => {
        setSolutionFormData({
            title: '',
            description: '',
            image_url: '',
            path: '',
            meta_title: '',
            meta_description: '',
            meta_keywords: ''
        });
        setIsCreatingSolution(true);
        setEditingSolution(null);
    };

    const handleEditSolution = (solution: Solution) => {
        setEditingSolution(solution);
        setSolutionFormData({
            title: solution.title,
            description: solution.description,
            image_url: solution.image_url || '',
            path: solution.path || '',
            meta_title: solution.meta_title || '',
            meta_description: solution.meta_description || '',
            meta_keywords: solution.meta_keywords || ''
        });
        setIsCreatingSolution(false);
    };

    const handleSaveSolution = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                alert('Authentication token not found. Please log in again.');
                return;
            }

            const baseUrl = getApiBase();

            if (editingSolution) {
                await axios.put(
                    `${baseUrl}/api/admin/solutions/${editingSolution.id}`,
                    solutionFormData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert('Solution updated successfully');
            } else {
                await axios.post(
                    `${baseUrl}/api/admin/solutions`,
                    solutionFormData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert('Solution created successfully');
            }

            setEditingSolution(null);
            setIsCreatingSolution(false);
            fetchSolutions();
        } catch (error: any) {
            console.error('Failed to save solution:', error);
            alert('Save failed: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDeleteSolution = async (id: number) => {
        if (!confirm('Are you sure you want to delete this solution?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) return;
            const baseUrl = getApiBase();
            await axios.delete(`${baseUrl}/api/admin/solutions/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Solution deleted successfully');
            fetchSolutions();
        } catch (error: any) {
            console.error('Failed to delete solution:', error);
            alert('Delete failed: ' + (error.response?.data?.error || error.message));
        }
    };

    // Filter and Sort Logic
    const filteredSolutions = solutions
        .filter(solution =>
            solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            solution.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            return 0;
        });

    if (editingSolution || isCreatingSolution) {
        return (
            <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {editingSolution ? 'Edit Solution' : 'Create New Solution'}
                    </h2>
                    <button
                        onClick={() => {
                            setEditingSolution(null);
                            setIsCreatingSolution(false);
                        }}
                        className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={solutionFormData.title}
                                    onChange={(e) => setSolutionFormData({ ...solutionFormData, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 placeholder-gray-400 transition-all"
                                    required
                                    placeholder="Enter solution title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Image URL</label>
                                <div className="flex space-x-4">
                                    <input
                                        type="text"
                                        value={solutionFormData.image_url}
                                        onChange={(e) => setSolutionFormData({ ...solutionFormData, image_url: e.target.value })}
                                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 placeholder-gray-400 transition-all"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {solutionFormData.image_url && (
                                        <div className="w-24 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                                            <img src={solutionFormData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Description / Content</label>
                                <textarea
                                    value={solutionFormData.description}
                                    onChange={(e) => setSolutionFormData({ ...solutionFormData, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 h-64 text-gray-900 placeholder-gray-400 transition-all"
                                    required
                                    placeholder="Enter detailed description..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="space-y-6">
                        {/* Publish Actions */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Publishing</h3>
                            <div className="space-y-4">
                                <button
                                    onClick={handleSaveSolution}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 transition-all flex items-center justify-center transform hover:scale-[1.02]"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    {editingSolution ? 'Update Solution' : 'Publish Solution'}
                                </button>
                            </div>
                        </div>

                        {/* URL Settings */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">URL Settings</h3>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-2">Custom Path (Slug)</label>
                                <div className="flex items-center">
                                    <span className="text-gray-400 text-sm mr-1">/solution/</span>
                                    <input
                                        type="text"
                                        value={solutionFormData.path}
                                        onChange={(e) => setSolutionFormData({ ...solutionFormData, path: e.target.value })}
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-gray-900"
                                        placeholder="my-solution-slug"
                                    />
                                </div>
                                <p className="mt-2 text-xs text-gray-400">Leave blank to auto-generate from title.</p>
                            </div>
                        </div>

                        {/* SEO Settings */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">SEO Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-2">Meta Title</label>
                                    <input
                                        type="text"
                                        value={solutionFormData.meta_title}
                                        onChange={(e) => setSolutionFormData({ ...solutionFormData, meta_title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-gray-900"
                                        placeholder="Custom title for Google..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-2">Meta Description</label>
                                    <textarea
                                        value={solutionFormData.meta_description}
                                        onChange={(e) => setSolutionFormData({ ...solutionFormData, meta_description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-gray-900 h-20 resize-none"
                                        placeholder="Custom description for Google..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-2">Meta Keywords</label>
                                    <input
                                        type="text"
                                        value={solutionFormData.meta_keywords}
                                        onChange={(e) => setSolutionFormData({ ...solutionFormData, meta_keywords: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-gray-900"
                                        placeholder="keyword1, keyword2..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEO Preview */}
                        <SeoPreview
                            title={solutionFormData.title}
                            description={solutionFormData.description}
                            path={solutionFormData.path}
                            type="solution"
                            metaTitle={solutionFormData.meta_title}
                            metaDescription={solutionFormData.meta_description}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Solutions</h2>
                    <p className="text-gray-500 mt-1">Manage your product solutions</p>
                </div>
                <button
                    onClick={handleCreateSolution}
                    className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white text-sm font-medium rounded-xl hover:from-sky-700 hover:to-blue-700 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 transition-all transform hover:scale-[1.02]"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Solution
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search solutions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all sm:text-sm"
                    />
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-xl bg-gray-50"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="title">Title (A-Z)</option>
                    </select>
                </div>
            </div>

            {filteredSolutions.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="inline-flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mb-2">
                            <svg className="w-10 h-10 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">No solutions found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            {searchTerm ? 'Try adjusting your search terms.' : 'Add your first solution to showcase your services.'}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={handleCreateSolution}
                                className="mt-4 px-6 py-2 bg-white border border-gray-200 text-slate-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Create Solution
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSolutions.map((solution) => (
                        <div key={solution.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1">
                            <div className="relative h-56 bg-gray-100 overflow-hidden">
                                {solution.image_url ? (
                                    <img
                                        src={solution.image_url}
                                        alt={solution.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                        <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <span className="text-white text-sm font-medium truncate w-full">
                                        {solution.path ? `/solution/${solution.path}` : 'No public path'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                                        {solution.title}
                                    </h3>
                                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-md whitespace-nowrap ml-2">
                                        ID: {solution.id}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1 leading-relaxed">
                                    {solution.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Created</span>
                                        <span className="text-xs text-gray-600 font-medium">
                                            {new Date(solution.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => window.open(`/solution/${solution.path || solution.id}`, '_blank')}
                                            className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                            title="View Live"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleEditSolution(solution)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSolution(solution.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
