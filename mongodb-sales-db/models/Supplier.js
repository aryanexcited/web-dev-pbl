const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    address: {
      type: String,
      trim: true,
      default: ""
    },
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

supplierSchema.index({ email: 1 }, { unique: true });
supplierSchema.index({ gstNumber: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Supplier", supplierSchema);
