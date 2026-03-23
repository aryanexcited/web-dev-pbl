const mongoose = require("mongoose");
const orderService = require("../services/orderService");

async function createOrder(req, res) {
    try {
        const order = await orderService.createOrder(req.body);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

async function getOrders(req, res) {
    try {
        const filter = {};

        if (req.query.userId) {
            filter.userId = req.query.userId;
        }

        if (req.query.status) {
            filter.customerId = req.query.customerId;
        }

        if (req.query.paymentStatus) {
            filter.paymentstatus = req.query.paymentStatus;
        }

        const orders = await orderService.listOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function getOrderById(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid order id"
            });
        }

        const order = await orderService.getOrderById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    createOrder,
    getOrders,
    getOrderById
};