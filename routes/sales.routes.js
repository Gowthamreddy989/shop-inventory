const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Sell product
router.post("/", (req, res) => {
    const { product_id, quantity } = req.body;

    // Get product info
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(product_id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < quantity) {
        return res.status(400).json({ message: "Not enough stock" });
    }

    // Calculate total amount & profit
    const total_amount = product.selling_price * quantity;
    const profit = (product.selling_price - product.cost_price) * quantity;

    // Insert into sales table
    db.prepare(`
        INSERT INTO sales (product_id, quantity, total_amount, profit)
        VALUES (?, ?, ?, ?)
    `).run(product_id, quantity, total_amount, profit);

    // Reduce stock
    db.prepare(`
        UPDATE products SET quantity = quantity - ? WHERE id = ?
    `).run(quantity, product_id);

    res.json({
        message: "Product sold successfully",
        product: product.name,
        quantity_sold: quantity,
        total_amount,
        profit,
        remaining_stock: product.quantity - quantity
    });
});

module.exports = router;