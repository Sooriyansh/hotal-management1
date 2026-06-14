const mongoose = require("mongoose");

const membershipTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    membership: { type: mongoose.Schema.Types.ObjectId, ref: "Membership" },
    transactionNo: { type: String, unique: true },
    amount: Number,
    points: Number,
    type: {
      type: String,
      enum: ["Purchase", "Renewal", "Upgrade", "Reward Redemption", "Referral"],
      required: true
    },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.MembershipTransaction ||
  mongoose.model("MembershipTransaction", membershipTransactionSchema, "membershipTransactions");
