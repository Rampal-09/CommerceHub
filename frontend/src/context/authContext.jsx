import { createContext, useContext, useEffect, useState } from "react";
import { getMe, logoutUser as logoutApi } from "../api/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  const checkUser = async () => {
    try {
      setLoading(true);
      const res = await getMe();
      const userData = res.user || res.data?.user || res.data;
      setUser(userData);
      setError(null);
      return userData;
    } catch (err) {
      console.log("User not logged in or session expired:", err);
      setUser(null);
      setError(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setError(null);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        getMe: checkUser,
        setUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
