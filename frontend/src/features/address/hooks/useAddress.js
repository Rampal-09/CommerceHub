import { useContext } from "react";
import { AddressContext } from "../context/AddressContext";

/**
 * Custom hook to access Address Context state and methods
 */
export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};

export default useAddress;
