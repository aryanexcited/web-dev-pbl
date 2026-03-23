const express = require("express");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    message: "API is running"
  });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message || "Internal service error"
  });
});

module.exports = app;