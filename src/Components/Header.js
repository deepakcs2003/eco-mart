import React, { useState, useRef, useEffect } from "react";
import { Menu, Search, X, User, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Check for authentication token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

  const handleLogout = () => {
    // Remove user data and token from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Clear state
    setUser(null);
    setToken(null);
    
    // Refresh the page to reset app state and redirect to home
    window.location.href = '/';
  };

  // Check if user has admin role
  const isAdmin = user && user.role === 'admin';

  return (
    <header className="fixed top-0 left-0 w-full bg-teal-700 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <span className="text-xl font-bold tracking-wider">MyApp</span>
          </a>

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
            <a href="/categories" className="hover:text-teal-200">
              Categories
            </a>
            
            {token ? (
              <>
                {/* Show these links when user is logged in */}
                
                <a href="/wishlist" className="hover:text-teal-200">
                  Wishlist
                </a>
                
                {/* Show Admin link if user has admin role */}
                {isAdmin && (
                  <a href="/adminBoard" className="flex items-center space-x-1 bg-purple-600 px-3 py-1 rounded-full hover:bg-purple-700">
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </a>
                )}
                
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-teal-200">{user?.name || 'User'}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              // Show login link when user is not logged in
              <a href="/login" className="hover:text-teal-200">
                Login
              </a>
            )}
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
            <a href="/categories" className="px-4 py-2 text-sm hover:bg-teal-600 rounded-lg">
              Categories
            </a>
            
            {token ? (
              <>
                {/* Show these links when user is logged in (mobile) */}
              
                <a href="/wishlist" className="px-4 py-2 text-sm hover:bg-teal-600 rounded-lg">
                  Wishlist
                </a>
                
                {/* Show Admin link if user has admin role (mobile) */}
                {isAdmin && (
                  <a href="/admin" className="mx-4 my-1 flex items-center space-x-1 bg-purple-600 px-3 py-2 rounded-lg text-sm hover:bg-purple-700">
                    <Shield className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </a>
                )}
                
                <div className="px-4 py-2 text-sm flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{user?.name || 'User'}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="mx-4 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              // Show login link when user is not logged in (mobile)
              <a href="/login" className="px-4 py-2 text-sm hover:bg-teal-600 rounded-lg">
                Login
              </a>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;