const mongoose = require("mongoose");

const reviewSnapshotSchema = new mongoose.Schema(
  {
    userName: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String
  },
  { timestamps: true, _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      enum: ["Deluxe", "Executive", "Family", "Suite", "Presidential"],
      required: true
    },
    description: String,
    images: [String],
    videoUrl: String,
    amenities: [String],
    basePrice: { type: Number, required: true },
    seasonalPricing: [
      {
        label: String,
        startDate: Date,
        endDate: Date,
        price: Number
      }
    ],
    discountRules: [
      {
        code: String,
        percentage: Number,
        startsAt: Date,
        endsAt: Date
      }
    ],
    availabilityCalendar: [
      {
        date: Date,
        availableUnits: Number,
        price: Number
      }
    ],
    capacity: Number,
    roomSize: String,
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    reviews: [reviewSnapshotSchema],
    tourUrl: String,
    compareTags: [String],
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

roomSchema.index({ category: 1, basePrice: 1 });

module.exports = mongoose.models.Room || mongoose.model("Room", roomSchema, "rooms");
