const express = require("express");
const router = express.Router();
const address = require('address');

router.get("/", function (req, res) {
    if (req.cookies.user == undefined) {
    res.cookie(`user`, "@guest" + Math.floor(Math.random() * 999999999));
    user = req.cookies.user;
    console.log('User ' + req.cookies.user + ' joined from ' + address.ip());
    } else {
        user = req.cookies.user;
        console.log('User ' + req.cookies.user + ' joined from ' + address.ip());
    }
    res.render("index");
});

module.exports = router;
