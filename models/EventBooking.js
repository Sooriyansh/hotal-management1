const mongoose = require("mongoose");

const eventBookingSchema = new mongoose.Schema(
  {
    bookingNo: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    guestName: String,
    eventDate: Date,
    guests: Number,
    customQuote: Number,
    depositAmount: Number,
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    notes: String,
    status: {
      type: String,
      enum: ["Inquiry", "Quoted", "Confirmed", "Completed", "Cancelled"],
      default: "Inquiry"
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.EventBooking || mongoose.model("EventBooking", eventBookingSchema, "eventBookings");
