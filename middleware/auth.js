const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token);

    // Verifing the JWT token and extract user information
    const decodedToken = jwt.verify(token, "98sh856ru454t45izklk");
    console.log(decodedToken);
    console.log("userID >>>> ", decodedToken.userId);

    // Using Mongoose to find the user by their _id
    const userId = decodedToken.userId;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Attach the user object to the request for future use in routes
    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed" });
  }
};

module.exports = {
  authenticate: authenticate,
};
