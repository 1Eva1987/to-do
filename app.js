require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");
const app = express();

// connecting to mongoDB
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// creating Shcema
const itemsShcema = {
  name: String,
};
// creating model
const Item = mongoose.model("Item", itemsShcema);
// creating items in db
const item1 = new Item({
  name: "welcome to your to-do list :)",
});
const item2 = new Item({
  name: "Feel free to add things you don't want to forget!",
});

const defaultArray = [item1, item2];

// home route
// GET
app.get("/", (req, res) => {
  Item.find()
    .then((items) => {
      if (items.length === 0) {
        Item.insertMany(defaultArray)
          .then(() => {
            console.log("success");
            res.redirect("/");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.render("list", {
          listTitle: moment().format("dddd, MMM Do"),
          newListItems: items,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// POST
// add item
app.post("/", (req, res) => {
  let item = req.body.newItem;
  // checking if new item belongs to work list by adding value to submit button
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    if (item === "") {
      return;
    } else {
      const newItem = new Item({ name: item });
      newItem.save();
      res.redirect("/");
    }
  }
});

// POST
// delete item
app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  console.log(checkedItemId);
  Item.findByIdAndDelete(checkedItemId)
    .then(() => {
      console.log("success");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
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
