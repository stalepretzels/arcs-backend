const express = require("express");
const router = express.Router();
const address = require('address');
const avatarIcon = require('avatar-icon')
var cookie = require('cookie-parse');
const Chance = require('chance');
var chance = new Chance();
const proxifly = new (require('proxifly'))();

const BANNEDIPS = [];

var options = {
    mode: 'IPv4', // IPv4 | IPv6
    format: 'json', // json | text
  };

router.get("/", function (req, res) {
    if (req.cookies.user == undefined) {
    res.cookie(`user`, "@guest" + Math.floor(Math.random() * 999999999), { secure: true });
    user = req.cookies.user;
    } else {
        user = req.cookies.user;
    }
    if (req.cookies.uname == undefined) {
        } else {
            user = req.cookies.user;
        }
    if (BANNEDIPS.some(function(v) { return proxifly.getPublicIp().toString().indexOf(v) >= 0; })) {
        res.render('errors/banned.ejs')
        console.log('User from ' + proxifly.getPublicIp(options) + ' banned.')
    } else {
        res.render('index');
    }
});

module.exports = router;
