import baseLayout from "../layout/baseLayout.js";

/**
 * Order Confirmation Template
 * @param {Object} data
 * @param {string} data.name - Customer name
 * @param {string} data.orderNumber - Order ID or number
 * @param {Array<Object>} data.items - Array of items [{ title, quantity, price, image }]
 * @param {number} data.totalAmount - Total order amount
 * @param {number} [data.shippingFee=0] - Shipping fee
 * @param {number} [data.tax=0] - Tax amount
 * @param {Object} [data.shippingAddress] - Address object { street, city, state, postalCode, country }
 * @param {string} [data.orderUrl] - Order status page link
 */
export const orderConfirmationTemplate = ({
  name,
  orderNumber,
  items = [],
  totalAmount,
  shippingFee = 0,
  tax = 0,
  shippingAddress = {},
  orderUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/orders/${orderNumber}`,
}) => {
  const itemsTableRows = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
        <div style="display: flex; align-items: center;">
          ${
            item.image
              ? `<img src="${item.image}" alt="${item.title}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px; margin-right: 12px;" />`
              : ""
          }
          <div>
            <div style="font-weight: 600; color: #1e293b; font-size: 14px;">${item.title}</div>
            <div style="font-size: 12px; color: #64748b;">Qty: ${item.quantity}</div>
          </div>
        </div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600; color: #0f172a;">
        $${(Number(item.price) * Number(item.quantity)).toFixed(2)}
      </td>
    </tr>`
    )
    .join("");

  const addressString = [
    shippingAddress.street || shippingAddress.addressLine1,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.postalCode || shippingAddress.zipCode,
    shippingAddress.country,
  ]
    .filter(Boolean)
    .join(", ");

  const bodyContent = `
    <span class="badge" style="background-color: #dbeafe; color: #1e40af;">Order Confirmed</span>
    <h1 style="color: #0f172a; font-size: 24px; margin: 8px 0 16px 0;">Thank you for your order, ${name}!</h1>
    <p>We're processing your order <strong>#${orderNumber}</strong>. We'll notify you as soon as your items ship.</p>

    <!-- Items Table -->
    <div style="margin: 24px 0;">
      <h3 style="font-size: 16px; color: #0f172a; margin-bottom: 12px;">Order Summary</h3>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        ${itemsTableRows}
      </table>
    </div>

    <!-- Pricing Calculation Box -->
    <div class="card-box" style="margin-top: 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px;">
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Subtotal:</td>
          <td style="padding: 4px 0; text-align: right; color: #1e293b; font-weight: 500;">$${(
            Number(totalAmount) - Number(shippingFee) - Number(tax)
          ).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Shipping:</td>
          <td style="padding: 4px 0; text-align: right; color: #1e293b; font-weight: 500;">${
            shippingFee > 0 ? `$${Number(shippingFee).toFixed(2)}` : "FREE"
          }</td>
        </tr>
        ${
          tax > 0
            ? `
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Estimated Tax:</td>
          <td style="padding: 4px 0; text-align: right; color: #1e293b; font-weight: 500;">$${Number(tax).toFixed(2)}</td>
        </tr>`
            : ""
        }
        <tr style="border-top: 2px solid #e2e8f0;">
          <td style="padding: 12px 0 0 0; font-weight: 700; color: #0f172a; font-size: 16px;">Total Paid:</td>
          <td style="padding: 12px 0 0 0; text-align: right; font-weight: 800; color: #4f46e5; font-size: 18px;">$${Number(
            totalAmount
          ).toFixed(2)}</td>
        </tr>
      </table>
    </div>

    ${
      addressString
        ? `
    <div class="card-box">
      <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px;">Shipping Address</h4>
      <p style="margin: 0; color: #475569; font-size: 13px; line-height: 1.4;">${addressString}</p>
    </div>`
        : ""
    }

    <div style="text-align: center;">
      <a href="${orderUrl}" class="btn">View & Track Order</a>
    </div>
  `;

  return baseLayout({
    title: `Order Confirmation #${orderNumber} - CommerceHub`,
    previewText: `Order #${orderNumber} confirmed! Total: $${Number(totalAmount).toFixed(2)}.`,
    bodyContent,
  });
};

export default orderConfirmationTemplate;
