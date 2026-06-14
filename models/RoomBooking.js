const mongoose = require("mongoose");

const roomBookingSchema = new mongoose.Schema(
  {
    bookingNo: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    guestName: String,
    email: String,
    phone: String,
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, min: 1 },
    roomCategory: String,
    couponCode: String,
    subtotal: Number,
    discount: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    total: Number,
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    invoiceNo: String,
    assignedRoom: String,
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    checkedInAt: Date,
    checkedOutAt: Date,
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Checked In", "Checked Out", "Cancelled", "Refunded"],
      default: "Pending"
    },
    cancellation: {
      cancelledAt: Date,
      reason: String,
      refundAmount: Number,
      refundStatus: String
    }
  },
  { timestamps: true }
);

roomBookingSchema.index({ checkIn: 1, checkOut: 1, roomCategory: 1 });

module.exports =
  mongoose.models.RoomBooking ||
  mongoose.model("RoomBooking", roomBookingSchema, "roomBookings");
