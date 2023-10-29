const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const router = require("./routes/user");
const cors = require("cors");


const expenseRoute = require("./routes/expense");
const mongoDB = require("./util/expense");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "views")));

app.use("/", router);
app.use("/", expenseRoute);



mongoDB()
  .then(() => {
    app.listen(3000);
    console.log("listening to port 3000");
    console.log("Table created");
  })
  .catch((err) => {
    console.error("Error creating table:", err);
  });
