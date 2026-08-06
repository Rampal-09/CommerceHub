import baseLayout from "../layout/baseLayout.js";

/**
 * Password Reset Success Email Template
 * @param {Object} data
 * @param {string} data.name - User name
 * @param {string} [data.loginUrl] - Login URL
 */
export const resetSuccessTemplate = ({
  name,
  loginUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/login`,
}) => {
  const bodyContent = `
    <span class="badge" style="background-color: #dcfce7; color: #166534;">Security Confirmation</span>
    <h1 style="color: #0f172a; font-size: 24px; margin: 8px 0 16px 0;">Password Reset Successful</h1>
    <p>Hi ${name},</p>
    <p>This email confirms that your password for your CommerceHub account has been successfully updated.</p>

    <div class="card-box" style="border-left: 4px solid #10b981;">
      <p style="margin: 0; font-size: 14px; color: #065f46;">
        Your account is secure with your new password. You can now log in with your updated credentials.
      </p>
    </div>

    <div style="text-align: center;">
      <a href="${loginUrl}" class="btn">Log In to Your Account</a>
    </div>

    <hr class="divider">
    <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">
      <strong>Didn't make this change?</strong> If you did not update your password, please contact our security team immediately at <a href="${process.env.CLIENT_URL || '#'}/support" style="color: #4f46e5;">Support Center</a>.
    </p>
  `;

  return baseLayout({
    title: "Password Reset Successful - CommerceHub",
    previewText: `Your CommerceHub password has been successfully reset.`,
    bodyContent,
  });
};

export default resetSuccessTemplate;
