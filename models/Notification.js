const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: String,
    title: String,
    message: String,
    type: {
      type: String,
      enum: ["Booking", "Order", "Payment", "Membership", "System", "Concierge"],
      default: "System"
    },
    severity: {
      type: String,
      enum: ["Success", "Warning", "Info", "Error"],
      default: "Info"
    },
    readAt: Date,
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, readAt: 1 });

module.exports =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema, "notifications");
