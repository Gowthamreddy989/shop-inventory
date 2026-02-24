const express = require("express");
const router = express.Router();

// In-memory storage for demo (replace with SQLite if needed)
let products = [];
let salesHistory = [];

// GET PRODUCTS
router.get("/", (req, res) => {
    res.json(products);
});

// ADD PRODUCT
router.post("/", (req, res) => {
    const { name, cost_price, selling_price, quantity } = req.body;
    const id = products.length + 1;
    products.push({ id, name, cost_price, selling_price, quantity });
    res.json({ message: "Product added", id });
});

// SELL PRODUCT
router.post("/sales", (req, res) => {
    const { product_id, quantity } = req.body;
    const product = products.find(p => p.id === product_id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.quantity < quantity) return res.status(400).json({ message: "Not enough stock" });

    product.quantity -= quantity;
    const profit = (product.selling_price - product.cost_price) * quantity;
    salesHistory.push({ product_id, quantity, profit, date: new Date() });

    res.json({ message: "Sale recorded", profit });
});

// PURCHASE / RESTOCK
router.post("/purchase", (req, res) => {
    const { product_id, quantity, cost_price } = req.body;
    const product = products.find(p => p.id === product_id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.quantity += quantity;
    product.cost_price = cost_price;
    res.json({ message: "Stock updated" });
});

// REPORTS
router.get("/reports/daily", (req, res) => {
    const today = new Date().toDateString();
    const filtered = salesHistory.filter(s => new Date(s.date).toDateString() === today);

    const total_sales = filtered.reduce((a, b) => a + (products.find(p => p.id === b.product_id).selling_price * b.quantity), 0);
    const total_profit = filtered.reduce((a, b) => a + b.profit, 0);

    res.json({ total_sales, total_profit });
});

router.get("/reports/monthly", (req, res) => {
    const now = new Date();
    const filtered = salesHistory.filter(s => {
        const d = new Date(s.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const total_sales = filtered.reduce((a, b) => a + (products.find(p => p.id === b.product_id).selling_price * b.quantity), 0);
    const total_profit = filtered.reduce((a, b) => a + b.profit, 0);

    res.json({ total_sales, total_profit });
});

router.get("/reports/yearly", (req, res) => {
    const now = new Date();
    const filtered = salesHistory.filter(s => new Date(s.date).getFullYear() === now.getFullYear());

    const total_sales = filtered.reduce((a, b) => a + (products.find(p => p.id === b.product_id).selling_price * b.quantity), 0);
    const total_profit = filtered.reduce((a, b) => a + b.profit, 0);

    res.json({ total_sales, total_profit });
});

module.exports = router;