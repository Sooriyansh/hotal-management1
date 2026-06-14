const mongoose = require("mongoose");

const spaServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String,
    durationMinutes: Number,
    price: Number,
    therapistRoles: [String],
    inclusions: [String],
    privateSuite: Boolean,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.SpaService || mongoose.model("SpaService", spaServiceSchema, "spaServices");
