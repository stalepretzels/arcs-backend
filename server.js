// Modules init
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const crypto = require('crypto');

// Declarations
const USERNAME = "callmeclover";
const PASSWORD = "1322454676909BnM";
const PORT = 8080;

// MongoDB init
mongoose.connect('mongodb://localhost:27017/cluster0');
const db = mongoose.connection;

db.on('error', console.log.bind(console, "Connection failed."));
db.once('open', function(callback){
    console.log("Connection successful.");
});

// App init
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.enable('verbose errors')


app.listen(PORT, function(err){
    if (err) console.error("Error in server setup process");
    console.log("Server listening on Port", PORT);
});

app.get('/', function(req, res){
  res.render('sign-up-in/signup.ejs');
});

app.get('errors/error404', function(req, res, next){
  // trigger a 404 since no other middleware
  // will match /404 after this one, and we're not
  // responding here
  next();
});

app.get('errors/error403', function(req, res, next){
  // trigger a 403 error
  var err = new Error('Error 403 Forbidden');
  err.status = 403;
  next(err);
});

app.get('errors/error500', function(req, res, next){
  // trigger a generic (500) error
  next(new Error('Error 500 Internal Server Error'));
});

// Error handlers

app.use(function(req, res, next){
  res.status(404);

  res.format({
    html: function () {
      res.render('errors/error404', { url: req.url })
    },
    json: function () {
      res.json({ error: 'Not found' })
    },
    default: function () {
      res.type('txt').send('Not found')
    }
  })
});

// error-handling middleware, take the same form
// as regular middleware, however they require an
// arity of 4, aka the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling
// middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed, however here
// we simply respond with an error page.
/*
app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.status(err.status || 500);
  res.render('errors/error500', { error: err });
}); */

// Mongo execution
app.post('/sign_up', function(req,res){
  var name = req.body.name;
  var email =req.body.email;
  var pass = req.body.password;
  var phone =req.body.phone;

  var data = {
      "name": name,
      "email":email,
      "password":pass,
      "phone":phone
  }
db.collection('details').insertOne(data,function(err, collection){
      if (err) throw err;
      console.log("Record inserted Successfully");
            
  });
        
  return res.redirect('signup_success.html');
})


app.get('/',function(req,res){
res.set({
  'Access-control-Allow-Origin': '*'
  });
return res.redirect('index.html');
}).listen(3000)


console.log("server listening at port 3000");