const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const isStringInvalid = (string) => {
  return string == undefined || string.length === 0;
};

const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (isStringInvalid(email) || isStringInvalid(name) || isStringInvalid(phone) || isStringInvalid(password)) {
      return res.status(400).json({ message: 'Bad parameter or something is missing' });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User with the same email already exists' });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      email,
      phone,
      password: hash,
    });

    await user.save();

    res.status(201).json({ message: 'New user created' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Some error occurred', err });
  }
};

const generateAccessToken = (id, name, ispremiumuser) => {
  return jwt.sign({ userId: id, name, ispremiumuser }, '98sh856ru454t45izklk');
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ message: 'Email or password is missing', success: false });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User does not exist' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: 'Password is incorrect' });
    }

    const token = generateAccessToken(user._id, user.name, user.ispremiumuser);

    res.status(200).json({ success: true, message: 'User logged in successfully', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err, success: false });
  }
};

module.exports={login: login,signup:signup,generateAccessToken:generateAccessToken}
