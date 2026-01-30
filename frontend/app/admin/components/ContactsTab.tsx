'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Contact } from './types';
import { getApiBase } from '../../lib/api';

export default function ContactsTab() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const baseUrl = getApiBase();
            const response = await axios.get(`${baseUrl}/api/admin/contacts`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
            });
            setContacts((response.data as Contact[]) || []);
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
            setContacts([]);
        }
    };

    const handleDeleteContact = async (id: number) => {
        if (!confirm('Are you sure you want to delete this contact message?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) return;
            const baseUrl = getApiBase();
            await axios.delete(`${baseUrl}/api/admin/contacts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Contact deleted successfully');
            if (selectedContact?.id === id) setSelectedContact(null);
            fetchContacts();
        } catch (error: any) {
            console.error('Failed to delete contact:', error);
            alert('Delete failed: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Messages</h2>
                    <p className="text-gray-500 mt-1">Inquiries from your contact form</p>
                </div>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                    Total: <span className="font-semibold text-slate-900">{contacts.length}</span>
                </div>
            </div>

            {contacts.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="inline-flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">No messages yet</h3>
                        <p className="text-gray-500">New inquiries will appear here.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
                    {/* List */}
                    <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                            <input
                                type="text"
                                placeholder="Search messages..."
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                            />
                        </div>
                        <div className="overflow-y-auto flex-1 p-2 space-y-1">
                            {contacts.map((contact) => (
                                <button
                                    key={contact.id}
                                    onClick={() => setSelectedContact(contact)}
                                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${selectedContact?.id === contact.id
                                        ? 'bg-sky-50 shadow-sm ring-1 ring-sky-100'
                                        : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`font-semibold truncate ${selectedContact?.id === contact.id ? 'text-sky-900' : 'text-slate-900'}`}>
                                            {contact.name}
                                        </span>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                            {new Date(contact.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={`text-sm truncate ${selectedContact?.id === contact.id ? 'text-sky-700' : 'text-gray-500'}`}>
                                        {contact.subject}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Detail */}
                    <div className="lg:col-span-2 h-full">
                        {selectedContact ? (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col">
                                {/* Header */}
                                <div className="p-8 border-b border-gray-100">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-2xl font-bold text-slate-900 leading-tight">{selectedContact.subject}</h3>
                                        <button
                                            onClick={() => handleDeleteContact(selectedContact.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Message"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex items-center space-x-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-semibold">
                                                {selectedContact.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{selectedContact.name}</p>
                                                <p className="text-xs text-gray-500">Sender</p>
                                            </div>
                                        </div>
                                        <div className="h-8 w-px bg-gray-200"></div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{selectedContact.email}</p>
                                            <p className="text-xs text-gray-500">Email Address</p>
                                        </div>
                                        <div className="h-8 w-px bg-gray-200"></div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{new Date(selectedContact.created_at).toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">Received</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 overflow-y-auto flex-1 bg-gray-50/30">
                                    <div className="prose prose-slate max-w-none">
                                        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
                                            {selectedContact.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col items-center justify-center text-center p-12">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a message</h3>
                                <p className="text-gray-500 max-w-xs">Choose a message from the list on the left to view its full details.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
