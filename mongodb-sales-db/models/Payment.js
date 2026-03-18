const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi"],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    transactionId: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      required: true
    },
    paymentDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

paymentSchema.index({ orderId: 1, createdAt: -1 });
paymentSchema.index({ transactionId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Payment", paymentSchema);
