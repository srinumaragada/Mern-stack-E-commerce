const dotenv=require("dotenv")


dotenv.config()

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./Routes/auth/authRoutes");
const adminProductsRouter =require("./Routes/admin/productRoutes")
const shopProductsRouter=require("./Routes/shop/Shoppingroutes")
const cartProductsRouter=require("./Routes/shop/cartRoutes")
const addressProductRouter=require("./Routes/shop/addressRoutes")
const shopOrderRouter = require("./Routes/shop/orderRoutes")
const adminOrdersRouter=require("./Routes/admin/orderRoutes")
const searchRouter =require("./Routes/shop/searchRoutes")
const reviewRouter=require("./Routes/shop/ReviewRoutes")
const commonFeatureRouter =require("./Routes/common/feature-routes")
// Load environment variables from config.env file


// Check if the connection string is loaded correctly
if (!process.env.CONN_STR) {
    console.error("MongoDB connection string (CONN_STR) is not defined in config.env");
    process.exit(1); // Exit the process if the connection string is missing
}

// Connect to MongoDB
mongoose.connect(process.env.CONN_STR)
.then(() => console.log("DB connected successfully"))
.catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit the process if there is a connection error
});

const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

// Enable CORS with proper configuration
app.use(cors({
    origin: process.env.CLIENT_BASE_URL, // Frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma"
    ],
    credentials: true, // Enable credentials (for cookies, etc.)
}));

// Middleware for parsing cookies
app.use(cookieParser());

// Define routes after CORS is enabled
app.use('/api/auth', authRouter);
app.use('/api/admin/orders',adminOrdersRouter)
app.use('/api/admin/products',adminProductsRouter)

app.use('/api/shop/products',shopProductsRouter)
app.use('/api/shop/cart',cartProductsRouter)
app.use('/api/shop/address',addressProductRouter)
app.use('/api/shop/orders',shopOrderRouter)
app.use('/api/shop/search',searchRouter)
app.use('/api/shop/review',reviewRouter)


app.use('/api/common/feature',commonFeatureRouter)
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
