import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

const slides = [
  {
    id: 1,
    badge: "🔥 Summer Tech Drop 2026",
    titlePrefix: "Next-Gen Devices & ",
    titleHighlight: "Smart Gear",
    description:
      "Upgrade your daily workflow with top-tier laptops, high-fidelity wireless audio, and flagship camera gear.",
    ctaText: "Explore Tech Catalog",
    image: "/hero/slide1.jpg",
  },
  {
    id: 2,
    badge: "✨ Curated Lifestyle Essentials",
    titlePrefix: "Everything You Love, ",
    titleHighlight: "Delivered Faster",
    description:
      "Discover trending lifestyle items, designer sneakers, and everyday essentials curated for your modern aesthetic.",
    ctaText: "Shop Trending Now",
    image: "/hero/slide2.jpg",
  },
  {
    id: 3,
    badge: "💎 Premium Luxury Collection",
    titlePrefix: "Elevate Your Everyday ",
    titleHighlight: "Personal Style",
    description:
      "Explore handpicked luxury leather goods, signature timepieces, and exclusive designer fragrances.",
    ctaText: "View Luxury Collection",
    image: "/hero/slide3.jpg",
  },
];

export const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 5-second automatic slide transition using functional state update
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-white text-slate-800 min-h-[440px] sm:min-h-[480px] flex items-center group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Light Ambient Color Blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-1/4 w-96 h-96 bg-violet-100/60 rounded-full blur-3xl pointer-events-none" />

      {/* Slide Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 py-10">
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all duration-700 ${
                isActive ? "opacity-100 flex lg:grid" : "hidden opacity-0"
              }`}
            >
              {/* Left Column: Headline, Description & CTAs (7 cols) */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-full shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{slide.badge}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-display text-slate-900">
                  {slide.titlePrefix}
                  <span className="text-brand-gradient">{slide.titleHighlight}</span>
                </h1>

                <p className="text-sm sm:text-base text-slate-600 max-w-xl font-medium leading-relaxed">
                  {slide.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="#catalog-grid"
                    onClick={() => {
                      const el = document.getElementById("catalog-grid");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-6 py-3.5 bg-brand-gradient text-white rounded-2xl text-xs sm:text-sm font-bold shadow-brand-glow shadow-brand-glow-hover hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <div className="hidden sm:flex items-center gap-6 pl-4 border-l border-slate-200 text-xs font-semibold text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-indigo-600" />
                      <span>Free Express Shipping</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>100% Authentic</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: 3D Showcase Image Card (5 cols) */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-50 shadow-2xl group/img">
                  <img
                    src={slide.image}
                    alt={slide.titlePrefix + slide.titleHighlight}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Left / Right Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 border border-slate-200/90 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md hover:scale-110"
        title="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 border border-slate-200/90 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md hover:scale-110"
        title="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentSlide
                ? "w-8 bg-brand-gradient shadow-brand-glow"
                : "w-2 bg-slate-200 hover:bg-slate-300"
            }`}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* 5-second Timer Progress Line Bar at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 z-30 overflow-hidden">
        <div
          key={currentSlide}
          className={`h-full bg-brand-gradient ${
            !isPaused ? "animate-progress" : "w-full"
          }`}
          style={{
            animation: !isPaused ? "slideProgress 5000ms linear infinite" : "none",
          }}
        />
      </div>
    </div>
  );
};

export default HeroSlider;
