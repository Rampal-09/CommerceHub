import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn("⚠️ Warning: RESEND_API_KEY environment variable is not defined.");
}

export const resend = new Resend(apiKey || "re_dummy_key_for_initialization");

export default resend;
