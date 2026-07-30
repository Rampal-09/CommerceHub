import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, minlength: 2, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, minlength: 6, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    phone: { type: String, trim: true, default: "" },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
      default: "Prefer not to say",
    },
    dateOfBirth: { type: Date },
    avatar: {
      public_id: { type: String, default: "" },
      url: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);
