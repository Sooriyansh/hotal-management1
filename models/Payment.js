const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentNo: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    currency: { type: String, default: "USD" },
    gateway: { type: String, default: "UI Demo" },
    method: {
      type: String,
      enum: ["Card", "UPI", "Net Banking", "Wallet", "Cash", "UI Demo"],
      default: "UI Demo"
    },
    status: {
      type: String,
      enum: ["Pending", "Authorized", "Paid", "Failed", "Refunded"],
      default: "Pending"
    },
    transactionId: String,
    invoiceNo: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

module.exports = mongoose.models.Payment || mongoose.model("Payment", paymentSchema, "payments");
