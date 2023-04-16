const express = require("express");
const router = express.Router();
const avatarIcon = require('avatar-icon')

router.get("/", function (req, res) {
  icon = avatarIcon({
    size: 72,   // px
    density: 10,   // max amount of shapes in one row
    colorRange: 12,   // amount of different colors
    brightness: 40,   // make it bright: start at 40 from 255 colors
    contrast: 50,   // %, take similar colors
    backgroundColor: '',   // #hex or empty
    fillRatio: 60,   // %, some white space
    rectangleRatio: 60,   // %, ratio of rectangles
    triangleRatio: 40,   // %, ratio of triangles
    circleRatio: 10,    // %, ratio of circles
    returnType: '',   // default dataURL || 'buffer'
  });
  res.render("test.ejs");
});

module.exports = router;
