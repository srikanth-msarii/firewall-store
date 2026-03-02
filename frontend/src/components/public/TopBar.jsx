import React from 'react';
import { Globe, Phone, Mail, MessageCircle, ChevronDown } from 'lucide-react';

export const TopBar = () => {
  return (
    <div className="hidden border-b border-gray-200 bg-gray-50 text-xs text-gray-600 lg:block">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-8 items-center justify-between">
          <div className="flex items-center space-x-4">
            <a href="#" className="flex items-center hover:text-blue-600">
              <MessageCircle size={14} className="mr-1.5" /> Live Chat
            </a>
            <a href="mailto:sales@example.com" className="flex items-center hover:text-blue-600">
              <Mail size={14} className="mr-1.5" /> sales@Firewall Store
            </a>
            <a href="tel:+18001234567" className="flex items-center hover:text-blue-600">
              <Phone size={14} className="mr-1.5" /> +1-800-123-4567
            </a>
          </div>
          <div className="flex items-center">
            {/* This would have a dropdown menu in a real app */}
            <a href="#" className="flex items-center hover:text-blue-600">
              <Globe size={14} className="mr-1.5" /> Language
              <ChevronDown size={14} className="ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
