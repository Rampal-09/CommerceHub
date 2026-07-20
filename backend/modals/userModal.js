import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, minlength: 2, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },

    password: { type: String, minlength: 6, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },

  { timestamps: true },
);

export default mongoose.model("user", userSchema);
