const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    quote: String,
    rating: { type: Number, min: 1, max: 5, default: 5 },
    avatar: String,
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema, "testimonials");
