import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const HERO_SLIDES = [
  '/assets/images/switch-solutions_banner.webp',
  '/assets/images/FireWall_banner.jpg',
  '/assets/images/banner3.png',
];

const ROTATE_MS = 4000;

export const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return undefined;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-[500px] w-full overflow-hidden text-white">
      {HERO_SLIDES.map((src, i) => {
        const isActive = i === activeIndex;
        return (
          <img
            key={src}
            src={src}
            alt=""
            loading="eager"
            decoding="async"
            aria-hidden={!isActive}
            className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        );
      })}

      <div
        className="pointer-events-none absolute inset-0 z-1 bg-linear-to-r from-black/55 via-black/35 to-black/10"
        aria-hidden
      />

      <div className="relative z-10 container mx-auto flex h-full max-w-7xl px-4">
        <div className="flex h-full max-w-xl flex-col justify-center pt-24">
          <span className="mb-2 text-lg font-semibold text-blue-300">
            Protect What Matters Most
          </span>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Advanced security solutions designed for reliability and scalability.
          </h1>
          <p className="mt-4 text-xl text-gray-200">
            A new generation of server technology
          </p>
          <div className="mt-8">
            <a
              href="#featured"
              className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3
                         text-base font-semibold text-white shadow-lg
                         transition-transform hover:scale-105"
            >
              Explore Products
              <ArrowRight size={20} className="ml-2" />
            </a>
          </div>
        </div>
      </div>

      {HERO_SLIDES.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2"
          role="tablist"
          aria-label="Hero slides"
        >
          {HERO_SLIDES.map((_, i) => (
            <button
              key={`hero-slide-${i}`}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              className={`h-2 rounded-full transition-all ${
                i === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
