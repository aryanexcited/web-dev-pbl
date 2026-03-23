const mongoose = require("mongoose");

const DEFAULT_URI = "mongodb://127.0.0.1:27017/product_sales_db";

function getMongoUri() {
  return process.env.MONGO_URI || DEFAULT_URI;
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(getMongoUri());
  return mongoose.connection;
}

async function closeDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
}

module.exports = {
  connectDB,
  closeDB,
  getMongoUri
};
