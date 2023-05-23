const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const app = express();

let itemsArray = [];
let workItems = [];

app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// home route
// GET
app.get("/", (req, res) => {
  res.render("list", {
    listTitle: moment().format("LLLL"),
    newListItems: itemsArray,
    as: "labas",
  });
});
// POST
app.post("/", (req, res) => {
  console.log(req.body);
  let item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    itemsArray.push(item);
    res.redirect("/");
  }
});

// work route
// GET
app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});
// POST
app.post("/work", (req, res) => {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
