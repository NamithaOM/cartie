const express = require("express");
const router = express.Router();
const { addToCart, getCart } = require("../controllers/cartController");

// Add item to cart
router.post("/add", addToCart);

// Get cart items by user ID
router.get("/:userId", getCart);

module.exports = router;
