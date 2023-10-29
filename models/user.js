const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  ispremiumuser: {
    type: Boolean,
    default: false,
  },
  totalExpense: {
    type: Number,
    default: 0,
  },
});

// Create a Mongoose model based on the schema, USER is Collection name
const User = mongoose.model("User", userSchema);

module.exports = User;
