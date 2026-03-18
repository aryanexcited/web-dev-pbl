const { closeDB, connectDB } = require("./db");
const {
  AuthToken,
  Category,
  Customer,
  InventoryLog,
  Order,
  Payment,
  Product,
  Receipt,
  Supplier,
  User
} = require("./models");
const productService = require("./services/productService");
const orderService = require("./services/orderService");

async function resetCollections() {
  await Promise.all([
    AuthToken.deleteMany({}),
    Receipt.deleteMany({}),
    Payment.deleteMany({}),
    InventoryLog.deleteMany({}),
    Order.deleteMany({}),
    Product.deleteMany({}),
    Category.deleteMany({}),
    Supplier.deleteMany({}),
    Customer.deleteMany({}),
    User.deleteMany({})
  ]);
}

async function seedBaseData() {
  const user = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    phone: "9876543210",
    role: "admin"
  });

  const customer = await Customer.create({
    name: "Walk In Customer",
    phone: "9000000001",
    email: "customer@example.com",
    address: "Main Market Road",
    loyaltyPoints: 10,
    totalSpent: 0
  });

  const category = await Category.create({
    name: "Groceries",
    description: "Daily grocery items"
  });

  const supplier = await Supplier.create({
    name: "Ravi Kumar",
    companyName: "Fresh Supply Co",
    phone: "9000000002",
    email: "supplier@example.com",
    address: "Warehouse Street",
    gstNumber: "GST123456789"
  });

  const product = await productService.createProduct({
    name: "Basmati Rice",
    sku: "RICE-001",
    barcode: "8901234567890",
    categoryId: category._id,
    brand: "Daily Needs",
    costPrice: 50,
    sellingPrice: 70,
    discount: 5,
    tax: 12,
    stock: 100,
    minStockLevel: 10,
    unit: "kg",
    image: "rice.png",
    description: "Premium rice pack",
    supplierId: supplier._id,
    manufactureDate: new Date("2026-03-01"),
    expiryDate: new Date("2027-03-01")
  });

  return { user, customer, category, supplier, product };
}

async function runTests() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    await resetCollections();
    console.log("Cleared existing test data");

    const { user, customer, category, supplier, product } = await seedBaseData();

    const order = await orderService.createOrder({
      orderNumber: "ORD-1001",
      userId: user._id,
      customerId: customer._id,
      items: [{ productId: product._id, quantity: 2 }],
      paymentStatus: "paid",
      orderStatus: "completed",
      paymentMethod: "upi",
      amountPaid: 154,
      changeReturned: 0,
      notes: "Sample sale for schema validation",
      payment: {
        paymentMethod: "upi",
        amount: 154,
        transactionId: "TXN-1001",
        status: "success"
      },
      receipt: {
        receiptNumber: "RCPT-1001",
        printed: true,
        printedAt: new Date()
      }
    });

    const payment = await Payment.findOne({ orderId: order._id });
    const inventoryLog = await InventoryLog.findOne({ referenceId: order._id });
    const receipt = await Receipt.findOne({ orderId: order._id });
    const refreshedProduct = await productService.getProductById(product._id);

    const authToken = await AuthToken.create({
      userId: user._id,
      token: "sample-refresh-token-1001",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    console.log("User:", user.email);
    console.log("Customer:", customer.name);
    console.log("Category:", category.name);
    console.log("Supplier:", supplier.companyName);
    console.log("Product stock after sale:", refreshedProduct.stock);
    console.log("Order:", order.orderNumber, "Grand Total:", order.grandTotal);
    console.log("Payment status:", payment.status);
    console.log("Inventory log reason:", inventoryLog.reason);
    console.log("Receipt:", receipt.receiptNumber);
    console.log("Auth token created for user:", authToken.userId.toString());
    console.log("All database tests completed successfully");
  } catch (error) {
    console.error("Database test failed:", error.message);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

runTests();
