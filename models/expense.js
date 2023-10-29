const mongoose = require("mongoose");

// Define a Mongoose schema for Expense
const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Create a Mongoose model based on the schema
const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
