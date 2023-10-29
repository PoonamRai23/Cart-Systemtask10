const Razorpay = require("razorpay");
const Order = require("../models/orders");
const User = require("../models/user");
const userController = require("./user");

const purchasepremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: "rzp_test_eUo3mcSVbQ0jPV",
      key_secret: "cmp5o7cy3N1qSGkkRXcA5lQz",
    });

    const amount = 100;

    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }

      const newOrder = new Order({
        paymentid: order.id,
        orderid: order.id,
        status: "PENDING",
        user: req.user._id,
      });

      await newOrder.save();
      return res.status(201).json({ order, key_id: rzp.key_id });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { payment_id, order_id } = req.body;

    const order = await Order.findOne({ orderid: order_id, user: userId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order doesn't belong to the user" });
    }

    const promise1 = Order.findByIdAndUpdate(order._id, {
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = User.findByIdAndUpdate(
      userId,
      { ispremiumuser: true },
      { new: true }
    );

    await Promise.all([promise1, promise2]);

    const newToken = userController.generateAccessToken(
      userId,
      undefined,
      true
    ); // Assuming this method exists in your userController
    console.log("newToken>>>>>>>>>>>", newToken);
    return res.status(200).json({
      success: true,
      message: "Transaction Successful",
      token: newToken,
    });
  } catch (err) {
    console.error("Error in updateTransactionStatus:", err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

module.exports = {
  purchasepremium,
  updateTransactionStatus,
};
