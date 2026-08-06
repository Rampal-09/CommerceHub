import baseLayout from "../layout/baseLayout.js";

/**
 * Order Delivered Email Template
 * @param {Object} data
 * @param {string} data.name - Customer name
 * @param {string} data.orderNumber - Order ID
 * @param {string} [data.deliveryDate] - Date string
 * @param {string} [data.reviewUrl] - Review product link
 */
export const orderDeliveredTemplate = ({
  name,
  orderNumber,
  deliveryDate = "Today",
  reviewUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/orders/${orderNumber}`,
}) => {
  const bodyContent = `
    <span class="badge" style="background-color: #dcfce7; color: #166534;">Delivered 🎉</span>
    <h1 style="color: #0f172a; font-size: 24px; margin: 8px 0 16px 0;">Your Package Has Arrived!</h1>
    <p>Hi ${name},</p>
    <p>Your CommerceHub order <strong>#${orderNumber}</strong> was delivered on <strong>${deliveryDate}</strong>.</p>

    <div class="card-box" style="border-left: 4px solid #16a34a; text-align: center;">
      <p style="margin: 0; font-size: 15px; color: #15803d; font-weight: 600;">
        We hope you love your purchase!
      </p>
      <p style="margin: 8px 0 0 0; color: #475569; font-size: 13px;">
        Have a moment? Share your feedback or rate the products you received.
      </p>
    </div>

    <div style="text-align: center;">
      <a href="${reviewUrl}" class="btn">Leave a Product Review</a>
    </div>

    <hr class="divider">
    <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">
      Need help with this delivery or missing an item? Visit our <a href="${process.env.CLIENT_URL || '#'}/support" style="color: #4f46e5;">Support Center</a>.
    </p>
  `;

  return baseLayout({
    title: `Order #${orderNumber} Delivered`,
    previewText: `Order #${orderNumber} was delivered successfully!`,
    bodyContent,
  });
};

export default orderDeliveredTemplate;
