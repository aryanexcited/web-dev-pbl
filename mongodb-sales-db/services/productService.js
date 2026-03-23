const { Product } = require("../models");

async function createProduct(payload, options = {}) {
  const product = new Product(payload);
  return product.save(options);
}

function listProducts(filter = {}) {
  return Product.find(filter).sort({ createdAt: -1 });
}

function getProductById(productId) {
  return Product.findById(productId);
}

function updateProduct(productId, updates, options = {}) {
  return Product.findByIdAndUpdate(productId, updates, {
    runValidators: true,
    returnDocument: "after",
    ...options
  });
}

function deleteProduct(productId, options = {}) {
  return Product.findByIdAndDelete(productId, options);
}

async function decreaseStock(productId, quantity, options = {}) {
  const product = await Product.findOneAndUpdate(
    { _id: productId, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    {
      returnDocument: "after",
      ...options
    }
  );

  if (!product) {
    throw new Error("Insufficient stock or invalid product");
  }

  return product;
}

module.exports = {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  decreaseStock
};
