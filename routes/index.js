const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
    if (req.cookies.user == undefined) {
    res.cookie(`user`, "@guest" + Math.floor(Math.random() * 999999999));
    user = req.cookies.user;
    } else {
        user = req.cookies.user;
    }
    res.render("index");
});

module.exports = router;
