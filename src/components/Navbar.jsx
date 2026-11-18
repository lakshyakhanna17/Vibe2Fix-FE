import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  LogOut, 
  SlidersHorizontal,
  Package, 
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { categoryApi } from '../api/product.api';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, wishlist } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const searchInputRef = useRef(null);

  // Global hotkey (Cmd+K / Ctrl+K / /) to focus the prominent search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll listener to activate progressive blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryApi.getCategories();
        setCategories(res.data.categories || res.data || []);
      } catch (err) {
        console.error('Failed to load categories in navbar', err);
      }
    };
    fetchCats();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Progressive Fading Blur Mask - Smooth frosted glass feathering seamlessly without dark boxes */}
      <div 
        className={`fixed top-0 left-0 right-0 h-32 pointer-events-none z-40 transition-opacity duration-300 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 fading-scroll-blur" />
      </div>

      {/* Main Sticky Navbar Container */}
      <header className="sticky top-0 z-50 pt-3 pb-2 px-3 sm:px-6">
        
        {/* Floating Rounded Cut Pill */}
        <div 
          className={`max-w-6xl mx-auto rounded-3xl sm:rounded-[2rem] transition-all duration-300 px-4 sm:px-6 py-2.5 space-y-2.5 ${
            isScrolled
              ? 'bg-[#121214]/90 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.75)]'
              : 'bg-[#171719]/90 backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
          }`}
        >
          
          {/* Top Navbar Row */}
          <div className="flex items-center justify-between h-11 gap-3">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group select-none">
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-white to-neutral-300 flex items-center justify-center font-black text-black text-xs shadow-[0_2px_0_0_#0A0A0C] group-hover:scale-105 transition-transform">
                V
              </div>
              <span className="font-extrabold text-sm sm:text-base tracking-wider text-white">
                VIBE<span className="text-text-muted">2FIX</span>
              </span>
            </Link>

            {/* Sleek Minimalist Search Bar */}
            <form 
              onSubmit={handleSearchSubmit} 
              className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-3 relative items-center group"
            >
              <div className="relative w-full flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-3.5 text-neutral-400 group-focus-within:text-white transition-colors pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hardware, tools, components..."
                  className="w-full pl-9 pr-14 py-2 bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.12] rounded-full text-xs text-white placeholder:text-neutral-400 font-normal tracking-wide focus:outline-none transition-all duration-200"
                />

                <div className="absolute right-3 flex items-center gap-1.5">
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-full text-neutral-400 hover:text-white transition"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-white/10 rounded select-none">
                      ⌘K
                    </kbd>
                  )}
                </div>
              </div>
            </form>

            {/* Right Action Icons (Wishlist, Cart, User) */}
            <div className="flex items-center gap-2">
              
              {/* Wishlist Link */}
              <Link 
                to={isAuthenticated ? "/wishlist" : "/login"} 
                className="relative p-2 rounded-full bg-[#202024] text-text-secondary hover:text-white transition shadow-[0_2px_0_0_#0A0A0C] active:translate-y-0.5"
                title="Wishlist"
              >
                <Heart className="w-3.5 h-3.5" />
                {isAuthenticated && wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-status-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Link with Badge */}
              <Link 
                to="/cart" 
                className="relative p-2 rounded-full bg-[#202024] text-text-secondary hover:text-white transition shadow-[0_2px_0_0_#0A0A0C] active:translate-y-0.5"
                title="Shopping Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[9px] font-black rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User Account / Dropdown */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-[#202024] hover:bg-[#28282D] transition shadow-[0_2px_0_0_#0A0A0C]"
                  >
                    <div className="w-6 h-6 rounded-full bg-neutral-200 text-black flex items-center justify-center font-bold text-xs uppercase">
                      {user?.name?.[0] || 'U'}
                    </div>
                    <span className="hidden lg:inline text-xs font-semibold text-text-primary max-w-[80px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-3 w-56 bg-bg-card rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] py-2 z-50 text-xs"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 bg-bg-elevated/40 rounded-t-xl mb-1">
                        <p className="font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-neutral-200 text-black rounded-full">
                            Admin Portal
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-white hover:bg-bg-elevated transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-text-secondary" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-text-secondary hover:text-white hover:bg-bg-elevated transition"
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>

                      <Link
                        to="/refunds"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-text-secondary hover:text-white hover:bg-bg-elevated transition"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        My Returns & Refunds
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-text-secondary hover:text-white hover:bg-bg-elevated transition"
                      >
                        <User className="w-4 h-4" />
                        Profile & Addresses
                      </Link>

                      <div className="my-1 h-px bg-white/5"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-status-danger hover:bg-bg-elevated transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-white transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-3d px-3.5 py-1.5 text-xs rounded-full"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-text-secondary hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 3D Pop-Out Tab Bar for Categories */}
          <nav className="hidden md:flex items-center justify-center gap-2 overflow-x-auto pt-1 pb-0.5 scrollbar-none text-[10px] font-bold uppercase tracking-wider">
            <Link
              to="/products"
              className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                location.pathname === '/products' && !location.search
                  ? 'tab-3d-active'
                  : 'tab-3d text-text-secondary'
              }`}
            >
              All Products
            </Link>

            {categories.map((cat) => {
              const isCatActive = location.search.includes(`category=${cat.slug || cat.categoryId}`);
              return (
                <Link
                  key={cat.categoryId || cat.id}
                  to={`/products?category=${cat.slug || cat.categoryId}`}
                  className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                    isCatActive
                      ? 'tab-3d-active'
                      : 'tab-3d text-text-secondary'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-bg-card rounded-2xl px-4 py-4 space-y-4 shadow-2xl">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hardware, tools, components..."
                className="w-full pl-9 pr-4 py-2 bg-white/[0.06] rounded-full text-xs text-white placeholder:text-neutral-400 font-normal focus:outline-none"
              />
            </form>

            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-2">Hardware Divisions</p>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-semibold text-text-secondary hover:text-white rounded-xl bg-bg-elevated"
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.categoryId || cat.id}
                  to={`/products?category=${cat.slug || cat.categoryId}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-semibold text-text-secondary hover:text-white rounded-xl bg-bg-elevated"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
