const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    images: [String],
    videoUrl: String,
    cuisineTypes: [String],
    openingHours: [
      {
        day: String,
        opens: String,
        closes: String
      }
    ],
    reservationRules: {
      depositRequired: Boolean,
      maxPartySize: Number,
      cancellationWindowHours: Number
    },
    isOpen: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Restaurant || mongoose.model("Restaurant", restaurantSchema, "restaurants");
