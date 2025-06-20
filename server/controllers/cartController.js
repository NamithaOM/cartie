const Cart = require("../models/Cart");

// Add to cart
exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let item = await Cart.findOne({ userId, productId });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      await Cart.create({ userId, productId, quantity });
    }

    res.json({ message: "Item added to cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get cart items for a user
exports.getCart = async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.params.userId }).populate("productId");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
