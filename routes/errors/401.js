const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
    res.render("errors/error401.ejs");
});

module.exports = router;
