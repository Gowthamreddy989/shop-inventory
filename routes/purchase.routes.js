// const express = require("express");
// const router = express.Router();
// const db = require("../config/db");

// // Add stock (Purchase / Restock)
// router.post("/", (req, res) => {
//     const { product_id, quantity, cost_price } = req.body;

//     const product = db.prepare("SELECT * FROM products WHERE id = ?").get(product_id);

//     if (!product) {
//         return res.status(404).json({ message: "Product not found" });
//     }

//     // Insert purchase record
//     db.prepare(`
//         INSERT INTO purchases (product_id, quantity, cost_price)
//         VALUES (?, ?, ?)
//     `).run(product_id, quantity, cost_price);

//     // Update stock quantity
//     db.prepare(`
//         UPDATE products SET quantity = quantity + ? WHERE id = ?
//     `).run(quantity, product_id);

//     res.json({
//         message: "Stock added successfully",
//         product: product.name,
//         quantity_added: quantity,
//         new_stock: product.quantity + quantity
//     });
// });

// module.exports = router;