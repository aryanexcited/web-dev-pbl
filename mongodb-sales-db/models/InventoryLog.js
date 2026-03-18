const mongoose = require("mongoose");

const inventoryLogSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    type: {
      type: String,
      enum: ["in", "out"],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    reason: {
      type: String,
      enum: ["sale", "restock", "damage"],
      required: true
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

inventoryLogSchema.index({ productId: 1, createdAt: -1 });
inventoryLogSchema.index({ referenceId: 1 });

module.exports = mongoose.model("InventoryLog", inventoryLogSchema);
