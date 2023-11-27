const express = require("express");
const router = express.Router();

router.get("/401", function (req, res) {
    res.render("errors/error401.ejs");
});

router.get("/403", function (req, res) {
    res.render("errors/error403.ejs");
});

router.get("/500", function (req, res) {
    res.render("errors/error500");
});

router.get("*", function (req, res) {
    res.render("errors/error404.ejs");
});

module.exports = router;
