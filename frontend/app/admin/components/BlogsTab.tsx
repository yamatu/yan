'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Blog } from './types';
import SeoPreview from './SeoPreview';

export default function BlogsTab() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [isCreatingBlog, setIsCreatingBlog] = useState(false);
    const [blogFormData, setBlogFormData] = useState({
        title: '',
        summary: '',
        content: '',
        path: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
    });

    const fetchBlogs = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/blogs`);
            setBlogs((response.data as Blog[]) || []);
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
            setBlogs([]);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleCreateBlog = () => {
        setBlogFormData({
            title: '',
            summary: '',
            content: '',
            path: '',
            meta_title: '',
            meta_description: '',
            meta_keywords: ''
        });
        setIsCreatingBlog(true);
        setEditingBlog(null);
    };

    const handleEditBlog = (blog: Blog) => {
        setEditingBlog(blog);
        setBlogFormData({
            title: blog.title,
            summary: blog.summary,
            content: blog.content,
            path: blog.path || '',
            meta_title: blog.meta_title || '',
            meta_description: blog.meta_description || '',
            meta_keywords: blog.meta_keywords || ''
        });
        setIsCreatingBlog(false);
    };

    const handleSaveBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                alert('Authentication token not found. Please log in again.');
                return;
            }

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

            if (editingBlog) {
                await axios.put(
                    `${baseUrl}/api/admin/blogs/${editingBlog.id}`,
                    blogFormData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert('Blog updated successfully');
            } else {
                await axios.post(
                    `${baseUrl}/api/admin/blogs`,
                    blogFormData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert('Blog created successfully');
            }

            setEditingBlog(null);
            setIsCreatingBlog(false);
            fetchBlogs();
        } catch (error: any) {
            console.error('Failed to save blog:', error);
            alert('Save failed: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDeleteBlog = async (id: number) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) return;
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/admin/blogs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Blog deleted successfully');
            fetchBlogs();
        } catch (error: any) {
            console.error('Failed to delete blog:', error);
            alert('Delete failed: ' + (error.response?.data?.error || error.message));
        }
    };

    if (editingBlog || isCreatingBlog) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {editingBlog ? 'Edit Blog Article' : 'Create New Article'}
                    </h2>
                    <button
                        onClick={() => {
                            setEditingBlog(null);
                            setIsCreatingBlog(false);
                        }}
                        className="text-gray-500 hover:text-gray-700 font-medium"
                    >
                        Cancel
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Article Title</label>
                                <input
                                    type="text"
                                    value={blogFormData.title}
                                    onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 placeholder-gray-400 transition-all"
                                    placeholder="Enter a catchy title..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Summary / Meta Description</label>
                                <textarea
                                    value={blogFormData.summary}
                                    onChange={(e) => setBlogFormData({ ...blogFormData, summary: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 h-24 text-gray-900 placeholder-gray-400 transition-all resize-none"
                                    placeholder="Brief summary for SEO and list view..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Content (Markdown)</label>
                                <div className="relative">
                                    <textarea
                                        value={blogFormData.content}
                                        onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 h-96 font-mono text-sm text-gray-900 placeholder-gray-400 transition-all"
                                        placeholder="# Write your article here..."
                                        required
                                    />
                                    <div className="absolute bottom-4 right-4 text-xs text-gray-400 pointer-events-none">
                                        Markdown Supported
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="space-y-6">
                        {/* Publish Actions */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Publishing</h3>
                            <div className="space-y-4">
                                <button
                                    onClick={handleSaveBlog}
                                    className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    {editingBlog ? 'Update Article' : 'Publish Article'}
                                </button>
                            </div>
                        </div>

                        {/* URL Settings */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">URL Settings</h3>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-2">Custom Path (Slug)</label>
                                <div className="flex items-center">
                                    <span className="text-gray-400 text-sm mr-1">/blog/</span>
                                    <input
                                        type="text"
                                        value={blogFormData.path}
                                        onChange={(e) => setBlogFormData({ ...blogFormData, path: e.target.value })}
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-gray-900"
                                        placeholder="my-article-slug"
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
                                        value={blogFormData.meta_title}
                                        onChange={(e) => setBlogFormData({ ...blogFormData, meta_title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-gray-900"
                                        placeholder="Custom title for Google..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-2">Meta Description</label>
                                    <textarea
                                        value={blogFormData.meta_description}
                                        onChange={(e) => setBlogFormData({ ...blogFormData, meta_description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-gray-900 h-20 resize-none"
                                        placeholder="Custom description for Google..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-2">Meta Keywords</label>
                                    <input
                                        type="text"
                                        value={blogFormData.meta_keywords}
                                        onChange={(e) => setBlogFormData({ ...blogFormData, meta_keywords: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-gray-900"
                                        placeholder="keyword1, keyword2..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEO Preview */}
                        <SeoPreview
                            title={blogFormData.title}
                            description={blogFormData.summary}
                            path={blogFormData.path}
                            type="blog"
                            metaTitle={blogFormData.meta_title}
                            metaDescription={blogFormData.meta_description}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Blog Articles</h2>
                    <p className="text-gray-500 mt-1">Manage your news and technical articles</p>
                </div>
                <button
                    onClick={handleCreateBlog}
                    className="inline-flex items-center px-5 py-2.5 bg-sky-600 text-white text-sm font-medium rounded-xl hover:bg-sky-700 shadow-sm hover:shadow-md transition-all"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Article
                </button>
            </div>

            {blogs.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="inline-flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mb-2">
                            <svg className="w-10 h-10 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">No articles yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Start building your content library by creating your first technical blog article.</p>
                        <button
                            onClick={handleCreateBlog}
                            className="mt-4 px-6 py-2 bg-white border border-gray-200 text-slate-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Create Article
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3 flex-1 mr-8">
                                    <div className="flex items-center space-x-3">
                                        <span className="px-2.5 py-1 bg-sky-50 text-sky-600 text-xs font-semibold rounded-lg">Article</span>
                                        <span className="text-xs text-gray-400 flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(blog.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                                        {blog.title}
                                    </h3>
                                    <p className="text-gray-500 line-clamp-2 text-sm leading-relaxed">{blog.summary}</p>
                                    {blog.path && (
                                        <div className="flex items-center text-xs text-gray-400 bg-gray-50 inline-block px-2 py-1 rounded">
                                            <span className="font-mono">/{blog.path}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditBlog(blog)}
                                        className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBlog(blog.id)}
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
                    ))}
                </div>
            )}
        </div>
    );
}
