const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    address: {
      type: String,
      trim: true,
      default: ""
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: 0
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0
    },
    lastVisit: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

customerSchema.index({ phone: 1 }, { unique: true });
customerSchema.index({ email: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Customer", customerSchema);
