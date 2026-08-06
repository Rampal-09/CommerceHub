import baseLayout from "../layout/baseLayout.js";

/**
 * Welcome Email Template
 * @param {Object} data
 * @param {string} data.name - User full name or username
 * @param {string} [data.exploreUrl] - Link to start shopping
 */
export const welcomeTemplate = ({ name, exploreUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/products` }) => {
  const bodyContent = `
    <span class="badge">Welcome Onboard</span>
    <h1 style="color: #0f172a; font-size: 24px; margin: 8px 0 16px 0;">Welcome to CommerceHub, ${name}!</h1>
    <p>We're thrilled to have you join our community. CommerceHub brings you thousands of premium products, incredible daily deals, and lightning-fast delivery.</p>

    <div class="card-box">
      <h3 style="margin-top: 0; color: #1e293b; font-size: 16px;">Here is how to get started:</h3>
      <ul style="margin: 0; padding-left: 20px; color: #475569;">
        <li style="margin-bottom: 8px;">Explore curated collections and trending items</li>
        <li style="margin-bottom: 8px;">Save your favorite products to your Wishlist</li>
        <li style="margin-bottom: 0;">Enjoy seamless checkout with safe payment methods</li>
      </ul>
    </div>

    <div style="text-align: center;">
      <a href="${exploreUrl}" class="btn">Start Shopping Now</a>
    </div>

    <p style="margin-top: 24px;">If you have any questions or need assistance, our support team is always here to help.</p>
    <p style="margin-bottom: 0;">Happy Shopping,<br><strong>The CommerceHub Team</strong></p>
  `;

  return baseLayout({
    title: "Welcome to CommerceHub!",
    previewText: `Welcome to CommerceHub, ${name}! Start exploring trending products today.`,
    bodyContent,
  });
};

export default welcomeTemplate;
