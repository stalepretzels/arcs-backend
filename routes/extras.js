const express = require("express");
const router = express.Router();
const proxifly = new (require('proxifly'))();

const ALLOWEDIPS = ['40.129.84.218'];

var options = {
    mode: 'IPv4', // IPv4 | IPv6
    format: 'json', // json | text
  };

router.get("/admin", function (req, res) {
    if (ALLOWEDIPS.some(function(v) { return proxifly.getPublicIp().toString().indexOf(v) >= 0; })) {
        res.render('errors/banned.ejs')
    } else {
        res.render('extras/admin.ejs');
    }
});

router.get('/bopbot', (req, res) => {
    res.render('extras/bopbot.ejs');
});

router.get("/", function (req, res) {
    pfp = req.query.pfp
    disName = req.query.disName
    genName = req.query.genName
    bio = req.query.bio
  
    res.render("extras/profile.ejs");
  });

module.exports = router;
