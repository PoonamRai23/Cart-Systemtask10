const express = require("express");
const router = express.Router();
const controller = require("../controller/user");
const path = require("path");
router.use(express.static(path.join(__dirname, "public")));
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
//user
router.post("/signup", controller.createSignupController);
router.post("/login", controller.createloginController);

module.exports = router;
