import React from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";

/**
 * Route guard for Guest-Only Routes (Login & Signup)
 */
export const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [searchParams] = useSearchParams();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    const redirectUrl = searchParams.get("redirect") || "/products";
    return <Navigate to={redirectUrl} replace />;
  }

  return children;
};

export default GuestRoute;
