const Product = require("../models/Product");
const mongoose = require("mongoose");
const User = require("../models/User");
const Category = require("../models/Category"); 
const Cart = require("../models/Cart");

let bucket;
mongoose.connection.once("open", () => {
  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "productImage",
  });
});

function applyDynamicPricing(products, visitCount) {
  return products.map((product) => {
    let dynamicPrice = product.price;
    if (visitCount > 10) dynamicPrice *= 0.8;
    else if (visitCount > 5) dynamicPrice *= 0.9;
    return {
      ...product.toObject(),
      dynamicPrice: parseFloat(dynamicPrice.toFixed(2)),
    };
  });
}



exports.getAllProducts = async (req, res) => {
  try {
    const userId = req.user?.id;
    let visitCount = 0;

    if (userId) {
      const user = await User.findById(userId);
      visitCount = user?.visitCount || 0;
    }

    const products = await Product.find().populate("category");
    const pricedProducts = applyDynamicPricing(products, visitCount);

    res.status(200).json(pricedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductImage = async (req, res) => {
  try {
    const { filename } = req.params;

    const files = await bucket.find({ filename }).toArray();
    if (files.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const downloadStream = bucket.openDownloadStreamByName(filename);
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving image" });
  }
};


exports.createOrUpdateProduct = async (req, res) => {
  try {
    const { id, name, price, description, category, stock } = req.body;

    let imageFileName = null;
    let imageId = null;

    if (req.file) {
      const uploadStream = bucket.openUploadStream(req.file.originalname);
      uploadStream.end(req.file.buffer);

      await new Promise((resolve, reject) => {
        uploadStream.on("finish", () => {
          imageFileName = req.file.originalname;
          imageId = uploadStream.id;
          resolve();
        });
        uploadStream.on("error", reject);
      });
    }

    let product;

    if (id) {
      product = await Product.findById(id);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      if (req.file && product.imageId) {
        const files = await bucket.find({ _id: product.imageId }).toArray();
        if (files.length > 0) await bucket.delete(product.imageId);
      }

      Object.assign(product, {
        name,
        price,
        description,
        category,
        stock,
        ...(imageFileName && { image: imageFileName, imageId }),
      });

      await product.save();
    } else {
      product = new Product({
        name,
        price,
        description,
        category,
        stock,
        image: imageFileName,
        imageId,
      });
      await product.save();
    }

    res.status(200).json({
      message: id ? "Product updated" : "Product created",
      product,
    });
  } catch (error) {
    console.error("createOrUpdateProduct error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user?.id;
    let visitCount = 0;

    if (userId) {
      const user = await User.findById(userId);
      visitCount = user?.visitCount || 0;
    }

    if (!q) return res.json([]);

    const term = q.trim().toLowerCase();
    const orConditions = [];

    const rangeMatch = term.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const [min, max] = [Number(rangeMatch[1]), Number(rangeMatch[2])];
      orConditions.push({ price: { $gte: min, $lte: max } });
    } else {
      const category = await Category.findOne({
        name: { $regex: term, $options: "i" },
      });
      if (category) orConditions.push({ category: category._id });

      orConditions.push({ name: { $regex: term, $options: "i" } });
      orConditions.push({ description: { $regex: term, $options: "i" } });
    }

    const products = await Product.find({ $or: orConditions }).populate("category");
    const pricedProducts = applyDynamicPricing(products, visitCount);

    res.json(pricedProducts);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (product.imageId) {
      const files = await bucket.find({ _id: product.imageId }).toArray();
      if (files.length > 0) await bucket.delete(product.imageId);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getCartSuggestions = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Step 1: Get user's cart items
    const cartItems = await Cart.find({ userId }).populate("productId");

    const productIdsInCart = cartItems
      .map(item => item.productId?._id?.toString())
      .filter(Boolean);

    const categoryIds = cartItems
      .map(item => item.productId?.category?.toString())
      .filter(Boolean);

    // Step 2: Get extra suggestions from the same categories (not in cart)
    const additionalSuggestions = await Product.find({
      category: { $in: categoryIds },
      _id: { $nin: productIdsInCart },
    })
      .limit(6)
      .populate("category");

    // Step 3: Combine cart items + suggestions
    const combinedSuggestions = [
      ...cartItems.map(item => item.productId), // Cart products
      ...additionalSuggestions,                // Extra suggestions
    ];

    res.json(combinedSuggestions);
  } catch (err) {
    console.error("Suggestion error:", err);
    res.status(500).json({ message: "Suggestions failed", error: err.message });
  }
};



