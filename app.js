const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const app = express();

let item = "";
let itemsArray = [];

app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("list", {
    day: moment().format("LLLL"),
    newListItems: itemsArray,
    as: "labas",
  });
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
