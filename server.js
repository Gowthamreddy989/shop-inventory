const express = require("express");
const cors = require("cors");
const session = require("express-session");
const productRoutes = require("./routes/product.routes");

const app = express();
app.use(cors());
app.use(express.json());

// SESSION
app.use(session({
    secret: "shop-secret-key",
    resave: false,
    saveUninitialized: true
}));

// LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "1234") {
        req.session.user = username;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

// LOGOUT
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out" });
});

// AUTH CHECK
function checkAuth(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}

// STATIC FILES
app.use((req, res, next) => {
    if (req.path === "/login" || req.path === "/login.html") return next();
    if (!req.session.user) return res.redirect("/login.html");
    next();
});
app.use(express.static("public"));

// ROUTES
app.use("/products", checkAuth, productRoutes);

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});