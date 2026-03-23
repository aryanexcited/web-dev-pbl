const mongoose = require("mongoose");

const authTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    token: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

authTokenSchema.index({ userId: 1, expiresAt: 1 });
authTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("AuthToken", authTokenSchema);
