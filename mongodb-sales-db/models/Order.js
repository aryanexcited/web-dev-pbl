const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    sku: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: false
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator(items) {
          return items.length > 0;
        },
        message: "At least one order item is required"
      }
    },
    totalItems: {
      type: Number,
      required: true,
      min: 1
    },
    subTotal: {
      type: Number,
      required: true,
      min: 0
    },
    totalDiscount: {
      type: Number,
      default: 0,
      min: 0
    },
    totalTax: {
      type: Number,
      default: 0,
      min: 0
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "partial"],
      default: "unpaid"
    },
    orderStatus: {
      type: String,
      enum: ["completed", "cancelled"],
      default: "completed"
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi"],
      required: true
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0
    },
    changeReturned: {
      type: Number,
      default: 0,
      min: 0
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, orderStatus: 1 });

module.exports = mongoose.model("Order", orderSchema);
