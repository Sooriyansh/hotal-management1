const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: mongoose.Schema.Types.Mixed,
    group: {
      type: String,
      enum: ["Homepage", "Rooms", "Restaurant", "Offers", "FAQ", "System", "SEO"],
      default: "System"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Setting || mongoose.model("Setting", settingSchema, "settings");
