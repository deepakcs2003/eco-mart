import React from 'react';
import { 
  Leaf, 
  Heart, 
  ShoppingBag, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Github,
  ArrowUp
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-green-50 text-gray-600">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              EcoMarket
            </h3>
            <p className="text-sm">
              Your trusted destination for discovering and shopping sustainable, 
              eco-friendly products. Making conscious consumption easier for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-green-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-green-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-green-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/categories" className="hover:text-green-600 transition-colors">
                  Product Categories
                </a>
              </li>
              <li>
                <a href="/trending" className="hover:text-green-600 transition-colors">
                  Trending Products
                </a>
              </li>
              <li>
                <a href="/deals" className="hover:text-green-600 transition-colors">
                  Eco Deals
                </a>
              </li>
              <li>
                <a href="/vendors" className="hover:text-green-600 transition-colors">
                  Sustainable Vendors
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-green-600 transition-colors">
                  Sustainability Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/account" className="hover:text-green-600 transition-colors">
                  My Account
                </a>
              </li>
              <li>
                <a href="/wishlist" className="hover:text-green-600 transition-colors flex items-center gap-2">
                  <Heart className="h-4 w-4" /> Wishlist
                </a>
              </li>
              <li>
                <a href="/orders" className="hover:text-green-600 transition-colors flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" /> Order Tracking
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-green-600 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-green-600 transition-colors flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">Stay Updated</h3>
            <p className="text-sm">
              Subscribe to our newsletter for eco-friendly product updates and sustainability tips.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm">
              © {new Date().getFullYear()} Eco-Mark. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="hover:text-green-600 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-green-600 transition-colors">
                Terms of Service
              </a>
              <a href="/sustainability" className="hover:text-green-600 transition-colors">
                Sustainability Commitment
              </a>
            </div>
            <button
              onClick={scrollToTop}
              className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5 text-green-600" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;