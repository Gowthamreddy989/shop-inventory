const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* -------------------- DAILY REPORT -------------------- */
router.get("/daily", (req, res) => {
    const todaySales = db.prepare(`
        SELECT 
            SUM(total_amount) as total_sales,
            SUM(profit) as total_profit
        FROM sales
        WHERE date(date) = date('now')
    `).get();

    res.json({
        date: new Date().toISOString().split("T")[0],
        total_sales: todaySales.total_sales || 0,
        total_profit: todaySales.total_profit || 0
    });
});

/* -------------------- MONTHLY REPORT -------------------- */
router.get("/monthly", (req, res) => {
    const monthly = db.prepare(`
        SELECT 
            SUM(total_amount) as total_sales,
            SUM(profit) as total_profit
        FROM sales
        WHERE strftime('%m', date) = strftime('%m', 'now')
        AND strftime('%Y', date) = strftime('%Y', 'now')
    `).get();

    res.json({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        total_sales: monthly.total_sales || 0,
        total_profit: monthly.total_profit || 0
    });
});

/* -------------------- YEARLY REPORT -------------------- */
router.get("/yearly", (req, res) => {
    const yearly = db.prepare(`
        SELECT 
            SUM(total_amount) as total_sales,
            SUM(profit) as total_profit
        FROM sales
        WHERE strftime('%Y', date) = strftime('%Y', 'now')
    `).get();

    res.json({
        year: new Date().getFullYear(),
        total_sales: yearly.total_sales || 0,
        total_profit: yearly.total_profit || 0
    });
});

/* -------------------- STOCK VALUE REPORT -------------------- */
router.get("/stock", (req, res) => {
    const stock = db.prepare(`
        SELECT 
            SUM(quantity * cost_price) as total_stock_value
        FROM products
    `).get();

    res.json({
        total_stock_value: stock.total_stock_value || 0
    });
});

module.exports = router;