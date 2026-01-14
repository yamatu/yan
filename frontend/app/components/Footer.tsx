'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaGithub, FaWeixin, FaWeibo } from 'react-icons/fa';

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  sort_order: number;
}

const iconMap: Record<string, any> = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  youtube: FaYoutube,
  github: FaGithub,
  wechat: FaWeixin,
  weibo: FaWeibo,
};

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/social-links`);
      setSocialLinks(response.data as SocialLink[]);
    } catch (error) {
      console.error('Failed to fetch social links:', error);
      setSocialLinks([]);
    }
  };

  return (
    <footer className="border-t border-[rgba(0,188,212,0.2)] bg-[#0d1c34] text-[var(--text-light)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-heading)] mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>KND Intelligent Hardware</h3>
            <p className="text-sm text-[var(--text-dark)]">
              AR precision parts, smart mechanical systems, and integrated technology solutions for modern industry.
            </p>

            {/* Social Media Links */}
            {socialLinks.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((link) => {
                    const Icon = iconMap[link.platform.toLowerCase()];
                    if (!Icon) return null;
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-[rgba(0,188,212,0.12)] border border-[rgba(0,188,212,0.35)] flex items-center justify-center text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0a192f] transition-all duration-200 hover:shadow-[0_0_15px_rgba(0,188,212,0.4)] transform hover:scale-110"
                        title={link.platform}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--text-heading)] mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-[var(--text-dark)]">
              <li><Link href="/" className="hover:text-[var(--accent)]">Home</Link></li>
              <li><Link href="/about" className="hover:text-[var(--accent)]">About Us</Link></li>
              <li><Link href="/news" className="hover:text-[var(--accent)]">News</Link></li>
              <li><Link href="/solution" className="hover:text-[var(--accent)]">Solutions</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--accent)]">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--text-heading)] mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-[var(--text-dark)]">
              <li className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[rgba(0,188,212,0.12)] border border-[rgba(0,188,212,0.35)] flex items-center justify-center text-[var(--accent)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-[var(--text-heading)]">Email: </span>
                  <a href="mailto:1357885979@qq.com" className="hover:text-[var(--accent)]">1357885979@qq.com</a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[rgba(0,188,212,0.12)] border border-[rgba(0,188,212,0.35)] flex items-center justify-center text-[var(--accent)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2zm5 14h.01" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-[var(--text-heading)]">Phone: </span>
                  <a href="tel:+8618123698903" className="hover:text-[var(--accent)]">+86 181 2369 8903</a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[rgba(0,188,212,0.12)] border border-[rgba(0,188,212,0.35)] flex items-center justify-center text-[var(--accent)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11a3 3 0 100-6 3 3 0 000 6zm0 0c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-[var(--text-heading)]">Address: </span>
                  <span>2/F, No.4, Lane 5, Yangzaixi, Xinqiao, Baoan, Shenzhen, Guangdong, China</span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--text-heading)] mb-3">Get in touch</h4>
            <p className="text-sm text-[var(--text-dark)] mb-4">
              Have a project or need technical support? Reach out to our team.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-[var(--accent)] text-[#0a192f] text-sm font-semibold hover:shadow-[0_0_15px_rgba(0,188,212,0.4)] transform hover:scale-[1.02] transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-[rgba(0,188,212,0.15)] pt-4 flex flex-col md:flex-row items-center justify-between text-xs text-[var(--text-dark)]">
          <span>© {new Date().getFullYear()} KND Intelligent Hardware. All rights reserved.</span>
          <span className="mt-2 md:mt-0">B2B AR hardware & precision parts platform.</span>
        </div>
      </div>
    </footer>
  );
}
