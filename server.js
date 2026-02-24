const express = require("express");
const cors = require("cors");
const session = require("express-session");

const productRoutes = require("./routes/product.routes");
const reportRoutes = require("./routes/report.routes");

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: "shop-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    }
}));

// LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        req.session.user = username;
        return res.json({ success: true });
    }

    res.status(401).json({ success: false });
});

// LOGOUT
app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out" });
    });
});

// AUTH CHECK
function checkAuth(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}

// STATIC
app.use(express.static("public"));

// ROUTES
app.use("/products", checkAuth, productRoutes);
app.use("/reports", checkAuth, reportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});