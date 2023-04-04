const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
    res.render("errors/error500");
});

module.exports = router;
