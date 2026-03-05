import React from 'react';

// List of logo filenames (assuming they are in /assets/images/logos/)
const logos = [
  'GlobalLogic-Logo.png', 'Highradius_Logo.png', 'Kl University_Logo.png', 'Natco_Pharma_Logo.svg',
];

export const TrustedBy = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="text-center text-2xl font-light text-gray-700">
          Trusted by over <span className="font-semibold text-orange-500">1000+</span> customers globally
        </h2>
        <div className="ms-36">
          <div className="mt-10 grid grid-cols-3 items-center justify-items-center gap-x-8 gap-y-10 sm:grid-cols-4 md:grid-cols-6">
            <div className="flex h-12 w-32 items-center justify-center">
              <img
                src={`/assets/images/clients/Cyient_logo.svg`}
                alt="Cyient logo"
                className="h-full w-full object-contain p-1 bg-gray-500 rounded"
              />
            </div>
            {logos.map((logoFile) => (
              <div key={logoFile} className="flex h-12 w-32 items-center justify-center">
                <img
                  src={`/assets/images/clients/${logoFile}`}
                  alt={logoFile.split('.')[0]}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};