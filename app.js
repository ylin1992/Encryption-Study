//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// express-session
app.use(session({
  secret: 'Some little secrets',
  resave: false,
  saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());

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

userSchema.plugin(passportLocalMongoose);
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

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

});

app.post("/login", (req, res) => {

})

app.listen("3000", () => {
  console.log("Server connected at port: 3000");
})
