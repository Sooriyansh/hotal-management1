const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: String,
    interests: [String],
    isSubscribed: { type: Boolean, default: true },
    subscribedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Newsletter || mongoose.model("Newsletter", newsletterSchema, "newsletters");
