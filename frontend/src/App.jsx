import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./features/cart/context/CartContext";
import { AddressProvider } from "./features/address/context/AddressContext";
import { CheckoutProvider } from "./features/checkout/context/CheckoutContext";
import { WishlistProvider } from "./features/wishlist/context/WishlistContext";
import { UserProvider } from "./context/UserContext";

// Common Route Protection Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";
import GuestRoute from "./components/common/GuestRoute";
import Navbar from "./components/common/Navbar";

// Public & Customer Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CustomerHome from "./pages/customer/CustomerHome";
import CustomerCatalog from "./pages/customer/CustomerCatalog";
import ProductDetails from "./pages/customer/ProductDetails";
import CartPage from "./features/cart/pages/CartPage";
import AddressPage from "./features/address/pages/AddressPage";
import CheckoutPage from "./features/checkout/pages/CheckoutPage";
import OrderSuccessPage from "./features/checkout/pages/OrderSuccessPage";
import WishlistPage from "./features/wishlist/pages/WishlistPage";

// Account Section Layout & Subpages
import AccountLayout from "./components/Account/AccountLayout";
import AccountDashboard from "./pages/Account/Dashboard";
import AccountProfile from "./pages/Account/Profile";
import AccountOrders from "./pages/Account/Orders";
import AccountOrderDetails from "./pages/Account/OrderDetails";
import AccountWishlist from "./pages/Account/Wishlist";
import AccountAddresses from "./pages/Account/Addresses";
import AccountChangePassword from "./pages/Account/ChangePassword";

// Dedicated Admin Workspace Layout & Pages (Option B Architecture)
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetails from "./pages/admin/OrderDetails";
import Categories from "./pages/admin/Categories";
import Products from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";

function App() {
  return (
    <Router>
      <AddressProvider>
        <CartProvider>
          <WishlistProvider>
            <CheckoutProvider>
              <UserProvider>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "#0f172a",
                      color: "#fff",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    },
                    success: {
                      iconTheme: {
                        primary: "#10b981",
                        secondary: "#fff",
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: "#ef4444",
                        secondary: "#fff",
                      },
                    },
                  }}
                />

                <Routes>
                  {/* Guest-Only Auth Routes */}
                  <Route
                    path="/signup"
                    element={
                      <GuestRoute>
                        <Navbar />
                        <Signup />
                      </GuestRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <GuestRoute>
                        <Navbar />
                        <Login />
                      </GuestRoute>
                    }
                  />

                  {/* Public Storefront Routes */}
                  <Route
                    path="/"
                    element={
                      <>
                        <Navbar />
                        <CustomerHome />
                      </>
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      <>
                        <Navbar />
                        <CustomerHome />
                      </>
                    }
                  />
                  <Route
                    path="/catalog"
                    element={
                      <>
                        <Navbar />
                        <CustomerCatalog />
                      </>
                    }
                  />
                  <Route
                    path="/product/:id"
                    element={
                      <>
                        <Navbar />
                        <ProductDetails />
                      </>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute customerOnly>
                        <Navbar />
                        <CartPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Customer Routes */}
                  <Route
                    path="/addresses"
                    element={
                      <ProtectedRoute customerOnly>
                        <Navbar />
                        <AddressPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute customerOnly>
                        <Navbar />
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-success"
                    element={
                      <ProtectedRoute customerOnly>
                        <Navbar />
                        <OrderSuccessPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute customerOnly>
                        <Navbar />
                        <WishlistPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Customer Account Portal Routes */}
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <Navbar />
                        <AccountLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AccountDashboard />} />
                    <Route path="profile" element={<AccountProfile />} />
                    <Route path="orders" element={<AccountOrders />} />
                    <Route path="orders/:id" element={<AccountOrderDetails />} />
                    <Route path="wishlist" element={<AccountWishlist />} />
                    <Route path="addresses" element={<AccountAddresses />} />
                    <Route path="change-password" element={<AccountChangePassword />} />
                  </Route>

                  {/* Dedicated Protected Admin Workspace Routes (Option B Architecture) */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminLayout />
                      </AdminRoute>
                    }
                  >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="orders/:id" element={<AdminOrderDetails />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/new" element={<AddProduct />} />
                    <Route path="products/edit/:id" element={<EditProduct />} />
                  </Route>

                  {/* Fallback & Legacy Redirects */}
                  <Route path="/dashboard" element={<Navigate to="/account/dashboard" replace />} />
                  <Route path="/dashBoard" element={<Navigate to="/account/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </UserProvider>
            </CheckoutProvider>
          </WishlistProvider>
        </CartProvider>
      </AddressProvider>
    </Router>
  );
}

export default App;
