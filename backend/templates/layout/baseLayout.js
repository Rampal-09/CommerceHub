/**
 * Base Responsive HTML Wrapper for all CommerceHub emails
 *
 * @param {Object} options
 * @param {string} options.title - Email header badge / preheader text
 * @param {string} options.bodyContent - Main HTML body content of the template
 * @param {string} [options.previewText] - Email inbox preheader preview text
 * @param {string} [options.companyName="CommerceHub"] - Company name for branding
 * @returns {string} Fully formatted responsive HTML document
 */
export const baseLayout = ({
  title = "CommerceHub Notification",
  bodyContent = "",
  previewText = "",
  companyName = "CommerceHub",
}) => {
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    /* Reset & Base Styles */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f4f6f9; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
    
    /* Layout Container */
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08); }
    .header-banner { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center; }
    .header-logo { color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin: 0; text-decoration: none; display: inline-block; }
    .header-tagline { color: #e0e7ff; font-size: 13px; margin-top: 4px; font-weight: 400; text-transform: uppercase; letter-spacing: 1px; }
    .body-content { padding: 36px 32px; font-size: 15px; line-height: 1.6; color: #334155; }
    .footer { background-color: #0f172a; color: #94a3b8; padding: 28px 24px; text-align: center; font-size: 13px; line-height: 1.5; }
    .footer a { color: #818cf8; text-decoration: none; font-weight: 500; }
    .footer a:hover { text-decoration: underline; }

    /* Component Utilities */
    .btn { display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: #ffffff !important; font-weight: 600; font-size: 15px; padding: 14px 28px; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25); text-align: center; margin: 20px 0; }
    .badge { display: inline-block; background-color: #e0e7ff; color: #4338ca; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
    .card-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .divider { height: 1px; background-color: #e2e8f0; margin: 24px 0; border: none; }
    .highlight-text { color: #4f46e5; font-weight: 600; }

    /* Mobile Responsive */
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; border-radius: 0 !important; }
      .body-content { padding: 24px 20px !important; }
      .header-banner { padding: 24px 16px !important; }
      .btn { width: 100% !important; box-sizing: border-box; }
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display: none; max-height: 0px; overflow: hidden;">${previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>` : ""}
  
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td style="padding: 24px 0;">
        <div class="email-container">
          <!-- Header Banner -->
          <div class="header-banner">
            <a href="${process.env.CLIENT_URL || '#'}" class="header-logo">
              🛒 ${companyName}
            </a>
            <div class="header-tagline">Premium Shopping Platform</div>
          </div>

          <!-- Body Content -->
          <div class="body-content">
            ${bodyContent}
          </div>

          <!-- Footer -->
          <div class="footer">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #cbd5e1;">${companyName} Inc.</p>
            <p style="margin: 0 0 16px 0;">Empowering your online shopping experience.</p>
            <p style="margin: 0 0 16px 0;">
              <a href="${process.env.CLIENT_URL || '#'}/account">My Account</a> &bull;
              <a href="${process.env.CLIENT_URL || '#'}/orders">Track Orders</a> &bull;
              <a href="${process.env.CLIENT_URL || '#'}/support">Help Center</a>
            </p>
            <p style="margin: 0; font-size: 11px; color: #64748b;">
              &copy; ${currentYear} ${companyName}. All rights reserved.<br>
              This email was sent to you regarding your account activity.
            </p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export default baseLayout;
