import React from "react";
import PasswordForm from "../../components/Account/PasswordForm";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../context/authContext";

/**
 * Account Change Password Page
 */
export const ChangePassword = () => {
  const { actionLoading } = useProfile();
  const { changePassword } = useAuth();
  const { changePassword: changeUserPassword } = useProfile();

  const handleSubmitPassword = async (data) => {
    return await changeUserPassword(data);
  };

  return <PasswordForm onSubmitPassword={handleSubmitPassword} isLoading={actionLoading} />;
};

export default ChangePassword;
