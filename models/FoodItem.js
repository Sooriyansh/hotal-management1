const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Indian", "Chinese", "Italian", "Desserts", "Beverages"],
      required: true
    },
    image: String,
    videoUrl: String,
    ingredients: [String],
    calories: Number,
    allergens: [String],
    price: Number,
    chefNotes: String,
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isVegetarian: Boolean,
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

foodItemSchema.index({ category: 1, isAvailable: 1 });

module.exports = mongoose.models.FoodItem || mongoose.model("FoodItem", foodItemSchema, "foodItems");
