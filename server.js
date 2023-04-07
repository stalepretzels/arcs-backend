// Modules init
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const ejs = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser');
const address = require('address');

// Routes
var index = require("./routes/index");
var test = require("./routes/test");
var foo = require("./routes/errors/401");
var fot = require("./routes/errors/403");
var fof = require("./routes/errors/404");
var fho = require("./routes/errors/500");
var i2 = require("./routes/index2");

// Declarations
const USERNAME = "callmeclover";
const PASSWORD = "1322454676909BnM";
const PORT = 8080;
const BLOCKLIST = ['/a', '/b', '/c'];

// App init
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(express.static('../node_modules'));

// Socket.io init
io.on('connection', function (client) {
  console.log('Client connected...');

  client.on('join', function (data) {
      console.log(data);
  });

  client.on('messages', function (data) {
      client.emit('broad', "<div class='chmscon'><strong>" + data.at(1) + ":</strong><div class='chat-msg other'>" + data.at(0) + "</div></div>");
      client.broadcast.emit('broad', "<div class='chmscon'><strong>" + data.at(1) + ":</strong><div class='chat-msg other'>" + data.at(0) + "</div></div>");
  });

});

// Middlewares init
const c403 = function(req, res, next) {
  BLOCKLIST.forEach((i) => {
      if (req.url == i) {
        console.log("This is a forbidden page, redirecting...");
        res.render('errors/error403');
      }
    })
    console.log('Checked');
    next();
}

// Middlewares use
app.use(c403)

// Routes init (VERY IMPORTANT)
app.use("/", index);
app.use("/test", test);
app.use("/401", foo);
app.use("/403", fot);
app.use("*", fof);
app.use("/500", fho);
app.use("/index2", i2);

httpServer.listen(PORT, function(err){
  if (err) console.error("Error in server setup process");
  console.log("Server listening on Port", PORT);
});

app.get('/', function(req, res){
  res.render('index');
})