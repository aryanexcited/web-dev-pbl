const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    barcode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    brand: {
      type: String,
      trim: true,
      default: ""
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0
    },
    sellingPrice: {
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
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    minStockLevel: {
      type: Number,
      default: 0,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      enum: ["pcs", "kg", "liter"]
    },
    image: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true
    },
    expiryDate: {
      type: Date,
      default: null
    },
    manufactureDate: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ name: 1 });
productSchema.index({ categoryId: 1, isActive: 1 });
productSchema.index({ supplierId: 1 });

module.exports = mongoose.model("Product", productSchema);
