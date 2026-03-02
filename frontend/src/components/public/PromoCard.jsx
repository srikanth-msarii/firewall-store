import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, ArrowRight } from 'lucide-react';

export const PromoCard = ({ promo }) => {
  return (
    <div className="flex transform flex-col overflow-hidden rounded-xl bg-white
                   shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      <div className="relative">
        <img 
          src={promo.image} 
          alt={promo.title} 
          className="h-48 w-full object-cover"
        />
        <span className="absolute top-3 left-3 inline-flex items-center rounded-full 
                       bg-red-500 px-3 py-1 text-xs font-semibold text-white">
          <Tag className="mr-1.5 h-4 w-4" />
          {promo.dealText}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{promo.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{promo.model}</p>
          <p className="mt-4 text-base text-gray-600">{promo.description}</p>
        </div>
        <Link 
          to={promo.link}
          className="mt-6 inline-flex w-full items-center justify-center rounded-md
                     border border-blue-600 bg-white px-5 py-2.5 text-sm
                     font-semibold text-blue-600 transition-colors
                     hover:bg-blue-600 hover:text-white"
        >
          View Deal
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
