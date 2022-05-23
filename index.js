const express = require("express");
const app = express();
const Usertest = require("./model/usertest");
const bcrypt = require("bcrypt");
const session = require("express-session");

const config = require("./config/dev");
const mongoose = require("mongoose");
const res = require("express/lib/response");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.set("views", "views");
app.use(session({ secret: "itissecret" }));

app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

const rquireLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("./login");
  }
  next();
};

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/", (req, res) => {
  res.send("this is home page");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { password, username } = req.body;
  // const user = await Usertest.findOne({ username });
  // const validPassword = await bcrypt.compare(password, user.password);
  const foundUser = await Usertest.findAndValidate(username, password);
  if (foundUser) {
    req.session.user_id = foundUser._id;
    res.redirect("/secret");
  } else {
    res.render("login");
  }
});

app.post("/logout", (req, res) => {
  // req.session.user_id = null;
  req.session.destroy();
  res.redirect("/login");
});

app.post("/register", async (req, res) => {
  const { password, username } = req.body;

  // const hash = await bcrypt.hash(password, 12);
  const user = new Usertest({
    username,
    password,
  });
  await user.save();
  req.session.user_id = user._id;

  res.redirect("/");
});

app.get("/secret", rquireLogin, (req, res) => {
  res.render("secret");
});

app.listen(3001, () => {
  console.log("SERVER IS ACTIVATE!!!!");
});
