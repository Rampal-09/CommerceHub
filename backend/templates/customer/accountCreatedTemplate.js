import baseLayout from "../layout/baseLayout.js";

/**
 * Account Created Confirmation Template
 * @param {Object} data
 * @param {string} data.name - Customer full name
 * @param {string} data.email - Registered email address
 * @param {string} [data.profileUrl] - Link to user profile
 */
export const accountCreatedTemplate = ({
  name,
  email,
  profileUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/account`,
}) => {
  const bodyContent = `
    <span class="badge">Account Ready</span>
    <h1 style="color: #0f172a; font-size: 24px; margin: 8px 0 16px 0;">Account Created Successfully</h1>
    <p>Hi ${name},</p>
    <p>Your new CommerceHub account registered with <strong>${email}</strong> is now live.</p>

    <div class="card-box">
      <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px;">Your Account Features</h4>
      <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 13px; line-height: 1.6;">
        <li>Manage delivery addresses & default payment methods</li>
        <li>Track live order shipments in real-time</li>
        <li>Create custom wishlists and save item price drops</li>
        <li>Access exclusive user discounts & special promos</li>
      </ul>
    </div>

    <div style="text-align: center;">
      <a href="${profileUrl}" class="btn">Manage Your Profile</a>
    </div>
  `;

  return baseLayout({
    title: "Account Created - CommerceHub",
    previewText: `Your CommerceHub account (${email}) has been created successfully.`,
    bodyContent,
  });
};

export default accountCreatedTemplate;
