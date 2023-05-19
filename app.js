const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const app = express();

let item = "";
let itemsArray = [];

app.use(bodyParser.urlencoded({ extended: "true" }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const today = new Date();
  const currentDate = today.getDay();
  if (currentDate === 6 || currentDate === 0) {
    res.render("list", { day: moment.format("LLLL") });
  } else {
    res.render("list", {
      day: moment().format("LLLL"),
      newListItem: itemsArray,
    });
  }
});

app.post("/", (req, res) => {
  item = req.body.newItem;
  itemsArray.push(item);
  res.redirect("/");
  console.log(itemsArray);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
