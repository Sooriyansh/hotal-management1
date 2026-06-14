const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: String,
    category: {
      type: String,
      enum: ["Homepage", "Rooms", "Restaurant", "Spa", "Events", "Virtual Tour"],
      default: "Homepage"
    },
    imageUrl: String,
    videoUrl: String,
    alt: String,
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Gallery || mongoose.model("Gallery", gallerySchema, "galleries");
