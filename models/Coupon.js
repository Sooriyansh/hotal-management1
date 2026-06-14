const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    description: String,
    discountType: {
      type: String,
      enum: ["Percentage", "Fixed"],
      default: "Percentage"
    },
    discountValue: Number,
    appliesTo: {
      type: String,
      enum: ["Rooms", "Restaurant", "Spa", "Events", "Memberships", "All"],
      default: "All"
    },
    minSpend: Number,
    maxDiscount: Number,
    startsAt: Date,
    endsAt: Date,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema, "coupons");
