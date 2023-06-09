//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
//const date = require("./date.js");//bonds all the exports from app.js to the const date

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//mongoose set up & add new items(default items) to the database

async function main() {
  await mongoose.connect("mongodb+srv://superhuang64:super5723@cluster0.zf5jj9v.mongodb.net/todolistDB");
  console.log("connected!");
}

main().catch((err) => console.log(err));

//items collection
const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const study = new Item({
  name: "study"
});

const exercise = new Item({
  name: "exercise"
});

const reading = new Item({
  name: "reading"
});

const defaultItems = [study, exercise, reading];

//lists collection
const listsSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listsSchema);

//----------------get page-------------------

app.get("/", function (req, res) {
  //const day = date.getDate();

  Item.find({})
    .then(data => {
      if (data.length === 0) {
        Item.insertMany(defaultItems)
          .then(function () {
            console.log("successfully saved default items to the database");
            res.redirect("/");
          })
          .catch(function (err) {
            console.log(err);
          });

      } else {// get the template string/data for html use
        res.render("list", { listTitle: "Today", newListItems: data });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

//customlist
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName })
    .then(function (result) {
      if (result === null) {
        const createList = new List({
          name: customListName,
          items: defaultItems
        });
        createList.save()
          .then(function () {
            res.redirect("/" + customListName);
          });
      } else {
        res.render("list", { listTitle: result.name, newListItems: result.items });
      }
    })
    .catch(function (err) {
      console.log(err);
    });

});

//------------------------post page--------------------------

app.post("/", function (req, res) {
  //const day = date.getDate();

  // add new item(new entered items) to db
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({ name: itemName });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName })
      .then(function (result) {
        result.items.push(item);
        result.save();
      })
      .catch(function (err) {
        console.log(err);
      });
    res.redirect("/" + listName);
  }
});


app.post("/delete", function (req, res) {
  //const day = date.getDate();

  const checkedBoxId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedBoxId)
      .then(function () {
        console.log("Successfully removed the checked item");
        res.redirect("/");
      })
      .catch(function (err) {
        console.log(err);
      });

  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedBoxId } } })
      .then(function () {
        console.log(listName);
        res.redirect("/" + listName);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
