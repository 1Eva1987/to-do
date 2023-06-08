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

// creating Shcema for new to do items
const itemsShcema = {
  name: String,
};
const Item = mongoose.model("Item", itemsShcema);
// creating items in items db
const item1 = new Item({
  name: "welcome to your to-do list :)",
});
const item2 = new Item({
  name: "Feel free to add things you don't want to forget!",
});
const defaultArray = [item1, item2];

//  creating shcema for new lists
const listShema = {
  name: String,
  items: [itemsShcema],
};
const List = mongoose.model("List", listShema);

// GET root route
app.get("/", (req, res) => {
  Item.find()
    .then((items) => {
      if (items.length === 0) {
        Item.insertMany(defaultArray)
          .then(() => {
            res.redirect("/");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.render("list", {
          date: moment().format("dddd, MMM Do"),
          listTitle: "Today",
          newListItems: items,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// GET custom list route
app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName;
  console.log(customListName);
  List.findOne({ name: customListName }).then((foundList) => {
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
  });
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
      List.findOne({ name: listName }).then((foundList) => {
        foundList.items.push(item);
        foundList.save();
      });
      res.redirect("/" + listName);
    }
  }
});

// POST
// Delete item
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
