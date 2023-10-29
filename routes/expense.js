const Expense = require("../models/expense"); // Import your Mongoose model
const express = require("express");
const router = express.Router();
const exController = require("../controller/expense");
const path = require("path");
const userAuthentication = require("../middleware/auth");
router.use(express.static(path.join(__dirname, "public")));
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

//expense routes
router.post(
  "/expense",
  userAuthentication.authenticate,
  exController.createExpenseController
);

router.get(
  "/expense",
  userAuthentication.authenticate,
  exController.getExpenseController
);
router.delete(
  "/expense/:id",
  userAuthentication.authenticate,
  exController.deleteExpense
);
// router.get(
//   "/expense/pagination",
//   userAuthentication.authenticate,
//   (req, res) => {
//     res.sendFile(path.join(__dirname, "..", "views", "pagination.html"));
//   }
// );

router.get(
  "/expense/pagination",
  userAuthentication.authenticate,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const offset = (page - 1) * limit;

      // Fetch data from the database using Mongoose
      const totalItems = await Expense.countDocuments(); // Get the total number of items

      // Query the data and apply pagination
      const data = await Expense.find().skip(offset).limit(limit);

      // Calculate the total number of pages based on the total items and limit
      const totalPages = Math.ceil(totalItems / limit);

      res.status(200).json({
        success: true,
        data: data,
        totalPages: totalPages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: "An error occurred while fetching data.",
      });
    }
  }
);

router.get(
  "/download",
  userAuthentication.authenticate,
  exController.deleteExpense
);

module.exports = router;
