const mongoose = require("mongoose");

const spaBookingSchema = new mongoose.Schema(
  {
    bookingNo: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "SpaService" },
    guestName: String,
    scheduledAt: Date,
    therapist: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    suitePreference: String,
    amount: Number,
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.SpaBooking || mongoose.model("SpaBooking", spaBookingSchema, "spaBookings");
