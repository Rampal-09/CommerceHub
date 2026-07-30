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
} from "lucide-react";
import { useAuth } from "../../context/authContext";
import { useCart } from "../../features/cart/hooks/useCart";
import { useWishlist } from "../../features/wishlist/hooks/useWishlist";

/**
 * Global Navigation Bar with Search & Customer Profile Dropdown
 */
export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
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

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/products" className="flex items-center gap-2.5 cursor-pointer group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 group-hover:bg-indigo-700 text-white font-black flex items-center justify-center text-lg shadow-md shadow-indigo-200 transition-all">
            CH
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-black text-slate-900 tracking-tight leading-none block">
              CommerceHub
            </span>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">
              E-Commerce
            </span>
          </div>
        </Link>

        {/* Global Search Input */}
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

        {/* Center Nav Links */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Link
            to="/products"
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isActive("/products")
                ? "bg-indigo-50 text-indigo-700 font-extrabold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Store className="w-4 h-4 text-indigo-600" />
            <span>Catalog</span>
          </Link>

          {/* Admin Panel Link for Admin Role Users */}
          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="px-3 py-2 bg-indigo-900 text-white hover:bg-indigo-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-300" />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>

        {/* Right Actions: Wishlist, Cart & Auth Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Wishlist & Cart Links (Customer Only - Hidden for Admin) */}
          {user?.role !== "admin" && (
            <>
              {/* Wishlist Icon Link with Live Badge */}
              <Link
                to="/wishlist"
                className={`relative p-2.5 rounded-2xl transition-all flex items-center justify-center cursor-pointer ${
                  isActive("/wishlist")
                    ? "bg-red-600 text-white shadow-md shadow-red-200"
                    : "bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200/80"
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isActive("/wishlist") ? "fill-white" : ""}`} />

                {/* Wishlist Count Badge */}
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-150">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon Link with Live Badge */}
              <Link
                to="/cart"
                className={`relative p-2.5 rounded-2xl transition-all flex items-center justify-center cursor-pointer ${
                  isActive("/cart")
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200/80"
                }`}
                title="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />

                {/* Cart Count Badge */}
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-150">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* User Profile / Auth Button */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                  showDropdown || location.pathname.startsWith("/account") || location.pathname.startsWith("/admin")
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80"
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-extrabold text-[11px] overflow-hidden">
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
                  )}
                </div>
                <span className="hidden md:inline-block truncate max-w-[100px]">
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
                    /* Admin Dropdown Items */
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
                    /* Customer Dropdown Items */
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
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
