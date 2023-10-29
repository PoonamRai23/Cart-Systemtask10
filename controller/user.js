const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//signup
const createSignupController = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    // console.log("this is req data>>>>>>>>>>>>>>>>>>>>",name,phone,email,password);
    if (
      name === undefined ||
      name.length === 0 ||
      phone === undefined ||
      phone.length === 0 ||
      email === undefined ||
      email.length === 0 ||
      password === undefined ||
      password.length === 0
    ) {
      return res
        .status(400)
        .json({ err: "bad parameters something is missing" });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with the same email already exists" });
    }

    //pwd encryption
    let saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const data = new User({
      name,
      email,
      phone,
      password: hash,
    });

    await data.save();
    console.log("this is created data", data);
    return res.status(200).json({ sign_up: data, message: "posted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to create user." });
  }
};

function generateAccessToken(id, name, ispremiumuser) {
  return jwt.sign(
    { userId: id, name: name, ispremiumuser: ispremiumuser },
    "98sh856ru454t45izklk"
  );
}
// Login Controller
const createloginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email>>>>>>>>", email, password);

    if (!email || !password) {
      return res.status(400).json({ message: "Email or password is missing" });
    }

    // Get user data
    const user = await User.findOne({ email: email });
    console.log("user>>>>>>>>>>>>>>>>>>>>>>>>", user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Password is incorrect" });
    }
    const token = generateAccessToken(user._id, user.name, user.ispremiumuser);

    res
      .status(200)
      .json({ success: true, message: "User logged in successfully", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err, success: false });
  }
};

module.exports = {
  createSignupController,
  createloginController,
  generateAccessToken,
};
