//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');


// mongoose
const url = "mongodb://localhost:27017";
const dbName = "userDB";
mongoose.connect(url + "/" + dbName, {
  useNewUrlParser: true
}, () => {
  console.log("Database connected");
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});



const User = mongoose.model("User", userSchema);

//const user = new User({
//  email: "123@123.com",
//  password: "yeh"
//})
//user.save();

app.get("/", (req, res) => {
  res.render("home");
})
app.get("/register", (req, res) => {
  res.render("register");
})
app.get("/login", (req, res) => {
  res.render("login");
})

app.post("/register", (req, res) => {
  const email = req.body.username;
  const salt = bcrypt.genSaltSync(saltRounds);
  const password = bcrypt.hashSync(req.body.password, salt);

  User.findOne({
    email: email
  }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets")
        } else {
          console.log("The email already exists but with wrong password");
          res.redirect("/register");
        }
      } else {
        const user = new User({
          email: email,
          password: password
        });
        user.save((err) => {
          if (!err) {
            console.log("Update successfully");
            res.render("secrets");
          } else {
            console.log(err);
          }
        });
      }
    }
  });
});

app.post("/login", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  User.findOne({email: email}, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, (err, result) => {
          if (result === true) {
            res.render("secrets")
          } else {
            console.log("The email already exists but with wrong password");
            res.redirect("/login");
          }
        });
      } else {
        console.log("No user id found");
        res.redirect("/login");
      }
    }
  });
})

app.listen("3000", () => {
  console.log("Server connected at port: 3000");
})
