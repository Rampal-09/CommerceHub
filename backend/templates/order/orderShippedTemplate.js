import baseLayout from "../layout/baseLayout.js";

/**
 * Order Shipped Email Template
 * @param {Object} data
 * @param {string} data.name - Customer name
 * @param {string} data.orderNumber - Order ID
 * @param {string} [data.carrier="FedEx / Express Logistics"] - Shipping provider
 * @param {string} [data.trackingNumber] - Tracking number string
 * @param {string} [data.trackingUrl] - Tracking website link
 * @param {string} [data.estimatedDelivery] - Expected delivery date string
 */
export const orderShippedTemplate = ({
  name,
  orderNumber,
  carrier = "Express Courier",
  trackingNumber,
  trackingUrl,
  estimatedDelivery = "3 - 5 business days",
}) => {
  const bodyContent = `
    <span class="badge" style="background-color: #e0e7ff; color: #4338ca;">On The Way</span>
    <h1 style="color: #0f172a; font-size: 24px; margin: 8px 0 16px 0;">Your Order Has Been Shipped! 🚚</h1>
    <p>Hi ${name},</p>
    <p>Great news! Order <strong>#${orderNumber}</strong> has left our warehouse and is now on its way to you.</p>

    <div class="card-box" style="border-left: 4px solid #6366f1;">
      <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 14px;">Shipment Details</h4>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #334155;">
        <tr>
          <td style="padding: 4px 0;">Courier Partner:</td>
          <td style="padding: 4px 0; text-align: right; font-weight: 600;">${carrier}</td>
        </tr>
        ${
          trackingNumber
            ? `
        <tr>
          <td style="padding: 4px 0;">Tracking Number:</td>
          <td style="padding: 4px 0; text-align: right; font-family: monospace; font-weight: 700; color: #4f46e5;">${trackingNumber}</td>
        </tr>`
            : ""
        }
        <tr>
          <td style="padding: 4px 0;">Estimated Delivery:</td>
          <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #16a34a;">${estimatedDelivery}</td>
        </tr>
      </table>
    </div>

    ${
      trackingUrl
        ? `
    <div style="text-align: center;">
      <a href="${trackingUrl}" class="btn">Track Your Package</a>
    </div>`
        : `
    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/orders/${orderNumber}" class="btn">Track Package</a>
    </div>`
    }
  `;

  return baseLayout({
    title: `Order #${orderNumber} Has Shipped!`,
    previewText: `Your order #${orderNumber} is on its way via ${carrier}.`,
    bodyContent,
  });
};

export default orderShippedTemplate;
