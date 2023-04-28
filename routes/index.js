const express = require("express");
const router = express.Router();
const address = require('address');
const avatarIcon = require('avatar-icon')
var cookie = require('cookie-parse');
const Chance = require('chance');
const {publicIp, publicIpv4, publicIpv6} = require('public-ip');
var chance = new Chance();

const BANNEDIPS = [];

router.get("/", function (req, res) {
    if (req.cookies.user == undefined) {
    res.cookie(`user`, "@guest" + Math.floor(Math.random() * 999999999), { secure: true });
    user = req.cookies.user;
    res.cookie('ip', publicIpv4(), { secure: true });
    } else {
        user = req.cookies.user;
        res.cookie('ip', publicIpv4(), { secure: true });
    }
    if (req.cookies.uname == undefined) {
        } else {
            user = req.cookies.user;
        }
        if (req.cookies.pfp == undefined || req.cookies.pfp == null) {
            res.cookie('pfp', avatarIcon({
                size            : 72,   // px
                density         : 10,   // max amount of shapes in one row
                colorRange      : chance.integer({min : 6, max : 12}),   // amount of different colors
                brightness      : 40,   // make it bright: start at 40 from 255 colors
                contrast        : 50,   // %, take similar colors
                backgroundColor : '',   // #hex or empty
                fillRatio       : chance.integer({min : 40, max : 60}),   // %, some white space
                rectangleRatio  : chance.integer({min : 40, max : 60}),   // %, ratio of rectangles
                triangleRatio   : chance.integer({min : 20, max : 40}),   // %, ratio of triangles
                circleRatio     : chance.integer({min : 10, max : 20}),    // %, ratio of circles
                returnType      : '',   // default dataURL || 'buffer'
              }));
            pfp = req.cookies.pfp;
        } else {
            pfp = req.cookies.pfp;
        }
    room = room
    if (BANNEDIPS.some(function(v) { return publicIpv4().toString().indexOf(v) >= 0; })) {
        res.render('errors/banned.ejs')
        console.log('User from ' + publicIpv4() + ' banned.')
    } else {
        res.render('index');
    }
});

module.exports = router;
