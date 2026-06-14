const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: String,
    targetType: {
      type: String,
      enum: ["Room", "FoodItem", "Restaurant", "SpaService", "Event"],
      required: true
    },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    images: [String],
    isApproved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

reviewSchema.index({ targetType: 1, targetId: 1 });

module.exports = mongoose.models.Review || mongoose.model("Review", reviewSchema, "reviews");
