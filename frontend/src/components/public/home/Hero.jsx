import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const HERO_SLIDES = [
  {
    src: '/assets/images/switch-solutions_banner.webp',
    theme: 'dark',
    eyebrow: 'Protect What Matters Most',
    title: 'Advanced security solutions designed for reliability and scalability.',
    subtitle: 'A new generation of server technology',
    showCta: true,
  },
  {
    src: '/assets/images/herobannar2.jpg',
    theme: 'light',
    title: (
      <>
        One Stop solution For Your
        <br />
        <span className="font-bold text-blue-600">All Kinds of Firewall requirements</span>
      </>
    ),
    subtitle: 'Solution that help you to Avoid Threats',
    showDivider: true,
    showCta: true,
  },
];

const ROTATE_MS = 4000;

export const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = HERO_SLIDES[activeIndex];
  const isLight = slide.theme === 'light';

  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return undefined;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`relative h-[500px] w-full overflow-hidden ${
        isLight ? 'text-gray-900' : 'text-white'
      }`}
    >
      {HERO_SLIDES.map((item, i) => {
        const isActive = i === activeIndex;
        return (
          <img
            key={item.src}
            src={item.src}
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

      {!isLight && (
        <div
          className="pointer-events-none absolute inset-0 z-1 bg-linear-to-r from-black/55 via-black/35 to-black/10"
          aria-hidden
        />
      )}

      <div className="relative z-10 container mx-auto flex h-full max-w-7xl px-4">
        <div className="flex h-full max-w-xl flex-col justify-center pt-24">
          {slide.eyebrow && (
            <span
              className={`mb-2 text-lg font-semibold ${
                isLight ? 'text-blue-600' : 'text-blue-300'
              }`}
            >
              {slide.eyebrow}
            </span>
          )}
          <h1
            className={`tracking-tight ${
              isLight
                ? 'text-3xl font-normal leading-snug md:text-4xl'
                : 'text-4xl font-bold md:text-5xl'
            }`}
          >
            {slide.title}
          </h1>
          {slide.showDivider && (
            <hr className="mt-4 w-2/5 max-w-xs border-t border-gray-900" />
          )}
          {slide.subtitle && (
            <p
              className={`mt-4 text-xl ${
                isLight ? 'text-gray-800' : 'text-gray-200'
              }`}
            >
              {slide.subtitle}
            </p>
          )}
          {slide.showCta && (
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
          )}
        </div>
      </div>

      {HERO_SLIDES.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2"
          role="tablist"
          aria-label="Hero slides"
        >
          {HERO_SLIDES.map((item, i) => (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              className={`h-2 rounded-full transition-all ${
                i === activeIndex
                  ? `w-8 ${isLight ? 'bg-blue-600' : 'bg-white'}`
                  : isLight
                    ? 'w-2 bg-gray-400/60 hover:bg-gray-500/80'
                    : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
