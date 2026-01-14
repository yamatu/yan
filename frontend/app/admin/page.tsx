'use client';

import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Sidebar from './components/Sidebar';
import BlogsTab from './components/BlogsTab';
import SolutionsTab from './components/SolutionsTab';
import ContactsTab from './components/ContactsTab';
import CarouselsTab from './components/CarouselsTab';
import SocialMediaTab from './components/SocialMediaTab';
import AccountTab from './components/AccountTab';

export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('blogs');
    const [currentAdminUsername, setCurrentAdminUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        const storedUsername = localStorage.getItem('admin_username');
        if (storedUsername) {
            setCurrentAdminUsername(storedUsername);
        }
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = (token: string, username: string) => {
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_username', username);
        setCurrentAdminUsername(username);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_username');
        setIsLoggedIn(false);
        setCurrentAdminUsername('');
    };

    if (!isLoggedIn) {
        return <LoginForm onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                                Admin Dashboard
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                                Logged in as <span className="font-medium text-gray-900">{currentAdminUsername}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'blogs' && <BlogsTab />}
                {activeTab === 'solutions' && <SolutionsTab />}
                {activeTab === 'contacts' && <ContactsTab />}
                {activeTab === 'carousels' && <CarouselsTab />}
                {activeTab === 'social' && <SocialMediaTab />}
                {activeTab === 'account' && (
                    <AccountTab
                        currentUsername={currentAdminUsername}
                        onLogout={handleLogout}
                    />
                )}
            </main>
        </div>
    );
}
