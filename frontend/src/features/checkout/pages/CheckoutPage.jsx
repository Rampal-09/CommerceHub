import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, ChevronRight, ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react";
import { useCheckout } from "../hooks/useCheckout";
import AddressSelector from "../components/AddressSelector";
import CheckoutItem from "../components/CheckoutItem";
import OrderSummary from "../components/OrderSummary";
import EmptyCheckout from "../components/EmptyCheckout";

/**
 * Skeleton Loader Component for Checkout Page
 */
const CheckoutSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="h-40 bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
          <div className="h-5 bg-slate-200 rounded-md w-1/3"></div>
          <div className="h-4 bg-slate-100 rounded-md w-2/3"></div>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200/80 p-4 flex gap-4">
              <div className="w-16 h-16 bg-slate-200 rounded-xl shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
                <div className="h-3 bg-slate-100 rounded-md w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-96 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
        <div className="h-5 bg-slate-200 rounded-md w-1/2"></div>
        <div className="space-y-3 pt-4">
          <div className="h-4 bg-slate-100 rounded-md w-full"></div>
          <div className="h-4 bg-slate-100 rounded-md w-full"></div>
        </div>
        <div className="h-12 bg-indigo-200 rounded-2xl mt-6"></div>
      </div>
    </div>
  </div>
);

/**
 * Checkout Page Component
 */
export const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    addresses,
    selectedAddress,
    priceSummary,
    paymentMethod,
    orderNotes,
    couponCode,
    appliedDiscount,
    loading,
    placingOrder,
    selectShippingAddress,
    setPaymentMethod,
    setOrderNotes,
    applyCoupon,
    placeOrder,
  } = useCheckout();

  const handlePlaceOrderClick = async () => {
    const createdOrder = await placeOrder();
    if (createdOrder) {
      // Navigate to Order Success Page with order details
      navigate("/order-success", { state: { order: createdOrder } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 font-sans">
        <div className="bg-white border-b border-slate-200/80 text-slate-800 py-8 sm:py-10 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto space-y-2">
            <div className="h-4 bg-slate-200 rounded-md w-32 animate-pulse"></div>
            <div className="h-8 bg-slate-200 rounded-md w-64 animate-pulse"></div>
          </div>
        </div>
        <CheckoutSkeleton />
      </div>
    );
  }

  const isCartEmpty = !cartItems || cartItems.length === 0;

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 pb-16">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200/80 text-slate-800 py-8 sm:py-10 px-4 sm:px-8">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-80 h-80 bg-violet-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Link to="/products" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/cart" className="hover:text-indigo-600 transition-colors">
              Cart
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold">Checkout</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-indigo-600" /> Secure Checkout
              </h1>
              <p className="text-sm text-slate-600 font-medium">
                Complete your order details to finalize your purchase.
              </p>
            </div>

            <Link
              to="/cart"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all self-start sm:self-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {isCartEmpty ? (
          <EmptyCheckout />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Address Selection & Cart Items Preview */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. Address Selection Section */}
              <AddressSelector
                selectedAddress={selectedAddress}
                addresses={addresses}
                onSelectAddress={selectShippingAddress}
              />

              {/* 2. Order Items Section */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
                  <span>Order Items ({cartItems.length})</span>
                  <Link to="/cart" className="text-xs font-bold text-indigo-600 hover:underline">
                    Edit Cart
                  </Link>
                </h3>

                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const pId = item.product?._id || item.product?.id || item.product;
                    return <CheckoutItem key={pId || item._id} item={item} />;
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <OrderSummary
                priceSummary={priceSummary}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                orderNotes={orderNotes}
                onOrderNotesChange={setOrderNotes}
                onApplyCoupon={applyCoupon}
                couponCode={couponCode}
                appliedDiscount={appliedDiscount}
                onPlaceOrder={handlePlaceOrderClick}
                isPlacingOrder={placingOrder}
                isCartEmpty={isCartEmpty}
                isAddressMissing={!selectedAddress}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
