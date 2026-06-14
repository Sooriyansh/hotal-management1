const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["Wedding", "Corporate", "Birthday", "Conference", "Private Dining"],
      required: true
    },
    image: String,
    capacity: Number,
    basePrice: Number,
    packageFeatures: [String],
    availabilityCalendar: [
      {
        date: Date,
        status: {
          type: String,
          enum: ["Available", "Tentative", "Booked", "Blocked"],
          default: "Available"
        }
      }
    ],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema, "events");
