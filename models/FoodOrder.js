const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" },
    name: String,
    quantity: Number,
    price: Number,
    notes: String
  },
  { _id: false }
);

const foodOrderSchema = new mongoose.Schema(
  {
    orderNo: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [orderItemSchema],
    orderType: {
      type: String,
      enum: ["Table Order", "Room Service", "Online Delivery"],
      required: true
    },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
    roomBooking: { type: mongoose.Schema.Types.ObjectId, ref: "RoomBooking" },
    deliveryAddress: String,
    subtotal: Number,
    gst: Number,
    total: Number,
    kitchenStatus: {
      type: String,
      enum: ["Received", "Pending", "Accepted", "Preparing", "Plating", "Ready", "Served", "Delivered", "Cancelled"],
      default: "Received"
    },
    statusHistory: [
      {
        status: String,
        at: { type: Date, default: Date.now },
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
      }
    ]
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.FoodOrder || mongoose.model("FoodOrder", foodOrderSchema, "foodOrders");
