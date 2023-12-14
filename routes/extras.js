// Imports
var express = require("express");

// Declarations
const router = express.Router();

// Routes
router.get("/about", function (req, res) {
  res.render("about.ejs");
});

router.get("/rules", function (req, res) {
    res.render("rules.ejs");
});

module.exports = router;
