import React, { useState, useRef, useEffect } from "react";
import { Menu, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-teal-700 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold tracking-wider">MyApp</span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative flex">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="w-64 px-4 py-1 rounded-full text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={handleSearch}
                className="ml-2 bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/about" className="hover:text-teal-200">
              About
            </a>
            <a href="/contact" className="hover:text-teal-200">
              Contact
            </a>
            <a href="/profile" className="hover:text-teal-200">
              Profile
            </a>
            <a href="/wishlist" className="hover:text-teal-200">
              Wishlist
            </a>
            <a href="/categories" className="hover:text-teal-200">
              Categories
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <button onClick={toggleSearch} className="p-2 rounded-lg hover:bg-teal-600">
              <Search className="h-5 w-5" />
            </button>
            <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-teal-600">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div ref={searchRef} className="md:hidden pb-4">
            <div className="relative flex">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={handleSearch}
                className="ml-2 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden flex flex-col space-y-2 pb-4">
            <a href="/about" className="px-4 py-2 text-sm hover:bg-teal-600 rounded-lg">
              About
            </a>
            <a href="/contact" className="px-4 py-2 text-sm hover:bg-teal-600 rounded-lg">
              Contact
            </a>
            <a href="/profile" className="px-4 py-2 text-sm hover:bg-teal-600 rounded-lg">
              Profile
            </a>
            <a href="/wishlist" className="px-4 py-2 text-sm hover:bg-teal-600 rounded-lg">
              Wishlist
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
