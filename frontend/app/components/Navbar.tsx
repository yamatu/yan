'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Do not render navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? 'bg-[#0a192f]/95 backdrop-blur-md shadow-lg border-b border-[rgba(0,188,212,0.3)]'
          : 'bg-[#0a192f]/90 backdrop-blur-md border-b border-[rgba(0,188,212,0.15)]'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-18">
          <Link
            href="/"
            className="group flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-[rgba(0,188,212,0.12)] border border-[rgba(0,188,212,0.35)] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,188,212,0.3)] transform group-hover:scale-105 transition-transform duration-200">
              <span className="text-[18px] font-semibold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>KND</span>
            </div>
            <span
              className={`text-xl font-semibold tracking-wide transition-colors duration-200 ${scrolled ? 'text-white' : 'text-white'
                } group-hover:text-[var(--accent)]`}
              style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px' }}
            >
              KIND & DIVINE
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 uppercase text-[12px] tracking-[1.5px]">
            <Link
              href="/"
              className={`relative font-semibold transition-colors duration-200 hover:text-[var(--accent)] ${scrolled ? 'text-[var(--text-dark)]' : 'text-[var(--text-light)]'
                }`}
            >
              HOME
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 hover:w-full"></span>
            </Link>
            <Link
              href="/about"
              className={`relative font-semibold transition-colors duration-200 hover:text-[var(--accent)] ${scrolled ? 'text-[var(--text-dark)]' : 'text-[var(--text-light)]'
                }`}
            >
              ABOUT US
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 hover:w-full"></span>
            </Link>
            <Link
              href="/news"
              className={`relative font-semibold transition-colors duration-200 hover:text-[var(--accent)] ${scrolled ? 'text-[var(--text-dark)]' : 'text-[var(--text-light)]'
                }`}
            >
              NEWS
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 hover:w-full"></span>
            </Link>
            <Link
              href="/solution"
              className={`relative font-semibold transition-colors duration-200 hover:text-[var(--accent)] ${scrolled ? 'text-[var(--text-dark)]' : 'text-[var(--text-light)]'
                }`}
            >
              SOLUTION
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 hover:w-full"></span>
            </Link>
            <Link
              href="/contact"
              className={`relative font-semibold transition-colors duration-200 hover:text-[var(--accent)] ${scrolled ? 'text-[var(--text-dark)]' : 'text-[var(--text-light)]'
                }`}
            >
              CONTACT US
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 hover:w-full"></span>
            </Link>
          </div>

          <div className="hidden md:block">
            <Link
              href="/contact"
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 border ${scrolled
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_15px_rgba(0,188,212,0.4)]'
                  : 'bg-[rgba(0,188,212,0.12)] text-[var(--text-heading)] border-[rgba(0,188,212,0.35)] hover:bg-[rgba(0,188,212,0.2)]'
                }`}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors duration-200 ${scrolled ? 'text-white' : 'text-white'
                }`}
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-[#0a192f] z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        style={{ top: '64px' }}
      >
        <div className="flex flex-col px-4 pt-4 pb-6 space-y-4 bg-[#0a192f] h-full border-t border-[rgba(0,188,212,0.15)]">
          <Link
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[var(--accent)] hover:bg-[rgba(0,188,212,0.1)] transition-colors"
          >
            HOME
          </Link>
          <Link
            href="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[var(--accent)] hover:bg-[rgba(0,188,212,0.1)] transition-colors"
          >
            ABOUT US
          </Link>
          <Link
            href="/news"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[var(--accent)] hover:bg-[rgba(0,188,212,0.1)] transition-colors"
          >
            NEWS
          </Link>
          <Link
            href="/solution"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[var(--accent)] hover:bg-[rgba(0,188,212,0.1)] transition-colors"
          >
            SOLUTION
          </Link>
          <Link
            href="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[var(--accent)] hover:bg-[rgba(0,188,212,0.1)] transition-colors"
          >
            CONTACT US
          </Link>
          <div className="pt-4">
            <Link
              href="/contact"
              className="block w-full text-center px-6 py-3 rounded-full font-semibold bg-[var(--accent)] text-white shadow-[0_0_15px_rgba(0,188,212,0.4)] hover:bg-[var(--accent-hover)] transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
