import Link from 'next/link';
import { Metadata } from 'next';
import { getApiBase } from '../../lib/api';

export const revalidate = 300;

interface Solution {
  id: number;
  title: string;
  description: string;
  image_url: string;
  path: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_at: string;
  updated_at: string;
}

async function getSolution(slug: string): Promise<Solution | null> {
  const baseUrl = getApiBase();

  const fetchSolution = async (url: string): Promise<Solution | null> => {
    const res = await fetch(url, {
      next: { revalidate },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return (await res.json()) as Solution;
  };
  const byPath = await fetchSolution(`${baseUrl}/api/solutions/by-path/${slug}`).catch(() => null);
  if (byPath) return byPath;

  const byId = await fetchSolution(`${baseUrl}/api/solutions/${slug}`).catch(() => null);
  return byId;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const solution = await getSolution(resolvedParams.slug);

  if (!solution) {
    return {
      title: 'Solution Not Found - Yamatu',
      description: 'The solution you are looking for does not exist.'
    };
  }

  return {
    title: solution.meta_title || solution.title,
    description: solution.meta_description || solution.description,
    keywords: solution.meta_keywords ? solution.meta_keywords.split(',').map(k => k.trim()) : [],
    openGraph: {
      title: solution.meta_title || solution.title,
      description: solution.meta_description || solution.description,
      images: solution.image_url ? [solution.image_url] : [],
      type: 'website',
    },
  };
}

export default async function SolutionDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const solution = await getSolution(resolvedParams.slug);

  if (!solution) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Solution Not Found</h3>
          <p className="text-gray-600 mb-6">The solution you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/solution"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Solutions</span>
          </Link>
        </div>
      </div>
    );
  }

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
              Solution
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {solution.title}
            </h1>

            <div className="flex items-center justify-center space-x-4 text-gray-300">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(solution.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              {solution.path && (
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>/solution/{solution.path}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-[#0d1c34]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1b2a4a] rounded-3xl border border-[rgba(0,188,212,0.25)] shadow-[0_0_25px_rgba(0,188,212,0.2)] p-12">
            {/* Solution Image */}
            {solution.image_url && (
              <div className="mb-8">
                <img
                  src={solution.image_url}
                  alt={solution.title}
                  className="w-full h-64 object-cover rounded-2xl shadow-[0_0_15px_rgba(0,188,212,0.2)]"
                />
              </div>
            )}

            {/* Solution Description */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-[var(--text-light)] leading-relaxed">
                {solution.description}
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-12 text-center">
            <Link
              href="/solution"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Solutions</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
