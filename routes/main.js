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

module.exports = router;