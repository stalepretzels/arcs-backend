const express = require("express");
const router = express.Router();
const proxifly = new (require('proxifly'))();

const ALLOWEDIPS = ['40.129.84.218'];

var options = {
    mode: 'IPv4', // IPv4 | IPv6
    format: 'json', // json | text
  };

router.get("/", function (req, res) {
    if (ALLOWEDIPS.some(function(v) { return proxifly.getPublicIp().toString().indexOf(v) >= 0; })) {
        res.render('errors/banned.ejs')
    } else {
        res.render('admin.ejs');
    }
});

router.get("/", function (req, res) {
    res.render("index.ejs");
});

module.exports = router;
