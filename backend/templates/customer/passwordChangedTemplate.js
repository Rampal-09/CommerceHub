import baseLayout from "../layout/baseLayout.js";

/**
 * Password Changed Security Alert Template
 * @param {Object} data
 * @param {string} data.name - User name
 * @param {string} [data.changeTime] - Timestamp of change
 * @param {string} [data.deviceInfo] - Browser / device details
 */
export const passwordChangedTemplate = ({
  name,
  changeTime = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
  deviceInfo = "Web Browser",
}) => {
  const bodyContent = `
    <span class="badge" style="background-color: #fef3c7; color: #92400e;">Security Alert</span>
    <h1 style="color: #0f172a; font-size: 24px; margin: 8px 0 16px 0;">Your Password Was Changed</h1>
    <p>Hi ${name},</p>
    <p>This is a security alert to inform you that your CommerceHub account password was changed on <strong>${changeTime}</strong> using <strong>${deviceInfo}</strong>.</p>

    <div class="card-box" style="border-left: 4px solid #f59e0b;">
      <p style="margin: 0; font-size: 13px; color: #78350f;">
        If you initiated this change, no further action is required.
      </p>
    </div>

    <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <h4 style="margin: 0 0 4px 0; color: #9f1239; font-size: 14px;">Didn't change your password?</h4>
      <p style="margin: 0 0 12px 0; color: #be123c; font-size: 13px;">
        If you did not make this update, someone else may have accessed your account. Reset your password immediately and contact support.
      </p>
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/forgot-password" style="color: #e11d48; font-weight: 700; font-size: 13px;">Reset Password Now &rarr;</a>
    </div>
  `;

  return baseLayout({
    title: "Security Alert: Password Changed - CommerceHub",
    previewText: `Your CommerceHub account password was changed on ${changeTime}.`,
    bodyContent,
  });
};

export default passwordChangedTemplate;
