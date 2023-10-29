const Expense = require("../models/expense");
const User = require("../models/user");

exports.createExpenseController = async (req, res) => {
  const { amount, description, category } = req.body;

  try {
    if (!amount || !description || !category) {
      return res.status(400).json({ error: "Fill all fields" });
    }

    const newExpense = new Expense({
      amount,
      description,
      category,
      userId: req.user.id,
    });

    const data = await newExpense.save();
    res.status(201).json({ newExpenseDetail: data });
  } catch (err) {
    console.log("error" + err);
    res.status(500).json({ error: err });
  }
};

exports.getExpenseController = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).populate(
      "userId"
    );
    res.status(200).json({ allExpenses: expenses });
  } catch (err) {
    console.log("get user is failing", JSON.stringify(err));
    res.status(500).json({ error: err });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const uId = req.params.id;
    console.log(uId);
    if (uId == "undefined" || uId.length === 0) {
      console.log("ID is missing");
      return res.status(400).json({ success: false });
    }

    // Fetch user's total expense
    const user = await User.findOne({ _id: req.user.id });
    // console.log("total expense is", user.totalExpense);
    const userTotalExpense = user.totalExpense;

    console.log("Expenses >>>", userTotalExpense);

    // Fetch and delete the expense
    const deletedExpense = await Expense.findOneAndDelete({
      _id: uId,
      userId: req.user.id,
    });

    if (!deletedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense doesn't belong to the user",
      });
    }

    const deleteditemprice = deletedExpense.amount;
    let updatedTotalExpense = userTotalExpense - deleteditemprice;
    console.log("updatedTotalExpense >>>", updatedTotalExpense);

    // Update the user's total expense
    await User.findByIdAndUpdate(req.user.id, {
      totalExpense: updatedTotalExpense,
    });

    console.log("Deleted item price >>>", deleteditemprice);

    return res
      .status(200)
      .json({ success: true, message: "Deleted Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Failed" });
  }
};
