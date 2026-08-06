import baseLayout from "../layout/baseLayout.js";

/**
 * Email Verification Template
 * @param {Object} data
 * @param {string} data.name - User name
 * @param {string} [data.verificationUrl] - Direct verification URL link
 * @param {string} [data.otpCode] - One-time verification code/pin if applicable
 * @param {string} [data.expiresIn="24 hours"] - Token expiration time
 */
export const verificationTemplate = ({
  name,
  verificationUrl,
  otpCode,
  expiresIn = "24 hours",
}) => {
  const bodyContent = `
    <span class="badge">Action Required</span>
    <h1 style="color: #0f172a; font-size: 24px; margin: 8px 0 16px 0;">Verify Your Email Address</h1>
    <p>Hi ${name},</p>
    <p>Thank you for signing up for CommerceHub. Please confirm your email address to activate your account and complete registration.</p>

    ${
      otpCode
        ? `
    <div class="card-box" style="text-align: center;">
      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Your Verification Code</p>
      <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #4f46e5;">${otpCode}</div>
      <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 12px;">Code expires in ${expiresIn}</p>
    </div>`
        : ""
    }

    ${
      verificationUrl
        ? `
    <div style="text-align: center;">
      <a href="${verificationUrl}" class="btn">Verify Email Address</a>
    </div>
    <p style="font-size: 13px; color: #64748b;">Or copy and paste this link into your browser:<br>
    <a href="${verificationUrl}" style="color: #4f46e5; word-break: break-all;">${verificationUrl}</a></p>`
        : ""
    }

    <hr class="divider">
    <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">If you did not create an account with CommerceHub, please ignore this email.</p>
  `;

  return baseLayout({
    title: "Verify Your Email Address - CommerceHub",
    previewText: `Please verify your email address to complete your CommerceHub registration.`,
    bodyContent,
  });
};

export default verificationTemplate;
