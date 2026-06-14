import mongoose from "mongoose";

const catalogSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    overview: { type: String, required: true },
    estimatedHours: { type: Number, required: true },
    chapters: { type: [mongoose.Schema.Types.Mixed], default: [] }
  },
  {
    timestamps: true
  }
);

export const Catalog = mongoose.model("Catalog", catalogSchema);
