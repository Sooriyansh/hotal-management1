const mongoose = require("mongoose");

const tableBookingSchema = new mongoose.Schema(
  {
    bookingNo: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
    guestName: String,
    email: String,
    phone: String,
    reservationDate: Date,
    reservationTime: String,
    guests: Number,
    mealType: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Chef Table", "High Tea"]
    },
    notes: String,
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Seated", "Completed", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

tableBookingSchema.index({ reservationDate: 1, reservationTime: 1 });

module.exports =
  mongoose.models.TableBooking ||
  mongoose.model("TableBooking", tableBookingSchema, "tableBookings");
