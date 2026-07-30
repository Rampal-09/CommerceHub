import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Store,
  MapPin,
  Heart,
  Search,
  ChevronDown,
  Package,
  Lock,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/authContext";
import { useCart } from "../../features/cart/hooks/useCart";
import { useWishlist } from "../../features/wishlist/hooks/useWishlist";

/**
 * Responsive Global Navigation Bar with Mobile Drawer & Profile Dropdown
 */
export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile drawer when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 cursor-pointer group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-brand-gradient text-white font-black flex items-center justify-center text-lg shadow-brand-glow transition-all">
            CH
          </div>
          <div className="hidden xs:block sm:block">
            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none block">
              CommerceHub
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">
              E-Commerce
            </span>
          </div>
        </Link>

        {/* Desktop Global Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden md:block">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title, category..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </form>

        {/* Desktop Center Nav Links */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <Link
            to="/"
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isActive("/") || isActive("/products")
                ? "bg-brand-gradient text-white font-extrabold shadow-brand-glow"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Store className={`w-4 h-4 ${isActive("/") || isActive("/products") ? "text-white" : "text-indigo-600"}`} />
            <span>Home</span>
          </Link>

          <Link
            to="/catalog"
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isActive("/catalog")
                ? "bg-brand-gradient text-white font-extrabold shadow-brand-glow"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Package className={`w-4 h-4 ${isActive("/catalog") ? "text-white" : "text-indigo-600"}`} />
            <span>Catalog</span>
          </Link>

          {/* Admin Panel Link */}
          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="px-3 py-2 bg-brand-gradient text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-brand-glow shadow-brand-glow-hover hover:-translate-y-0.5"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-300" />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>

        {/* Right Actions: Search Toggle (Mobile), Wishlist, Cart & Auth */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer border border-slate-200/80"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist & Cart Links */}
          {user?.role !== "admin" && (
            <>
              <Link
                to="/wishlist"
                className={`relative p-2 sm:p-2.5 rounded-2xl transition-all flex items-center justify-center cursor-pointer ${
                  isActive("/wishlist")
                    ? "bg-brand-gradient text-white shadow-brand-glow"
                    : "bg-slate-100 hover:bg-violet-50 text-slate-700 hover:text-violet-600 border border-slate-200/80"
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive("/wishlist") ? "fill-white" : ""}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-violet-600 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className={`relative p-2 sm:p-2.5 rounded-2xl transition-all flex items-center justify-center cursor-pointer ${
                  isActive("/cart")
                    ? "bg-brand-gradient text-white shadow-brand-glow"
                    : "bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200/80"
                }`}
                title="Shopping Cart"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* User Profile Dropdown (Desktop & Mobile trigger) */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  showDropdown || location.pathname.startsWith("/account") || location.pathname.startsWith("/admin")
                    ? "bg-brand-gradient text-white border-transparent shadow-brand-glow"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80"
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-extrabold text-[11px] overflow-hidden shrink-0">
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
                  )}
                </div>
                <span className="hidden lg:inline-block truncate max-w-[90px]">
                  {user?.name || "Account"}
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Profile Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-150 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-extrabold text-xs text-slate-900 truncate">{user?.name || "User"}</p>
                      {user?.role === "admin" && (
                        <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 text-[9px] font-black rounded-md uppercase">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  </div>

                  {user?.role === "admin" ? (
                    <>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        <span>Admin Workspace</span>
                      </Link>

                      <Link
                        to="/admin/products"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                      >
                        <Package className="w-4 h-4 text-indigo-600" />
                        <span>Manage Products</span>
                      </Link>

                      <Link
                        to="/account/change-password"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                      >
                        <Lock className="w-4 h-4 text-indigo-600" />
                        <span>Change Password</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/account/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        to="/account/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                      >
                        <User className="w-4 h-4 text-indigo-600" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/account/orders"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                      >
                        <Package className="w-4 h-4 text-indigo-600" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="/account/wishlist"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                      >
                        <Heart className="w-4 h-4 text-indigo-600" />
                        <span>My Wishlist</span>
                      </Link>

                      <Link
                        to="/account/addresses"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                      >
                        <MapPin className="w-4 h-4 text-indigo-600" />
                        <span>Saved Addresses</span>
                      </Link>

                      <Link
                        to="/account/change-password"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                      >
                        <Lock className="w-4 h-4 text-indigo-600" />
                        <span>Change Password</span>
                      </Link>
                    </>
                  )}

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                to="/login"
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-gradient text-white rounded-xl text-xs font-bold transition-all shadow-brand-glow cursor-pointer"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hidden sm:inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Drawer Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer border border-slate-200/80 ml-1"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Mobile Search Input Row */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-b border-slate-200/60 bg-slate-50/50 animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title, category..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
              autoFocus
            />
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu Content */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200/80 px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-3 duration-200">
          {/* Quick Mobile Search Input inside drawer */}
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </form>

          {/* Navigation Links */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive("/") || isActive("/products")
                  ? "bg-brand-gradient text-white shadow-brand-glow"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive("/catalog")
                  ? "bg-brand-gradient text-white shadow-brand-glow"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Catalog</span>
            </Link>

            {isAuthenticated && user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          {/* User Account Quick Links if Authenticated */}
          {isAuthenticated && (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                My Account ({user?.name})
              </div>
              <Link
                to="/account/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/account/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <Package className="w-4 h-4 text-indigo-600" />
                <span>My Orders</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
