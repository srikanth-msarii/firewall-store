import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Mail, Phone, CreditCard, 
  Facebook, Linkedin, Youtube, Twitter 
} from 'lucide-react';

// 1. Updated payment icon color
const PaymentIcon = ({ name }) => (
  <span className="text-blue-300">{name}</span>
);

export const Footer = () => {
  return (
    // 2. Changed to a branded dark blue color
    <footer className="bg-blue-900 text-blue-200">
      {/* Top Section: Multi-column layout */}
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          
          {/* Column 1: Products */}
          <div>
            {/* 3. Headings are now white */}
            <h4 className="mb-4 font-semibold uppercase text-white">Products</h4>
            <ul className="space-y-2 text-sm">
              {/* 4. Link hover is brighter */}
              <li><Link to="/products?category=Routers" className="hover:text-white">Routers</Link></li>
              <li><Link to="/products?category=Switches" className="hover:text-white">Switches</Link></li>
              <li><Link to="/products?category=Firewalls" className="hover:text-white">Firewalls</Link></li>
              <li><Link to="/products?category=Servers" className="hover:text-white">Servers</Link></li>
              <li><Link to="/products?category=Wireless" className="hover:text-white">Wireless</Link></li>
            </ul>
          </div>

          {/* Column 2: Support */}
          <div>
            <h4 className="mb-4 font-semibold uppercase text-white">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/inquiry" className="hover:text-white">Ask the Expert</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
              <li><Link to="/warranty" className="hover:text-white">Warranty</Link></li>
            </ul>
          </div>

          
          {/* Column 3: About Us */}
          <div>
            <h4 className="mb-4 font-semibold uppercase text-white">About Us</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/about#advantages" className="hover:text-white">Our Advantages</Link></li>
              <li><Link to="/about#leadership" className="hover:text-white">Leadership</Link></li>
            </ul>
          </div>


          {/* Column 4 & 5: Contact Us */}
          <div className="col-span-2">
            <h4 className="mb-4 font-semibold uppercase text-white">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                Madhapur, Hyderabad, Telangana, India
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 flex-shrink-0" />
                <a href="mailto:sales@firewall-store.com" className="hover:text-white">
                  sales@firewall-store.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 flex-shrink-0" />
                <a href="tel:+917032224513" className="hover:text-white">
                  +91-7032224513
                </a>
              </li>
            </ul>
            {/* 5. Updated social icon colors */}
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-white">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white">
                <Linkedin size={24} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white">
                <Youtube size={24} />
              </a>
              <a href="#" className="text-blue-200 hover:text-white">
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Bottom Bar: Darker blue */}
      <div className="bg-blue-950 py-6">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between text-sm md:flex-row">
            {/* 7. Copyright text color */}
            <p className="text-blue-300">&copy; {new Date().getFullYear()} Firewall Store. All rights reserved.</p>
            <div className="mt-4 flex items-center space-x-4 md:mt-0">
              <CreditCard size={24} className="text-blue-300" />
              <PaymentIcon name="VISA" />
              <PaymentIcon name="PayPal" />
              <PaymentIcon name="MasterCard" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

