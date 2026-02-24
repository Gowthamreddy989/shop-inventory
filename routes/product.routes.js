const express = require("express");
const router = express.Router();
const db = require("../database");

// GET ALL PRODUCTS
router.get("/", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
});

// ADD PRODUCT
router.post("/", (req, res) => {
    const { name, cost_price, selling_price, quantity } = req.body;

    db.prepare(`
        INSERT INTO products (name, cost_price, selling_price, quantity)
        VALUES (?, ?, ?, ?)
    `).run(name, cost_price, selling_price, quantity);

    res.json({ message: "Product added successfully" });
});

// SELL PRODUCT  ✅ FIXED
router.post("/sell", (req, res) => {
    const { product_id, quantity } = req.body;

    const product = db.prepare(
        "SELECT * FROM products WHERE id = ?"
    ).get(product_id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < quantity) {
        return res.status(400).json({ message: "Not enough stock" });
    }

    // Reduce stock
    db.prepare(
        "UPDATE products SET quantity = quantity - ? WHERE id = ?"
    ).run(quantity, product_id);

    res.json({ message: "Product sold successfully" });
});

// PURCHASE / RESTOCK
router.post("/purchase", (req, res) => {
    const { product_id, quantity, cost_price } = req.body;

    db.prepare(`
        UPDATE products
        SET quantity = quantity + ?, cost_price = ?
        WHERE id = ?
    `).run(quantity, cost_price, product_id);

    res.json({ message: "Stock updated successfully" });
});

module.exports = router;