'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaMicrochip, FaCube, FaLightbulb, FaRobot } from 'react-icons/fa';
import { getApiBase } from './lib/api';

interface CarouselItem {
  id?: number;
  title: string;
  image_url: string;
  alt_text: string;
  description: string;
  position?: string;
  rotation?: number;
  image_width?: number;
  image_height?: number;
}

const DEFAULT_SLIDES: CarouselItem[] = [
  {
    title: 'AR Precision Parts',
    image_url:
      'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt_text: 'AR precision parts in production',
    description: 'High-precision AR-ready components for demanding industrial scenarios.',
    rotation: 0,
  },
  {
    title: 'Intelligent Platform',
    image_url:
      'https://images.pexels.com/photos/1462935/pexels-photo-1462935.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt_text: 'Intelligent platform dashboard',
    description: 'Unified platform connecting devices, data, and operations securely.',
    rotation: 0,
  },
  {
    title: 'Smart Mechanical Systems',
    image_url:
      'https://images.pexels.com/photos/1337247/pexels-photo-1337247.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt_text: 'Smart mechanical systems in operation',
    description: 'Mechanical systems enhanced with sensing, control, and analytics.',
    rotation: 0,
  },
];

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  // 顶部 Hero 轮播图数据
  const [heroSlides, setHeroSlides] = useState<CarouselItem[]>(DEFAULT_SLIDES);
  const [heroCurrentIndex, setHeroCurrentIndex] = useState(0);

  // 底部 Our Solutions 区块轮播图数据
  const [bottomSlides, setBottomSlides] = useState<CarouselItem[]>([]);
  const [bottomCurrentIndex, setBottomCurrentIndex] = useState(0);
  const [bottomPaused, setBottomPaused] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    const mapItems = (items: CarouselItem[]): CarouselItem[] =>
      items.map((item) => ({
        id: item.id,
        title: item.title,
        image_url: item.image_url,
        alt_text: item.alt_text,
        description: item.description || '',
        position: item.position,
        rotation: item.rotation ?? 0,
        image_width: item.image_width ?? 0,
        image_height: item.image_height ?? 0,
      }));

    const fetchSlides = async () => {
      try {
        const baseUrl = getApiBase();

        const [topRes, bottomRes] = await Promise.all([
          fetch(`${baseUrl}/api/carousels?position=top`),
          fetch(`${baseUrl}/api/carousels?position=bottom`),
        ]);

        if (topRes.ok) {
          const data = (await topRes.json()) as CarouselItem[];
          if (Array.isArray(data) && data.length > 0) {
            setHeroSlides(mapItems(data));
            setHeroCurrentIndex(0);
          }
        }

        if (bottomRes.ok) {
          const data = (await bottomRes.json()) as CarouselItem[];
          if (Array.isArray(data) && data.length > 0) {
            setBottomSlides(mapItems(data));
            setBottomCurrentIndex(0);
          }
        }
      } catch (error) {
        console.error('Failed to load homepage carousels:', error);
      }
    };

    fetchSlides();
  }, []);

  // 顶部 Hero 自动轮播
  useEffect(() => {
    const count = heroSlides.length;
    if (count <= 1) return;

    const interval = setInterval(() => {
      setHeroCurrentIndex((prev) => (prev + 1) % count);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides]);

  // 底部 Solutions 连续滚动（展示 4 张，>4 时流畅循环；悬停暂停）
  useEffect(() => {
    const slidesCount = bottomSlides.length;
    const slidesToShow = Math.min(slidesCount, 4);
    const maxSlideIndex = Math.max(slidesCount - slidesToShow, 0);

    // 连续滚动：仅当大于 4 张且未暂停时启用
    if (!bottomPaused && slidesCount > 4) {
      let rafId: number;
      const SPEED = 0.25; // px/frame
      const ITEM_FULL_WIDTH = 260 + 16; // 卡片宽 + 间距
      const totalWidth = slidesCount * ITEM_FULL_WIDTH;

      const step = () => {
        setBottomOffset((prev) => {
          const next = prev + SPEED;
          return next >= totalWidth ? next - totalWidth : next;
        });
        rafId = requestAnimationFrame(step);
      };

      rafId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(rafId);
    }

    // <=4 张时保持步进轮播
    if (slidesCount === 0 || slidesToShow === 0) return;
    const interval = setInterval(() => {
      setBottomCurrentIndex((prev) => {
        if (slidesCount <= slidesToShow) {
          return 0;
        }
        return prev >= maxSlideIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [bottomSlides, bottomPaused]);

  // 当列表变化时重置滚动偏移
  useEffect(() => {
    setBottomOffset(0);
  }, [bottomSlides.length]);

  const services = [
    {
      id: 1,
      title: 'ENGINEERING SUPPORT',
      description:
        'Technological progress in human civilization demands higher precision and absolute unwavering faith.',
      icon: FaMicrochip,
    },
    {
      id: 2,
      title: 'PROTOTYPING SERVICES',
      description:
        'Initial fusion is quite essential for the creators, we use the latest methods.',
      icon: FaCube,
    },
    {
      id: 3,
      title: 'FEASIBILITY STUDY',
      description: 'Imagination is another step for creation, we can see ideas into product realization.',
      icon: FaLightbulb,
    },
    {
      id: 4,
      title: 'AI & AUTOMATION',
      description:
        'When there is a necessity to provide the services without charge, we are committed absolutely.',
      icon: FaRobot,
    },
  ];

  const stats = [
    { value: '15+', label: 'Years Innovation', prefix: '' },
    { value: '100+', label: 'Patents Filed', prefix: '' },
    { value: '50+', label: 'R&D Engineers', prefix: '' },
    { value: 'ISO 9001', label: 'Technical Support Certified', prefix: '' }
  ];

  const activeHeroSlide = heroSlides.length
    ? heroSlides[heroCurrentIndex % heroSlides.length]
    : DEFAULT_SLIDES[0];
  const useMarquee = bottomSlides.length > 4;
  const MARQUEE_ITEM_WIDTH = 260;
  const MARQUEE_ITEM_GAP = 16;
  const marqueeSlides = useMarquee ? [...bottomSlides, ...bottomSlides] : bottomSlides;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero Section (full background from top carousel) */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(10,25,47,0.78), rgba(10,25,47,0.88)), url('${activeHeroSlide.image_url}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,188,212,0.12)_1px,transparent_1px)] [background-size:22px_22px] opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(0,188,212,0.25),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(138,43,226,0.18),transparent_30%)]" />
        <div className="relative z-10 max-w-5xl px-6 md:px-10">
          <p className="font-[Orbitron] text-sm md:text-base uppercase tracking-[0.2em] text-[var(--primary-blue)] mb-5" style={{ textShadow: '0 0 5px var(--primary-blue)' }}>Engineering Excellence</p>
          <h1 className="font-[Orbitron] text-4xl md:text-6xl lg:text-7xl text-[var(--text-heading)] leading-tight mb-8" style={{ textShadow: '0 0 20px rgba(0, 188, 212, 0.8)' }}>
            Intelligent Hardware · AR Precision
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-dark)] max-w-3xl mx-auto mb-10">
            High-precision AR-ready components, smart mechanical systems, and integrated platforms powering modern industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn-slide relative overflow-hidden px-8 py-3 border-2 border-[var(--primary-blue)] text-[var(--primary-blue)] uppercase tracking-wide text-sm rounded-none hover:bg-[var(--primary-blue)] hover:text-white transition-all duration-300 box-glow"
            >
              <span className="relative z-10">Get Started Now</span>
            </Link>
            <Link
              href="/news"
              className="btn-slide px-8 py-3 text-sm uppercase tracking-wide rounded-none bg-transparent border-2 border-[var(--primary-blue)] text-[var(--primary-blue)] hover:bg-[var(--primary-blue)] hover:text-white transition-all duration-300"
            >
              New Solution
            </Link>
          </div>
          <div className="mt-6 text-sm text-[var(--text-dark)]">
            {activeHeroSlide.title} — {activeHeroSlide.description}
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              type="button"
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.3)] text-white hover:bg-white/10"
              onClick={() => heroSlides.length && setHeroCurrentIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next slide"
              className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.3)] text-white hover:bg-white/10"
              onClick={() => heroSlides.length && setHeroCurrentIndex((prev) => (prev + 1) % heroSlides.length)}
            >
              ›
            </button>
          </div>
          <div className="mt-4 flex justify-center space-x-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                className={`h-2 rounded-full transition-all ${idx === heroCurrentIndex ? 'w-6 bg-[var(--accent)]' : 'w-2 bg-white/40'}`}
                onClick={() => setHeroCurrentIndex(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-[#0a192f] via-[#10243c] to-[#0a192f] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,188,212,0.12),transparent_35%),radial-gradient(circle_at_80%_60%,rgba(138,43,226,0.12),transparent_30%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center bg-[#1b2a4a] border border-[rgba(0,188,212,0.25)] rounded-2xl p-6 shadow-[0_0_15px_rgba(0,188,212,0.12)] ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-[var(--text-heading)] mb-2" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 10px rgba(0, 188, 212, 0.8)' }}>
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

      {/* Services Section */}
      <section className="py-24 bg-[#0a192f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className={`text-4xl md:text-5xl font-bold text-[var(--text-heading)] mb-6 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'
              }`}>
              Our Services
            </h2>
            <p className={`text-xl text-[var(--text-dark)] max-w-3xl mx-auto ${isVisible ? 'animate-fadeIn' : 'opacity-0'
              }`}
              style={{ animationDelay: '200ms' }}
            >
              Engineering support and services that turn ideas into manufacturable, high-quality hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`group relative bg-[#1b2a4a] rounded-2xl border border-[rgba(0,188,212,0.25)] hover:border-[rgba(0,188,212,0.5)] hover:shadow-[0_0_25px_rgba(0,188,212,0.2)] transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'
                  }`}
                style={{ animationDelay: `${(index + 2) * 150}ms` }}
              >
                <div className="relative p-8 bg-[#1b2a4a]/95 rounded-2xl flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-[70px] h-[70px] rounded-full bg-[rgba(0,188,212,0.1)] border-2 border-[var(--primary-blue)] text-[var(--primary-blue)] text-[28px] mb-6 group-hover:bg-[var(--primary-blue)] group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(0,188,212,0.2)]">
                    <service.icon />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-[var(--text-heading)] mb-3 group-hover:text-[var(--accent)] transition-all duration-300">
                    {service.title}
                  </h3>

                  <p className="text-[var(--text-dark)] leading-relaxed text-sm">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Solutions section (grid) */}
      <section className="py-24 bg-gradient-to-b from-[#0a192f] via-[#10243c] to-[#0a192f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`text-3xl md:text-4xl font-bold text-[var(--text-heading)] mb-4 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'
                }`}
            >
              Our Solutions
            </h2>
            <p
              className={`text-lg text-[var(--text-dark)] max-w-2xl mx-auto ${isVisible ? 'animate-fadeIn' : 'opacity-0'
                }`}
              style={{ animationDelay: '200ms' }}
            >
              It is always that the countermeasure is more than the difficulties.
            </p>
          </div>

          {bottomSlides.length === 0 ? (
            <div className="text-center text-[var(--text-dark)] text-sm">
              No solution images configured yet. Please add carousels in the admin panel.
            </div>
          ) : useMarquee ? (
            <div
              className="relative overflow-hidden"
              onMouseEnter={() => setBottomPaused(true)}
              onMouseLeave={() => setBottomPaused(false)}
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a192f] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a192f] to-transparent" />

              <div
                className="flex items-stretch"
                style={{
                  gap: `${MARQUEE_ITEM_GAP}px`,
                  transform: `translateX(-${bottomOffset}px)`,
                  transition: 'none',
                  willChange: 'transform',
                  width: 'max-content',
                }}
              >
                {marqueeSlides.map((slide, index) => (
                  <div
                    key={`${slide.id || slide.title}-${index}`}
                    className="group rounded-xl overflow-hidden border border-[rgba(0,188,212,0.25)] bg-[var(--secondary-blue)] shadow-[0_5px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(0,188,212,0.25)] transition-all duration-300"
                    style={{ minWidth: `${MARQUEE_ITEM_WIDTH}px` }}
                  >
                    <div className="relative w-full overflow-hidden bg-[#020617]" style={{ paddingTop: '100%' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="transition-transform duration-300 group-hover:scale-105"
                          style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: slide.image_width && slide.image_width > 0 ? `${slide.image_width}px` : '100%',
                            maxHeight: slide.image_height && slide.image_height > 0 ? `${slide.image_height}px` : '100%',
                          }}
                        >
                          <img
                            src={slide.image_url}
                            alt={slide.alt_text || slide.title}
                            className="w-full h-full object-contain"
                            style={{ transform: `rotate(${slide.rotation ?? 0}deg)`, transformOrigin: 'center center' }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-5 space-y-2 text-left">
                      <h4 className="font-semibold text-[var(--text-heading)] uppercase text-sm tracking-wide">
                        {slide.title}
                      </h4>
                      {slide.description && (
                        <p className="text-[var(--text-dark)] text-sm leading-relaxed line-clamp-2">
                          {slide.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bottomSlides.map((slide, index) => (
                <div
                  key={index}
                  className="group rounded-xl overflow-hidden border border-[rgba(0,188,212,0.25)] bg-[var(--secondary-blue)] shadow-[0_5px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(0,188,212,0.25)] transition-all duration-300"
                >
                  <div className="relative w-full overflow-hidden bg-[#020617]" style={{ paddingTop: '100%' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="transition-transform duration-300 group-hover:scale-105"
                        style={{
                          width: '100%',
                          height: '100%',
                          maxWidth: slide.image_width && slide.image_width > 0 ? `${slide.image_width}px` : '100%',
                          maxHeight: slide.image_height && slide.image_height > 0 ? `${slide.image_height}px` : '100%',
                        }}
                      >
                        <img
                          src={slide.image_url}
                          alt={slide.alt_text || slide.title}
                          className="w-full h-full object-contain"
                          style={{ transform: `rotate(${slide.rotation ?? 0}deg)`, transformOrigin: 'center center' }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 space-y-2 text-left">
                    <h4 className="font-semibold text-[var(--text-heading)] uppercase text-sm tracking-wide">
                      {slide.title}
                    </h4>
                    {slide.description && (
                      <p className="text-[var(--text-dark)] text-sm leading-relaxed line-clamp-2">
                        {slide.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-[#0d1c34]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid lg:grid-cols-2 gap-10 items-center ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div>
              <p className="font-[Orbitron] text-sm uppercase tracking-[0.2em] text-[var(--accent)] mb-4">Keep in touch</p>
              <h3 className="text-3xl md:text-4xl font-bold text-[var(--text-heading)] mb-4">
                Ready to build your next intelligent hardware solution?
              </h3>
              <p className="text-[var(--text-dark)] leading-relaxed">
                Contact our team for engineering support, rapid prototyping, and full-stack AR integration services.
              </p>
            </div>
            <div className="flex justify-start lg:justify-end space-x-4">
              <Link
                href="/contact"
                className="btn-slide px-7 py-3 rounded-none border-2 border-[var(--primary-blue)] text-[var(--primary-blue)] uppercase tracking-wide text-sm hover:bg-[var(--primary-blue)] hover:text-white transition-all duration-300"
              >
                Contact Us
              </Link>
              <Link
                href="/news"
                className="btn-slide px-7 py-3 rounded-none bg-transparent border-2 border-[var(--primary-blue)] text-[var(--primary-blue)] uppercase tracking-wide text-sm hover:bg-[var(--primary-blue)] hover:text-white transition-all duration-300"
              >
                View News
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
