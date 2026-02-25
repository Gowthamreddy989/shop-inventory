const express = require("express");
const router = express.Router();
const db = require("../config/db");

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