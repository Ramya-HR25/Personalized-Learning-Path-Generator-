import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    // Single path for backward compatibility
    preferences: { type: mongoose.Schema.Types.Mixed, default: null },
    path: { type: mongoose.Schema.Types.Mixed, default: null },
    // Multiple paths support (enhanced with pathId, purpose, level metadata)
    paths: { type: [mongoose.Schema.Types.Mixed], default: [] },
    // Currently active path ID (supports both topic and pathId)
    activePathId: { type: String, default: null },
    activity: { type: [mongoose.Schema.Types.Mixed], default: [] },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model("User", userSchema);
