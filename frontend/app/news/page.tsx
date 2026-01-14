'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FaIndustry, FaBoxOpen, FaLightbulb, FaMicrochip } from 'react-icons/fa';

interface News {
  id: number;
  title: string;
  summary: string;
  content: string;
  path: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  count: number;
}

// Icon mapping
const iconMap: Record<string, any> = {
  FaIndustry,
  FaBoxOpen,
  FaLightbulb,
  FaMicrochip,
};

export default function NewsList() {
  const [news, setNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetchNews();
    fetchCategories();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/blogs`);
      // Ensure we always set an array, even if API returns null
      setNews(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch news list:', error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/categories`);
      const data = response.data as Category[];
      // If API returns empty or null, use default categories
      if (!data || data.length === 0) {
        setCategories([
          { id: 1, name: 'Industry Trends', slug: 'industry-trends', icon: 'FaIndustry', color: 'from-blue-500 to-cyan-500', count: news.length },
          { id: 2, name: 'Product Updates', slug: 'product-updates', icon: 'FaBoxOpen', color: 'from-purple-500 to-pink-500', count: 0 },
          { id: 3, name: 'Solutions', slug: 'solutions', icon: 'FaLightbulb', color: 'from-green-500 to-emerald-500', count: 0 },
          { id: 4, name: 'Tech Insights', slug: 'tech-insights', icon: 'FaMicrochip', color: 'from-orange-500 to-red-500', count: 0 },
        ]);
      } else {
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Set default categories on error
      setCategories([
        { id: 1, name: 'Industry Trends', slug: 'industry-trends', icon: 'FaIndustry', color: 'from-blue-500 to-cyan-500', count: news.length },
        { id: 2, name: 'Product Updates', slug: 'product-updates', icon: 'FaBoxOpen', color: 'from-purple-500 to-pink-500', count: 0 },
        { id: 3, name: 'Solutions', slug: 'solutions', icon: 'FaLightbulb', color: 'from-green-500 to-emerald-500', count: 0 },
        { id: 4, name: 'Tech Insights', slug: 'tech-insights', icon: 'FaMicrochip', color: 'from-orange-500 to-red-500', count: 0 },
      ]);
    }
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900">
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
          <div className={`max-w-4xl mx-auto ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-sky-300 bg-sky-500/10 backdrop-blur-sm border border-sky-500/20 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Latest News & Updates
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              News &
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">
                Updates
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Stay informed with the latest industry insights and company news
            </p>
          </div>
        </div>
      </section>

      {/* Featured Topics */}
      <section className="py-20 bg-gradient-to-b from-[#0a192f] via-[#10243c] to-[#0a192f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-3xl md:text-4xl font-bold text-[var(--text-heading)] mb-12 text-center ${isVisible ? 'animate-fadeIn' : 'opacity-0'
              }`}
            style={{ animationDelay: '200ms' }}
          >
            Featured
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#06b6d4]">
              Topics
            </span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories && categories.length > 0 ? (
              categories.map((category, index) => {
                const IconComponent = iconMap[category.icon] || FaMicrochip;
                return (
                  <div
                    key={category.id}
                    className={`group relative overflow-hidden rounded-2xl border border-[rgba(0,188,212,0.25)] bg-[#1b2a4a] hover:border-[rgba(0,188,212,0.5)] hover:shadow-[0_0_20px_rgba(0,188,212,0.2)] transition-all duration-300 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'
                      }`}
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-sm -z-10`}></div>

                    <div className="relative m-1 p-6 bg-[#1b2a4a]/95 rounded-2xl text-center">
                      <div className="inline-flex items-center justify-center w-[70px] h-[70px] mx-auto rounded-full bg-[rgba(0,188,212,0.1)] border-2 border-[var(--primary-blue)] text-[var(--primary-blue)] text-[28px] mb-4 group-hover:bg-[var(--primary-blue)] group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(0,188,212,0.2)]">
                        <IconComponent />
                      </div>
                      <h3 className="font-bold text-[var(--text-heading)] mb-2 group-hover:text-[var(--accent)] transition-all duration-300">
                        {category.name}
                      </h3>
                      <p className="text-[var(--text-dark)] text-sm">{category.count || 0} articles</p>
                    </div>
                  </div>
                );
              })
            ) : null}
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-24 bg-[#0d1c34]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl md:text-5xl font-bold text-[var(--text-heading)] mb-6 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'
                }`}
              style={{ animationDelay: '400ms' }}
            >
              Latest
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#06b6d4] mt-2">
                Articles
              </span>
            </h2>
            <p
              className={`text-xl text-[var(--text-dark)] max-w-3xl mx-auto ${isVisible ? 'animate-fadeIn' : 'opacity-0'
                }`}
              style={{ animationDelay: '600ms' }}
            >
              Technical insights, industry trends, and practical experience from our team.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center space-x-2 text-[var(--text-dark)]">
                <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-medium">Loading news articles...</span>
              </div>
            </div>
          ) : !news || news.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex flex-col items-center space-y-4 text-[var(--text-dark)]">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">No News Available</h3>
                  <p>We're preparing amazing news content for you. Please check back later.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((newsItem, index) => (
                <Link
                  key={newsItem.id}
                  href={`/blog/${newsItem.path || newsItem.id}`}
                  className={`group bg-[#1b2a4a] rounded-2xl border border-[rgba(0,188,212,0.25)] hover:border-[rgba(0,188,212,0.5)] hover:shadow-[0_0_25px_rgba(0,188,212,0.2)] transition-all duration-500 transform hover:-translate-y-2 overflow-hidden ${isVisible ? 'animate-fadeInUp' : 'opacity-0'
                    }`}
                  style={{ animationDelay: `${(index + 6) * 150}ms` }}
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] to-[#06b6d4] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 blur-sm -z-10"></div>

                  {/* Dark content panel */}
                  <div className="relative m-1 p-8 bg-[#1b2a4a]/95 rounded-2xl border border-transparent">
                    {/* Date Badge */}
                    <div className="inline-flex items-center px-3 py-1 bg-[rgba(0,188,212,0.12)] text-[var(--accent)] text-sm font-medium rounded-full mb-6 group-hover:bg-[rgba(0,188,212,0.2)] transition-colors duration-300">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(newsItem.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-[var(--text-heading)] mb-4 line-clamp-2 group-hover:text-[var(--accent)] transition-all duration-300">
                      {newsItem.title}
                    </h3>

                    <p className="text-[var(--text-dark)] mb-6 leading-relaxed line-clamp-3">
                      {newsItem.summary || (newsItem.content ? newsItem.content.substring(0, 150) + '...' : 'No description available')}
                    </p>

                    {/* Read More Link */}
                    <div className="flex items-center text-[var(--accent)] font-medium group-hover:text-[#06b6d4] transition-colors duration-300">
                      <span>Read More</span>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
