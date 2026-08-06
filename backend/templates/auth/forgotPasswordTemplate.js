import baseLayout from "../layout/baseLayout.js";

/**
 * Forgot Password Email Template
 * @param {Object} data
 * @param {string} data.name - User name
 * @param {string} data.resetUrl - Password reset URL
 * @param {string} [data.expiresIn="1 hour"] - Link validity duration
 */
export const forgotPasswordTemplate = ({ name, resetUrl, expiresIn = "1 hour" }) => {
  const bodyContent = `
    <span class="badge" style="background-color: #fef3c7; color: #92400e;">Password Reset</span>
    <h1 style="color: #0f172a; font-size: 24px; margin: 8px 0 16px 0;">Reset Your Password</h1>
    <p>Hi ${name},</p>
    <p>We received a request to reset the password for your CommerceHub account. Click the button below to choose a new password:</p>

    <div style="text-align: center;">
      <a href="${resetUrl}" class="btn" style="background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);">Reset Password</a>
    </div>

    <div class="card-box" style="border-left: 4px solid #f59e0b;">
      <p style="margin: 0; font-size: 13px; color: #78350f;">
        <strong>Note:</strong> This link is valid for <strong>${expiresIn}</strong>. For security reasons, do not share this link with anyone.
      </p>
    </div>

    <p style="font-size: 13px; color: #64748b;">If the button doesn't work, copy and paste this link:<br>
    <a href="${resetUrl}" style="color: #e11d48; word-break: break-all;">${resetUrl}</a></p>

    <hr class="divider">
    <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
  `;

  return baseLayout({
    title: "Reset Your CommerceHub Password",
    previewText: `Reset your CommerceHub password. Request expires in ${expiresIn}.`,
    bodyContent,
  });
};

export default forgotPasswordTemplate;
