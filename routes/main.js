// Imports
var express = require("express");

// Declarations
const router = express.Router();

// Routes
router.get("/", function (req, res) {
  res.render("main.ejs");
});

router.get("/chat", function (req, res) {
    res.render("chat.ejs");
});

router.get("/profile", function (req, res) {
  user = req.query.user
  bio = req.query.bio

  res.render("profile.ejs");
});

module.exports = router;