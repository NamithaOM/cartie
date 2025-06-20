const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const AuthRouter = require("./routes/authRoutes");
const ProductRouter = require("./routes/productRoutes");
const CategoryRouter = require("./routes/categoryRoutes");
const UserRouter = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", AuthRouter);
app.use('/api/products', ProductRouter);
app.use('/api/categories', CategoryRouter);
app.use('/api/user', UserRouter);
app.use("/api/cart", cartRoutes);

// Error Handling
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
