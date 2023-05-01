// Modules init
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cookieParser = require('cookie-parser');
const md = require('markdown-it')('commonmark', {
  html: true,
  linkify: true,
  typographer: true
});
const uuid = require("uuid")
const striptags = require('striptags');
const parseDataURL = require("data-urls");

// Routes
var index = require("./routes/index");
var test = require("./routes/test");
var foo = require("./routes/errors/401");
var fot = require("./routes/errors/403");
var fof = require("./routes/errors/404");
var fho = require("./routes/errors/500");
var i2 = require("./routes/index2");
var bpbtpage = require("./routes/bopbot");
const { Socket } = require("socket.io-client");

// Declarations
const PORT = 8080;
const BLOCKLIST = [];
const BOPBOTBANNEDWORDS = ['you are gay', 'methamphetamine', 'heroin', 'drug', 'crack', 'cocaine', 'fuck', 'shit', 'bitch', 'nigger', 'nigga'];
var ROOM = '::GENERAL'
room = ROOM
VERSION = 'v1.0.0'

// App init
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { maxHttpBufferSize: 1e7 });
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Socket.io init
io.on('connection', function (client) {
  console.log('Client connected...');
  client.join(ROOM); 
  ROOM = client.rooms[0]

  client.on('join', function (data) {
    console.log(data);
 //   get(client).catch(console.dir);
  });

  client.on('joinEmit', function (data) {
    client.broadcast.emit('broad', "<div id='joinmsg'>" + data + "</div>")
    client.emit('broad', "<div id='joinmsg'>You joined the chat room.</div>")
  });

  client.on('joinRoom', (data) => {
    client.join(data.rtj);
//    client.to(data.rtj).broadcast.emit('broad', 'user joined (test)')
    ROOM = client.rooms[0]
  })

  client.on("disconnected", (data) => {
    console.log(data);
  });

  client.on('imageUpdate', (data) => {
   console.log(data)
  })

  client.on("disconnectEmit", (data) => {
    client.broadcast.emit('broad', "<div id='joinmsg'>" + data + "</div>")
  });

  client.on('delete', function(data) {
    client.emit('deleteCli', data)
    client.broadcast.emit('deleteCli', data)
  })

  client.on('messages', function (data) {
  //  var msgid = uuid() 
    if (new RegExp(BOPBOTBANNEDWORDS.join("|")).test(data.text)) {
    client.emit('broad', "<div class='chmscon'><strong>BopBot:</strong><div class='chat-msg bopbot'>You've been bopped! This is because your message contained banned words. Your message was not sent. Only you can see this message. Click <a style='text-decoration: wavy underline; color: inherit;' href='/bopbot'>here</a> to learn more.</div></div>")
    } else if (new RegExp(BOPBOTBANNEDWORDS.join("|")).test(data.disName)) {
      client.emit('broad', "<div class='chmscon'><strong>BopBot:</strong><div class='chat-msg bopbot'>You've been bopped! This is because your username contained banned words. Your message was not sent. Only you can see this message. Click <a style='text-decoration: wavy underline; color: inherit;' href='/bopbot'>here</a> to learn more.</div></div>")
    } else if (!data.text.replace(/\s/g, '').length) {
      /* Only do if contains no letters or numbers */
    } else {
      if (data.file == null) {
      /*

      CHEATSHEET:

      client.emit('EVENT', DATA)
      send to user
      client.to(ROOM).emit('EVENT', DATA)
      broadcast

      */

        client.emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'>" + "<strong>" + data.disName + " (" + data.genName + "):</strong></div><div class='chat-msg user'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "</div></div>");
        client.to(client.rooms[0]).emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'>" + "<strong>" + data.disName + " (" + data.genName + "):</strong></div><div class='chat-msg other'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "</div></div>");
      } else if (data.text == null) {

        if (data.file.slice(0, 10) == 'data:image') {
          client.emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'>" +"<strong>" + data.disName + " (" + data.genName + "):</strong></div><div class='chat-msg user'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<img class='sentImage' src='" + data.file + "'>" + "</div><button onclick='socket.emit'></button></div>");
          client.to(client.rooms[0]).emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'>" + "<strong>" + data.disName + " (" + data.genName + "):</strong></div><div class='chat-msg other'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<img class='sentImage' src='" + data.file + "'>" + "</div></div>");
        } else if (data.file.slice(0, 10) == 'data:audio') {
          client.emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'>" +"<strong>" + data.disName + " (" + data.genName + "):</strong></div><div class='chat-msg user'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<audio controls src='" + data.file + "'>" + "</div></div>");
          client.to(client.rooms[0]).emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'>" + "<strong>" + data.disName + " (" + data.genName + "):</strong></div><div class='chat-msg other'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<audio src='" + data.file + "' controls></audio>" + "</div></div>");
          console.log(data.file)
        } else if (data.file.slice(0, 10) == 'data:video') {
          client.emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'>" +"<strong>" + data.disName + " (" + data.genName + "):</strong></div><div class='chat-msg user'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<video class='sentImage' controls autoplay src='" + data.file + "'>" + "</div></div>");
          client.to(client.rooms[0]).emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'>" + "<strong>" + data.disName + " (" + data.genName + "):</strong></div><div class='chat-msg other'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<video class='sentImage' src='" + data.file + "' controls autoplay></video>" + "</div></div>");
          console.log(data.file)
      
        } else if (data.text != null) {
          if (data.file.slice(0, 10) == 'data:image') {
          client.emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'>" +"<strong>" + data.disName + " (" + data.genName + "):</strong></div><div class='chat-msg user'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<br><img class='sentImage' src='" + data.file + "'>" + "</div></div>");
          client.to(client.rooms[0]).emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'>" + "<strong>" + data.disName + " (" + data.genName + "):</strong></div><div class='chat-msg other'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<br><img class='sentImage' src='" + data.file + "'>" + "</div></div>");
        } else if (data.file.slice(0, 10) == 'data:audio') {
          client.emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'>" +"<strong>" + data.disName + " (" + data.genName + "):</strong></div><div class='chat-msg user'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<br><audio controls src='" + data.file + "'>" + "</div></div>");
          client.to(client.rooms[0]).emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'>" + "<strong>" + data.disName + " (" + data.genName + "):</strong></div><div class='chat-msg other'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<br><audio src='" + data.file + "' controls></audio>" + "</div></div>");
          console.log(data.file)
        } else if (data.file.slice(0, 10) == 'data:video') {
          client.emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'>" +"<strong>" + data.disName + " (" + data.genName + "):</strong></div><div class='chat-msg user'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<br><video class='sentImage' controls autoplay src='" + data.file + "'>" + "</div></div>");
          client.to(client.rooms[0]).emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'>" + "<strong>" + data.disName + " (" + data.genName + "):</strong></div><div class='chat-msg other'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<br><video class='sentImage' src='" + data.file + "' controls autoplay></video>" + "</div></div>");
          console.log(data.file)
        }
      }
    }
  }
    
  });

});

// Middlewares init
const c403 = function (req, res, next) {
  BLOCKLIST.forEach((i) => {
    if (req.url == i) {
      console.log("This is a forbidden page, redirecting...");
      res.render('errors/error403');
    }
  })
  next();
}

// Middlewares use
app.use(c403)

// Routes init (VERY IMPORTANT)
app.use("/login", i2);
app.use("/", index);
app.use("/test", test);
app.use("/401", foo);
app.use("/403", fot);
// app.use("*", fof);
app.use("/500", fho);
app.use("/bopbot", bpbtpage);

httpServer.listen(PORT, function (err) {
  if (err) console.error("Error in server setup process");
  console.log("Server listening on Port", PORT);
});

app.get('/', function (req, res) {
  res.render('index');
})
