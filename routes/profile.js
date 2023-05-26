const express = require("express");
const router = express.Router();
const avatarIcon = require('avatar-icon')

router.get("/", function (req, res) {
  pfp = req.query.pfp
  disName = req.query.disName
  genName = req.query.genName
  bio = req.query.bio

  Array.from(decodeURIComponent(req.query.badges)).forEach(badge => {
    if (badge == 'MODB') {
      modbadge = true
    } else if (badge == 'CREB') {
      creatorbadge = true
    } else if (badge == 'BUGB') {
      bugbadge = true
    } else if (badge == 'SHIB') {
      shinybadge = true
    }
  });

  res.render("profile.ejs");
});

module.exports = router;
