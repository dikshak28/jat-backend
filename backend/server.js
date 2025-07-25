// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// app.use(express.json());
// app.use(cors()); // Allow frontend to connect

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log("✅ MongoDB Connected!"))
//     .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // Import API routes
// const apiRoutes = require("./routes/api");
// app.use("/api", apiRoutes); // Base route for all APIs

// // Server Listening
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Razorpay = require("razorpay");

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend to connect

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


// Razorpay Setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Razorpay Route: Create Order
app.post("/api/payment/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Convert rupees to paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("❌ Razorpay Order Error:", err);
    res.status(500).json({ error: "Unable to create order" });
  }
});

// Optional: Razorpay Payment Verification Route
// You can add it here later if needed

// Import API routes
const apiRoutes = require("./routes/api");
const adminRoutes = require("./routes/admin");

// Route registration
app.use("/api", apiRoutes); // General APIs
app.use("/admin", adminRoutes); // Admin APIs

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
