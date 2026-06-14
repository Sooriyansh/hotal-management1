const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    subject: String,
    message: String,
    source: {
      type: String,
      enum: ["Contact", "Concierge", "Event Quote", "Newsletter"],
      default: "Contact"
    },
    status: {
      type: String,
      enum: ["New", "Assigned", "Resolved", "Archived"],
      default: "New"
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Contact || mongoose.model("Contact", contactSchema, "contacts");
