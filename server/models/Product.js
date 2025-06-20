const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: Number,
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    stock: Number,
    image: String,
    imageId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
