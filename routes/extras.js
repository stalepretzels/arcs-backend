// Imports
var express = require("express");

// Declarations
const router = express.Router();

// Routes
router.get("/changelog", function (req, res) {
  res.render("changelog.ejs");
});

router.get("/rules", function (req, res) {
    res.render("rules.ejs");
});

module.exports = router;
