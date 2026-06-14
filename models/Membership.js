const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
  {
    tier: {
      type: String,
      enum: ["Silver", "Gold", "Platinum", "Diamond"],
      unique: true,
      required: true
    },
    price: Number,
    pointsAwarded: Number,
    benefits: [String],
    diningDiscount: Number,
    spaCredits: Number,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Membership || mongoose.model("Membership", membershipSchema, "memberships");
