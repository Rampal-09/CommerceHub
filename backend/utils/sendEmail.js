import resend from "../config/resend.js";

/**
 * Generic reusable email sender powered by Resend
 *
 * @param {Object} options
 * @param {string|string[]} options.to - Recipient email address or list of addresses
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML content body
 * @param {string} [options.text] - Plain text fallback body
 * @param {string} [options.from] - Sender email address (defaults to process.env.EMAIL_FROM)
 * @param {string|string[]} [options.replyTo] - Reply-to email address(es)
 * @param {string|string[]} [options.cc] - Carbon copy recipient(s)
 * @param {string|string[]} [options.bcc] - Blind carbon copy recipient(s)
 * @param {Array<Object>} [options.attachments] - Array of attachment objects
 * @returns {Promise<Object>} Resend API response data
 * @throws {Object} Throws error with statusCode and message for global error handler
 */
export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  from = process.env.EMAIL_FROM || "CommerceHub <onboarding@resend.dev>",
  replyTo,
  cc,
  bcc,
  attachments,
}) => {
  if (!to) {
    throw {
      statusCode: 400,
      message: "Email sending failed: Recipient ('to') address is required.",
    };
  }

  if (!subject) {
    throw {
      statusCode: 400,
      message: "Email sending failed: Email 'subject' is required.",
    };
  }

  if (!html && !text) {
    throw {
      statusCode: 400,
      message: "Email sending failed: Email 'html' or 'text' content is required.",
    };
  }

  try {
    const payload = {
      from,
      to,
      subject,
      ...(html && { html }),
      ...(text && { text }),
      ...(replyTo && { reply_to: replyTo }),
      ...(cc && { cc }),
      ...(bcc && { bcc }),
      ...(attachments && { attachments }),
    };

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      console.error("Resend Email API Error:", error);
      throw {
        statusCode: error.statusCode || 500,
        message: `Email sending failed: ${error.message || "Unknown Resend error"}`,
        errors: [error.name || "ResendError"],
      };
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`✉️ Email successfully dispatched to ${Array.isArray(to) ? to.join(", ") : to}. ID: ${data?.id}`);
    }

    return data;
  } catch (err) {
    // Re-throw if already formatted
    if (err.statusCode) {
      throw err;
    }

    console.error("Unexpected Email Sender Error:", err);
    throw {
      statusCode: 500,
      message: `Failed to send email: ${err.message || "Internal server error during email dispatch."}`,
    };
  }
};

export default sendEmail;
