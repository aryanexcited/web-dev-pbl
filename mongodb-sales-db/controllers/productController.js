const mongoose = require("mongoose");
const Product = require("../models/Product");

async function createProduct(req, res) {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

async function getProducts(req, res) {
    try {
        const filter = {};

        if (req.query.categoryId) {
                filter.categoryId = req.query.categoryId;
            }

        if (req.query.supplierId) {
            filter.supplierId = req.query.supplierId;
        }

        if (req.query.isActive !== undefined){
            filter.isActive = req.query.isActive === "true";
        }

        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } 
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function getProductById(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product id"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function updateProduct(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product id"
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                runValidators: true,
                returnDocument: "after"
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

async function deleteProduct(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product id"
            });
        }

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};