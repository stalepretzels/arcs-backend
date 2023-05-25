const express = require("express");
const router = express.Router();
const avatarIcon = require('avatar-icon')

router.get("/", function (req, res) {
  pfp = req.query.pfp
  disName = req.query.disName
  genName = req.query.genName
  bio = req.query.bio

  if (req.query.disName == 'callmeclover') {
    creatorbadge = true
    modbadge = true
    bugbadge = true
  }

  res.render("profile.ejs");
});

module.exports = router;
