'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface Solution {
  id: number;
  title: string;
  description: string;
  image_url: string;
  path: string;
  created_at: string;
}

export default function SolutionPage() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/solutions`);
      setSolutions((response.data as Solution[]) || []);
    } catch (error) {
      console.error('Failed to fetch solutions:', error);
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f]">
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
              Our Solutions
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Innovative
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">
                Solutions
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover our comprehensive range of hardware and technology solutions
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 bg-[#0d1c34]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center space-x-2 text-[var(--text-dark)]">
                <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-medium">Loading solutions...</span>
              </div>
            </div>
          ) : solutions.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex flex-col items-center space-y-4 text-[var(--text-dark)]">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">No Solutions Available</h3>
                  <p>We're preparing amazing solutions for you. Please check back later.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solutions.map((solution, index) => (
                <Link
                  key={solution.id}
                  href={`/solution/${solution.path || solution.id}`}
                  className={`group relative bg-[#1b2a4a] rounded-2xl border border-[rgba(0,188,212,0.25)] hover:border-[rgba(0,188,212,0.5)] hover:shadow-[0_0_25px_rgba(0,188,212,0.2)] transition-all duration-500 transform hover:-translate-y-2 overflow-hidden ${isVisible ? 'animate-fadeInUp' : 'opacity-0'
                    }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[#10243c] to-[#0a192f] overflow-hidden">
                    {solution.image_url ? (
                      <img
                        src={solution.image_url}
                        alt={solution.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center">
                          <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[var(--text-heading)] mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--accent)] group-hover:to-[#06b6d4] transition-all duration-300">
                      {solution.title}
                    </h3>
                    <p className="text-[var(--text-dark)] leading-relaxed">
                      {solution.description}
                    </p>
                    <div className="mt-4 text-sm text-[var(--text-dark)]">
                      {new Date(solution.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
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
