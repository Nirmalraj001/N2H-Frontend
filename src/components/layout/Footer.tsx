import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container-responsive py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 transition-all duration-200 hover:scale-105 inline-flex">
              <Package className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-white">N2H Enterprises</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Premium quality spices, tea, and traditional snacks delivered to your doorstep.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Shop by Category</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products?category=c1" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">
                  Dry Powders
                </Link>
              </li>
              <li>
                <Link to="/products?category=c2" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">
                  Masala Blends
                </Link>
              </li>
              <li>
                <Link to="/products?category=c3" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">
                  Snacks
                </Link>
              </li>
              <li>
                <Link to="/products?category=c4" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">
                  Tea Varieties
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>contact@n2h.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 12345 67890</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} N2H Enterprises. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
