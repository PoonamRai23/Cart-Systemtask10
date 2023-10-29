const Expense = require('../models/expense');
const User = require('../models/user');

exports.postExpense = async (req, res) => {
  try {
    const { name, price, date, category } = req.body;
    const newExpense = new Expense({
      Itemname: name,
      price,
      date,
      category,
      userId: req.user.id
    });

    const data = await newExpense.save();
    res.status(201).json({ newExpenseDetail: data });
  } catch (err) {
    console.log("error" + err);
    res.status(500).json({ error: err });
  }
};

exports.getExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).populate('userId');
    res.status(200).json({ allExpenses: expenses });
  } catch (err) {
    console.log('get user is failing', JSON.stringify(err));
    res.status(500).json({ error: err });
  }
};


exports.deleteExpense = async (req, res) => {
  try {
    const uId = req.params.id;
    if (!uId) {
      console.log('ID is missing');
      return res.status(400).json({ success: false });
    }

    const result = await Expense.deleteOne({ _id: uId, userId: req.user.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Expense doesn\'t belong to the user' });
    }

    return res.status(200).json({ success: true, message: 'Deleted Successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: 'Failed' });
  }
};
