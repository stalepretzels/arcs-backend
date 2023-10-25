// Imports
var express = require("express");

// Declarations
const router = express.Router();

// Routes
router.get("/edit", function (req, res) {
  res.render("editinfo.ejs");
});

module.exports = router;
