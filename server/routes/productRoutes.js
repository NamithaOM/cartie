const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createOrUpdateProduct,
  searchProducts,
  deleteProduct,
  getProductImage,
  getCartSuggestions
} = require("../controllers/productController");
const { protect, isAdmin } = require("../middlewares/authMiddleware");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", protect, getAllProducts);
router.post(
  "/",
  protect,
  isAdmin,
  upload.single("file"),
  createOrUpdateProduct
);
router.get("/search", searchProducts);
router.delete("/:id", deleteProduct);
router.get("/image/:filename", getProductImage);  // Image route
router.get("/suggestions/:userId",  getCartSuggestions);

module.exports = router;
