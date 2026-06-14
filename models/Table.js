const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    seats: Number,
    zone: String,
    status: {
      type: String,
      enum: ["Available", "Reserved", "Occupied", "Cleaning", "Blocked"],
      default: "Available"
    },
    qrCodeUrl: String,
    coordinates: {
      x: Number,
      y: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Table || mongoose.model("Table", tableSchema, "tables");
