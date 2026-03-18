const mongoose = require("mongoose");
const { InventoryLog, Order, Payment, Product, Receipt } = require("../models");

function withOptions(base = {}, session) {
  return session ? { ...base, session } : base;
}

function buildOrderItem(product, quantity) {
  const baseAmount = product.sellingPrice * quantity;
  const discountAmount = product.discount * quantity;
  const taxAmount = product.tax * quantity;

  return {
    productId: product._id,
    name: product.name,
    sku: product.sku,
    quantity,
    price: product.sellingPrice,
    discount: discountAmount,
    tax: taxAmount,
    total: baseAmount - discountAmount + taxAmount
  };
}

function buildOrderSummary(items) {
  return items.reduce(
    (summary, item) => {
      summary.totalItems += item.quantity;
      summary.subTotal += item.price * item.quantity;
      summary.totalDiscount += item.discount;
      summary.totalTax += item.tax;
      summary.grandTotal += item.total;
      return summary;
    },
    {
      totalItems: 0,
      subTotal: 0,
      totalDiscount: 0,
      totalTax: 0,
      grandTotal: 0
    }
  );
}

async function persistOrder(payload, session = null) {
  const orderItems = [];
  const inventoryLogIds = [];

  for (const entry of payload.items) {
    const product = await Product.findOneAndUpdate(
      { _id: entry.productId, stock: { $gte: entry.quantity } },
      { $inc: { stock: -entry.quantity } },
      withOptions({ returnDocument: "after" }, session)
    );

    if (!product) {
      throw new Error("Unable to create order because stock is not available");
    }

    const orderItem = buildOrderItem(product, entry.quantity);
    orderItems.push(orderItem);

    const [inventoryLog] = await InventoryLog.create(
      [
        {
          productId: product._id,
          type: "out",
          quantity: entry.quantity,
          reason: "sale",
          referenceId: null
        }
      ],
      withOptions({}, session)
    );

    inventoryLogIds.push(inventoryLog._id);
  }

  const totals = buildOrderSummary(orderItems);

  const [createdOrder] = await Order.create(
    [
      {
        orderNumber: payload.orderNumber,
        userId: payload.userId,
        customerId: payload.customerId || null,
        items: orderItems,
        ...totals,
        paymentStatus: payload.paymentStatus,
        orderStatus: payload.orderStatus,
        paymentMethod: payload.paymentMethod,
        amountPaid: payload.amountPaid,
        changeReturned: payload.changeReturned || 0,
        notes: payload.notes || ""
      }
    ],
    withOptions({}, session)
  );

  await InventoryLog.updateMany(
    { _id: { $in: inventoryLogIds } },
    { $set: { referenceId: createdOrder._id } },
    withOptions({}, session)
  );

  if (payload.payment) {
    await Payment.create(
      [
        {
          orderId: createdOrder._id,
          paymentMethod: payload.payment.paymentMethod,
          amount: payload.payment.amount,
          transactionId: payload.payment.transactionId,
          status: payload.payment.status,
          paymentDate: payload.payment.paymentDate || new Date()
        }
      ],
      withOptions({}, session)
    );
  }

  if (payload.receipt) {
    await Receipt.create(
      [
        {
          orderId: createdOrder._id,
          receiptNumber: payload.receipt.receiptNumber,
          printed: payload.receipt.printed,
          printedAt: payload.receipt.printedAt || null
        }
      ],
      withOptions({}, session)
    );
  }

  return createdOrder;
}

function isTransactionUnsupported(error) {
  return (
    error &&
    typeof error.message === "string" &&
    error.message.includes("Transaction numbers are only allowed on a replica set member or mongos")
  );
}

async function createOrder(payload) {
  const session = await mongoose.startSession();

  try {
    let createdOrder = null;

    try {
      await session.withTransaction(async () => {
        createdOrder = await persistOrder(payload, session);
      });
      return createdOrder;
    } catch (error) {
      if (!isTransactionUnsupported(error)) {
        throw error;
      }
    }

    return persistOrder(payload);
  } finally {
    await session.endSession();
  }
}

function listOrders(filter = {}) {
  return Order.find(filter).sort({ createdAt: -1 });
}

function getOrderById(orderId) {
  return Order.findById(orderId);
}

module.exports = {
  buildOrderItem,
  buildOrderSummary,
  createOrder,
  listOrders,
  getOrderById
};
