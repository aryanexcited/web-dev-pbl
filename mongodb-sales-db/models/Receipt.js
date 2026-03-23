const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    printed: {
      type: Boolean,
      default: false
    },
    printedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

receiptSchema.index({ orderId: 1 }, { unique: true });

module.exports = mongoose.model("Receipt", receiptSchema);
