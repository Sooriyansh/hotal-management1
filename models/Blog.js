const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    body: String,
    coverImage: String,
    tags: [String],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
    seo: {
      title: String,
      description: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Blog || mongoose.model("Blog", blogSchema, "blogs");
