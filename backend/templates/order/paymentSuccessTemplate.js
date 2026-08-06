import baseLayout from "../layout/baseLayout.js";

/**
 * Payment Successful Email Template
 * @param {Object} data
 * @param {string} data.name - Customer name
 * @param {string} data.orderNumber - Order ID
 * @param {string} data.transactionId - Payment transaction reference / ID
 * @param {number} data.amount - Amount paid
 * @param {string} [data.paymentMethod="Credit Card / Online"] - Payment gateway or method name
 * @param {string} [data.paymentDate] - Date string
 */
export const paymentSuccessTemplate = ({
  name,
  orderNumber,
  transactionId,
  amount,
  paymentMethod = "Online Payment",
  paymentDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
}) => {
  const bodyContent = `
    <span class="badge" style="background-color: #dcfce7; color: #15803d;">Payment Verified</span>
    <h1 style="color: #0f172a; font-size: 24px; margin: 8px 0 16px 0;">Payment Received!</h1>
    <p>Hi ${name},</p>
    <p>Your payment for order <strong>#${orderNumber}</strong> has been successfully processed and confirmed.</p>

    <div class="card-box" style="border-left: 4px solid #10b981;">
      <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 14px;">Transaction Details</h4>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #334155;">
        <tr>
          <td style="padding: 4px 0;">Amount Paid:</td>
          <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #10b981;">$${Number(amount).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Transaction ID:</td>
          <td style="padding: 4px 0; text-align: right; font-family: monospace;">${transactionId || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Payment Method:</td>
          <td style="padding: 4px 0; text-align: right;">${paymentMethod}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Date:</td>
          <td style="padding: 4px 0; text-align: right;">${paymentDate}</td>
        </tr>
      </table>
    </div>

    <p>We are preparing your items for shipment. You will receive another update with live tracking once your order is on its way.</p>
    
    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/orders/${orderNumber}" class="btn">View Invoice</a>
    </div>
  `;

  return baseLayout({
    title: `Payment Receipt for Order #${orderNumber}`,
    previewText: `Payment of $${Number(amount).toFixed(2)} received for Order #${orderNumber}.`,
    bodyContent,
  });
};

export default paymentSuccessTemplate;
