import { useContext } from "react";
import { CartContext } from "../context/CartContext";

/**
 * Custom hook to access Cart Context state and methods
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default useCart;
