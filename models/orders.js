const mongoose = require("mongoose");

// Define a Mongoose schema for Order
const orderSchema = new mongoose.Schema({
  paymentid: {
    type: String,
  },
  orderid: {
    type: String,
  },
  status: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
  },
});

// Create a Mongoose model based on the schema
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
