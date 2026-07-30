import { useContext } from "react";
import { UserContext } from "../context/UserContext";

/**
 * Custom hook to manage user profile state & actions
 */
export const useProfile = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useProfile must be used within a UserProvider");
  }

  const {
    userProfile,
    loading,
    actionLoading,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
  } = context;

  return {
    profile: userProfile,
    loading,
    actionLoading,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
  };
};

export default useProfile;
