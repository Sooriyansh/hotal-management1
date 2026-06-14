const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    actorName: String,
    actorRole: String,
    action: { type: String, required: true, index: true },
    module: { type: String, required: true, index: true },
    targetId: String,
    targetLabel: String,
    ip: String,
    userAgent: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });

module.exports =
  mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema, "activityLogs");
