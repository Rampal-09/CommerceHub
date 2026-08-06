import baseLayout from "../layout/baseLayout.js";

/**
 * Order Cancelled Email Template
 * @param {Object} data
 * @param {string} data.name - Customer name
 * @param {string} data.orderNumber - Order ID
 * @param {string} [data.reason] - Reason for cancellation
 * @param {string} [data.refundStatus] - Information on refund status
 */
export const orderCancelledTemplate = ({
  name,
  orderNumber,
  reason = "Customer requested cancellation",
  refundStatus = "Refund processed to original payment method within 3-5 business days.",
}) => {
  const bodyContent = `
    <span class="badge" style="background-color: #ffe4e6; color: #9f1239;">Order Cancelled</span>
    <h1 style="color: #0f172a; font-size: 24px; margin: 8px 0 16px 0;">Order Cancellation Notice</h1>
    <p>Hi ${name},</p>
    <p>Order <strong>#${orderNumber}</strong> has been cancelled.</p>

    <div class="card-box" style="border-left: 4px solid #f43f5e;">
      <h4 style="margin: 0 0 8px 0; color: #881337; font-size: 14px;">Cancellation Details</h4>
      <p style="margin: 0 0 8px 0; color: #475569; font-size: 13px;"><strong>Reason:</strong> ${reason}</p>
      <p style="margin: 0; color: #475569; font-size: 13px;"><strong>Refund Status:</strong> ${refundStatus}</p>
    </div>

    <p>If you did not request this cancellation or have any questions, please reach out to our team.</p>

    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/support" class="btn" style="background: linear-gradient(135deg, #475569 0%, #334155 100%);">Contact Support</a>
    </div>
  `;

  return baseLayout({
    title: `Order #${orderNumber} Cancelled Notice`,
    previewText: `Order #${orderNumber} has been cancelled.`,
    bodyContent,
  });
};

export default orderCancelledTemplate;
