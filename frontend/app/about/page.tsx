'use client';

import { useEffect, useState } from 'react';
import { FaVrCardboard, FaFlask, FaNetworkWired, FaCogs, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const advantages = [
    {
      title: 'AR Technology Innovation',
      description: 'Advanced augmented-reality technology for precision metal parts manufacturing',
      icon: FaVrCardboard,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'R&D Strength',
      description: 'Strong scientific research capabilities and technical innovation excellence',
      icon: FaFlask,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Intelligent Platform',
      description: 'Comprehensive technology integration with intelligent platform development',
      icon: FaNetworkWired,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Precision Manufacturing',
      description: 'High-precision mechanical components with advanced interaction methods',
      icon: FaCogs,
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  const stats = [
    { value: '15+', label: 'Years Innovation', prefix: '' },
    { value: '100+', label: 'Patents Filed', prefix: '' },
    { value: '50+', label: 'R&D Engineers', prefix: '' },
    { value: 'ISO 9001', label: 'Quality Certified', prefix: '' }
  ];

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
              Engineering Excellence
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              ABOUT
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">
                KND
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Leading intelligent hardware innovation with AR technology and precision manufacturing
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-[#0a192f] via-[#10243c] to-[#0a192f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center bg-[#1b2a4a] border border-[rgba(0,188,212,0.25)] rounded-2xl p-6 shadow-[0_0_15px_rgba(0,188,212,0.12)] ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-[var(--text-heading)] mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#06b6d4]">
                    {stat.prefix}{stat.value}
                  </span>
                </div>
                <div className="text-[var(--text-dark)] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-24 bg-[#0d1c34]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-4xl md:text-5xl font-bold text-[var(--text-heading)] mb-8 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'
              }`}
              style={{ animationDelay: '200ms' }}
            >
              Company
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#06b6d4]">
                Overview
              </span>
            </h2>

            <div className={`bg-[#1b2a4a] rounded-3xl border border-[rgba(0,188,212,0.25)] shadow-[0_0_25px_rgba(0,188,212,0.2)] p-12 ${isVisible ? 'animate-fadeIn' : 'opacity-0'
              }`}
              style={{ animationDelay: '400ms' }}
            >
              <p className="text-xl text-[var(--text-light)] leading-relaxed mb-6">
                Founded in 2010, Kind and Divine Technology Corp., Ltd. is an intelligent hardware company that develops augmented-reality precision metal parts and related mechanical components, interaction methods and contents, integrating comprehensive technology, intelligent platform construction and operation, intelligent hardware development and operation promotion.
              </p>
              <p className="text-xl text-[var(--text-light)] leading-relaxed">
                The company has strong scientific and technological strength and strong scientific research strength. We are committed to innovation and excellence in the field of intelligent hardware.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-24 bg-gradient-to-b from-[#0a192f] via-[#10243c] to-[#0a192f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className={`text-4xl md:text-5xl font-bold text-[var(--text-heading)] mb-6 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'
              }`}
              style={{ animationDelay: '600ms' }}
            >
              Our Core
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#06b6d4]">
                Competencies
              </span>
            </h2>
            <p className={`text-xl text-[var(--text-dark)] max-w-3xl mx-auto ${isVisible ? 'animate-fadeIn' : 'opacity-0'
              }`}
              style={{ animationDelay: '800ms' }}
            >
              Our innovative technologies and research strengths driving intelligent hardware excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div
                key={index}
                className={`group relative bg-[#1b2a4a] rounded-2xl border border-[rgba(0,188,212,0.25)] hover:border-[var(--primary-blue)] hover:shadow-[0_0_30px_rgba(0,188,212,0.4)] transition-all duration-500 transform hover:-translate-y-2 overflow-hidden ${isVisible ? 'animate-fadeInUp' : 'opacity-0'
                  }`}
                style={{ animationDelay: `${(index + 10) * 150}ms` }}
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${advantage.gradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                {/* White content panel to keep text readable */}
                <div className="relative m-1 p-8 bg-[#1b2a4a]/95 rounded-2xl text-center">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-[70px] h-[70px] rounded-full bg-[rgba(0,188,212,0.1)] border-2 border-[var(--primary-blue)] text-[var(--primary-blue)] text-[28px] mb-6 group-hover:bg-[var(--primary-blue)] group-hover:text-white group-hover:shadow-[0_0_20px_rgba(0,188,212,0.6)] transition-all duration-300 shadow-[0_0_15px_rgba(0,188,212,0.2)]`}>
                    <advantage.icon />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-[var(--text-heading)] mb-4 group-hover:text-[var(--primary-blue)] group-hover:[text-shadow:0_0_10px_rgba(0,188,212,0.8)] transition-all duration-300">
                    {advantage.title}
                  </h3>

                  <p className="text-[var(--text-dark)] leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-[#0d1c34]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-4xl md:text-5xl font-bold text-[var(--text-heading)] mb-12 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'
              }`}
              style={{ animationDelay: '1000ms' }}
            >
              Contact
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#06b6d4]">
                Information
              </span>
            </h2>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${isVisible ? 'animate-fadeIn' : 'opacity-0'
              }`}
              style={{ animationDelay: '1200ms' }}
            >
              <div className="bg-[#1b2a4a] rounded-2xl border border-[rgba(0,188,212,0.25)] p-8 hover:border-[rgba(0,188,212,0.5)] transition-all duration-300 shadow-[0_0_20px_rgba(0,188,212,0.15)]">
                <div className="w-[90px] h-[90px] mx-auto bg-[rgba(0,188,212,0.1)] border-2 border-[var(--primary-blue)] rounded-full flex items-center justify-center text-[var(--primary-blue)] text-[36px] mb-6 hover:bg-[var(--primary-blue)] hover:text-white transition-all duration-300">
                  <FaEnvelope />
                </div>
                <h3 className="font-bold text-[var(--text-heading)] mb-2 text-lg">Email</h3>
                <p className="text-[var(--text-dark)] text-base">1357885979@qq.com</p>
              </div>

              <div className="bg-[#1b2a4a] rounded-2xl border border-[rgba(0,188,212,0.25)] p-8 hover:border-[rgba(0,188,212,0.5)] transition-all duration-300 shadow-[0_0_20px_rgba(0,188,212,0.15)]">
                <div className="w-[90px] h-[90px] mx-auto bg-[rgba(0,188,212,0.1)] border-2 border-[var(--primary-blue)] rounded-full flex items-center justify-center text-[var(--primary-blue)] text-[36px] mb-6 hover:bg-[var(--primary-blue)] hover:text-white transition-all duration-300">
                  <FaPhone />
                </div>
                <h3 className="font-bold text-[var(--text-heading)] mb-2 text-lg">Phone</h3>
                <p className="text-[var(--text-dark)] text-base">+86 181 2369 8903</p>
              </div>

              <div className="bg-[#1b2a4a] rounded-2xl border border-[rgba(0,188,212,0.25)] p-8 hover:border-[rgba(0,188,212,0.5)] transition-all duration-300 shadow-[0_0_20px_rgba(0,188,212,0.15)]">
                <div className="w-[90px] h-[90px] mx-auto bg-[rgba(0,188,212,0.1)] border-2 border-[var(--primary-blue)] rounded-full flex items-center justify-center text-[var(--primary-blue)] text-[36px] mb-6 hover:bg-[var(--primary-blue)] hover:text-white transition-all duration-300">
                  <FaMapMarkerAlt />
                </div>
                <h3 className="font-bold text-[var(--text-heading)] mb-2 text-lg">Address</h3>
                <p className="text-[var(--text-dark)] text-base leading-relaxed break-words">2/F,No.4,Lane 5,Yangzaixi,Xinqiao,Baoan,Shenzhen,Guangdong,China</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
