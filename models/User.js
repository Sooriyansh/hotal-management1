const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const activitySchema = new mongoose.Schema(
  {
    action: String,
    ip: String,
    userAgent: String,
    meta: mongoose.Schema.Types.Mixed
  },
  { timestamps: true, _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: [
        "Super Admin",
        "Hotel Manager",
        "Restaurant Manager",
        "Receptionist",
        "Chef",
        "Waiter",
        "Spa Manager",
        "Event Manager",
        "Customer"
      ],
      default: "Customer"
    },
    avatar: String,
    membershipTier: {
      type: String,
      enum: ["None", "Silver", "Gold", "Platinum", "Diamond"],
      default: "None"
    },
    loyaltyPoints: { type: Number, default: 0 },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
    preferences: {
      roomType: String,
      cuisine: String,
      pillow: String,
      accessibility: Boolean
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLoginAt: Date,
    activityLogs: [activitySchema],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema, "users");
