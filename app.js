const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");
const app = express();

// const itemsArray = [];
// const workItems = [];

// connecting to mongoDB
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// creating Shcema
const itemsShcema = new mongoose.Schema({
  name: String,
});

// creating model
const Item = mongoose.model("Item", itemsShcema);

// creating item in db

const item1 = new Item({
  name: "welcome to your to-do list :)",
});
const item2 = new Item({
  name: "Feel free to add things you don't want to forget!",
});

const defaultArray = [item1, item2];
// Item.insertMany(defaultArray)
//   .then(() => {
//     console.log("success");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// home route
// GET
app.get("/", (req, res) => {
  Item.find()
    .then((items) => {
      res.render("list", {
        listTitle: moment().format("dddd, MMM Do"),
        newListItems: items,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// POST
app.post("/", (req, res) => {
  let item = req.body.newItem;
  // checking if new item belongs to work list by adding value to submit button
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

// about route
app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
