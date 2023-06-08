require("dotenv").config();
const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");
const app = express();

app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(express.static("public"));
app.set("view engine", "ejs");

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

// creating Shcema for new to do items
const itemsSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemsSchema);
// creating default items in items db
const item1 = new Item({
  name: "welcome to your to-do list :)",
});
const item2 = new Item({
  name: "Feel free to add things you don't want to forget!",
});
const defaultArray = [item1, item2];

//  creating shcema for new lists
const listSchema = {
  name: String,
  items: [itemsSchema],
};
const List = mongoose.model("List", listSchema);

// GET root route
app.get("/", (req, res) => {
  Item.find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defaultArray)
          .then(() => {
            res.redirect("/");
          })
          .catch((err) => console.log(err));
      } else {
        res.render("list", {
          date: moment().format("dddd, MMM Do"),
          listTitle: "Today",
          newListItems: foundItems,
        });
      }
    })
    .catch((err) => console.log(err));
});

// GET custom list route
app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({ name: customListName })
    .then((foundList) => {
      if (!foundList) {
        console.log("doesnt exist");
        const list = new List({
          name: customListName,
          items: defaultArray,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        console.log("Exists");
        res.render("list", {
          date: moment().format("dddd, MMM Do"),
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    })
    .catch((err) => console.log(err));
});

// POST
// Add item to the list
app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  if (itemName === "") {
    return;
  } else {
    const item = new Item({ name: itemName });
    if (listName === "Today") {
      item.save();
      res.redirect("/");
    } else {
      List.findOne({ name: listName })
        .then((foundList) => {
          foundList.items.push(item);
          foundList.save();
          res.redirect("/" + listName);
        })
        .catch((err) => console.log(err));
    }
  }
});

// POST
// Delete item
app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndDelete(checkedItemId)
      .then(() => {
        console.log("item deleted successfully");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } }
    )
      .then(() => {
        res.redirect("/" + listName);
      })
      .catch((err) => console.log(err));
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
