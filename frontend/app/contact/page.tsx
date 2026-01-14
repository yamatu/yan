'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/contact`, formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setError('Failed to send message. Please try again later.');
      console.error('Contact form error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-[#0a192f] via-[#10243c] to-[#0a192f]">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>

        {/* Animated Background Elements */}
        <div className="absolute top-10 right-20 w-64 h-64 bg-sky-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto animate-fadeInUp">
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-sky-300 bg-sky-500/10 backdrop-blur-sm border border-sky-500/20 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Get In Touch
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Contact
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">
                Us
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0d1c34]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-[var(--text-heading)] mb-8">
                Contact
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#06b6d4]">
                  Information
                </span>
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[rgba(0,188,212,0.15)] border border-[rgba(0,188,212,0.35)] rounded-xl flex items-center justify-center flex-shrink-0 text-[var(--accent)] shadow-[0_0_15px_rgba(0,188,212,0.2)]">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[var(--text-heading)] mb-1">Address</h3>
                    <p className="text-[var(--text-dark)] break-words">
                      2/F, No.4, Lane 5, Yangzaixi, Xinqiao, Baoan, Shenzhen, Guangdong, China
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[rgba(0,188,212,0.15)] border border-[rgba(0,188,212,0.35)] rounded-xl flex items-center justify-center flex-shrink-0 text-[var(--accent)] shadow-[0_0_15px_rgba(0,188,212,0.2)]">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-heading)] mb-1">Phone</h3>
                    <p className="text-[var(--text-dark)]">+86 181 2369 8903</p>
                    <p className="text-[var(--text-dark)]">Fax: +86 755 3381 0729</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[rgba(0,188,212,0.15)] border border-[rgba(0,188,212,0.35)] rounded-xl flex items-center justify-center flex-shrink-0 text-[var(--accent)] shadow-[0_0_15px_rgba(0,188,212,0.2)]">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-heading)] mb-1">Email</h3>
                    <p className="text-[var(--text-dark)]">1357885979@qq.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-[#1b2a4a] rounded-2xl border border-[rgba(0,188,212,0.25)] shadow-[0_0_25px_rgba(0,188,212,0.2)] p-8">
                <h2 className="text-3xl font-bold text-[var(--text-heading)] mb-8">
                  Send Us a
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#06b6d4]">
                    Message
                  </span>
                </h2>

                {success ? (
                  <div className="bg-green-50/10 border border-green-200/60 text-green-100 px-4 py-3 rounded-xl mb-6">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                ) : error ? (
                  <div className="bg-red-50/10 border border-red-200/60 text-red-100 px-4 py-3 rounded-xl mb-6">
                    {error}
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-heading)] mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[rgba(0,188,212,0.2)] rounded-xl bg-[#0f2238] text-[var(--text-heading)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-200"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-heading)] mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[rgba(0,188,212,0.2)] rounded-xl bg-[#0f2238] text-[var(--text-heading)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-heading)] mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[rgba(0,188,212,0.2)] rounded-xl bg-[#0f2238] text-[var(--text-heading)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-200"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-heading)] mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-[rgba(0,188,212,0.2)] rounded-xl bg-[#0f2238] text-[var(--text-heading)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-200 resize-none placeholder:text-[var(--text-dark)]"
                      placeholder="Tell us more about your project or inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--accent)] text-[#0a192f] py-3 rounded-xl font-semibold hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
