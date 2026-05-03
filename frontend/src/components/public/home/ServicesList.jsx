import React from 'react';
import { Link } from 'react-router-dom';

// Base URL for images
const baseUrl = "/assets/images/";

// Data for the four service blocks with real image paths
const services = [
  {
    category: 'Networking',
    title: 'Fostering Connectivity with Scalable Infrastructure',
    description: 'Customer-focused networking offers value with advanced protocols, seamless campus connectivity, and customized office networks for improved communication and collaboration.',
    linkText: 'Ask Experts >',
    linkUrl: '/inquiry',
    imageUrl: `${baseUrl}/solution_1.webp`
  },
  {
    category: 'Data',
    title: 'Building a Data-First, Intelligent IT Foundation',
    description: 'Firewall-store.com delivers high-performance infrastructure and security solutions enabling business continuity, data-driven insights, AI readiness, and scalable growth.',
    linkText: 'Get Solutions >',
    linkUrl: '/inquiry',
    imageUrl: `${baseUrl}/solution_2.webp`
  },
  {
    category: 'Optical Network',
    title: 'Enhancing Speed and Reliability through Advanced Technology',
    description: 'Optical network solutions combine OLTs, ODNs, and ONUs for high-speed, reliable connectivity, boosting performance and efficiency.',
    linkText: 'Ask Experts >',
    linkUrl: '/inquiry',
    imageUrl: `${baseUrl}/solution_3.webp`
  },
  {
    category: 'Cloud',
    title: 'Delivering Performance at Cloud Scale',
    description: 'Firewall-store.com offers scalable, secure, and cost-effective cloud solutions across compute, storage, and networking to power agility and business growth.',
    linkText: 'Learn Details >',
    linkUrl: '/inquiry',
    imageUrl: `${baseUrl}/solution_4.webp`
  }
];

export const ServicesList = () => {
  return (
    // 1. Set the background to black
    <section className="bg-black py-16 text-white">
      <div className="container mx-auto max-w-7xl px-4">
        {services.map((service, index) => {
          // This reverses the grid order for even-numbered items (index 1 and 3)
          const isReversed = index % 2 === 1;
          return (
            <div key={service.title} className="grid grid-cols-1 items-center gap-12 py-8 md:grid-cols-2">
              {/* Image Column */}
              <div className={`w-full ${isReversed ? 'md:order-2' : ''}`}>
                <img src={service.imageUrl} alt={service.title} className="w-full rounded-lg" />
              </div>
              
              {/* Text Column */}
              <div className={`w-full ${isReversed ? 'md:order-1' : ''} ${isReversed ? 'md:pr-12' : 'md:pl-12'}`}>
                {/* Translated text classes:
                  h2023_font_size_14_to_m_12 -> text-xs md:text-sm
                  h2023_font_size_32_to_m_24 -> text-2xl md:text-[2rem]
                  h2023_font_size_16_to_m_14 -> text-sm md:text-base
                */}
                <span className="text-xs font-semibold text-blue-400 md:text-sm">{service.category}</span>
                <h3 className="mt-2 text-2xl font-bold text-white md:text-[2rem]">{service.title}</h3>
                <p className="my-4 text-sm text-gray-300 md:text-base">{service.description}</p>
                <Link to={service.linkUrl} className="text-sm font-semibold text-blue-400 no-underline hover:underline md:text-base">
                  {service.linkText}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};