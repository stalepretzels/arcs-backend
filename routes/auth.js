var express = require('express');
const router = express.Router();


// Routes

router.get("/login", function (req, res) {
    res.render("login/login.ejs");
});

router.get("/signup", function (req, res) {
    res.render("login/signup.ejs");
});

// Login/Signup attempt route


module.exports = router;