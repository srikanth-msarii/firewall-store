import React from 'react';

// Define the base CDN URL
const cdnUrl = 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/';

export const PartnerLogos = () => {
  return (
    <div className="w-full border-b border-gray-200 bg-gray-50 py-3">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          
          {/* --- Individual Logo Containers for Custom Adjustment --- */}
          {/* You can now change 'w-32' or 'h-10' for each logo */}
          
          {/* Dell */}
          <div
            key="Dell"
            className="group flex h-10 w-32 items-center justify-center px-2"
          >
            <img
              src={`${cdnUrl}dell.svg`}
              alt="Dell logo"
              className="h-full w-auto object-contain filter grayscale
                         opacity-60 transition-all duration-300
                         group-hover:grayscale-0 group-hover:opacity-100"
            />
          </div>

          {/* HPE (using 'hp' slug as you provided) */}
          <div
            key="HPE"
            className="group flex h-10 w-32 items-center justify-center px-2"
          >
            <img
              src={`${cdnUrl}hp.svg`}
              alt="HPE logo"
              className="h-full w-auto object-contain filter grayscale
                         opacity-60 transition-all duration-300
                         group-hover:grayscale-0 group-hover:opacity-100"
            />
          </div>

          {/* Cisco */}
          <div
            key="Cisco"
            className="group flex h-12 w-32 items-center justify-center px-2 -my-2"
          >
            <img
              src={`${cdnUrl}cisco.svg`}
              alt="Cisco logo"
              className="h-full w-auto object-contain filter grayscale
                         opacity-60 transition-all duration-300
                         group-hover:grayscale-0 group-hover:opacity-100"
            />
          </div>

          {/* Juniper Networks */}
          <div
            key="Juniper"
            className="group flex h-16 w-32 items-center justify-center px-2 -my-4"
          >
            <img
              src={`${cdnUrl}junipernetworks.svg`}
              alt="Juniper Networks logo"
              className="h-full w-auto object-contain filter grayscale
                         opacity-60 transition-all duration-300
                         group-hover:grayscale-0 group-hover:opacity-100"
            />
          </div>

          {/* Fortinet */}
          <div
            key="Fortinet"
            className="group flex h-10 w-32 items-center justify-center px-2"
          >
            <img
              src={`${cdnUrl}fortinet.svg`}
              alt="Fortinet logo"
              className="h-full w-auto object-contain filter grayscale
                         opacity-60 transition-all duration-300
                         group-hover:grayscale-0 group-hover:opacity-100"
            />
          </div>
          
          {/* Palo Alto Networks */}
          <div
            key="Palo Alto"
            className="group flex h-10 w-32 items-center justify-center px-2"
          >
            <img
              src={`${cdnUrl}paloaltonetworks.svg`}
              alt="Palo Alto Networks logo"
              className="h-full w-auto object-contain filter grayscale
                         opacity-60 transition-all duration-300
                         group-hover:grayscale-0 group-hover:opacity-100"
            />
          </div>

          {/* Aruba (Added back) */}
          <div
            key="Aruba"
            className="group flex h-12 w-32 items-center justify-center px-2 -my-2"
          >
            <img
              src={`${cdnUrl}supermicro.svg`}
              alt="Aruba logo"
              className="h-full w-auto object-contain filter grayscale
                         opacity-60 transition-all duration-300
                         group-hover:grayscale-0 group-hover:opacity-100"
            />
          </div>

        </div>
      </div>
    </div>
  );
};