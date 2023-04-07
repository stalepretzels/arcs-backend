const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('/sui/sui.ejs', {loginMessage: '', RegisterMessage: '', typeStatus: '',  infoUser: ''});
});

router.get('/', (req, res) => {
  res.render('index', {loginMessage: '', RegisterMessage: '', typeStatus: '',  infoUser: ''});
});

module.exports = router;