// Modules init
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const ejs = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser');
const address = require('address');
const md = require('markdown-it')('commonmark', {
  html: true,
  linkify: true,
  typographer: true
});
const striptags = require('striptags');
const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB init (for persist)                                                                                                                                 
const uri = "mongodb+srv://callmeclover:1322454676909BnM@cluster0.yyv5lxs.mongodb.net/?retryWrites=true&w=majority";
const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const dbName = "Messages";
                      
async function send(data) {
   try {
        await dbClient.connect();
        console.log("Connected correctly to server, attempting to send message now...");
        const db = dbClient.db(dbName);
        const col = db.collection("Messages");

        var object = {
          message: data
        };

        // Insert a single document, wait for promise so we can read it back
        const p = await col.insertOne(object);
        // Find one document
        console.log('Success.')
       } catch (err) {
        console.log(err.stack);
    }

  /*  finally {
       await dbClient.close();
   } */
}

async function get(client) {
  try {
       await dbClient.connect();
       console.log("Connected correctly to server, attempting to catch messages now...");
       const db = dbClient.db(dbName);
       const col = db.collection("Messages");

      var array = col.find().toArray();
      for (var i in array) {
        client.emit('broad', i)
        console.log(i)
      }
       console.log('Success.')
      } catch (err) {
       console.log(err.stack);
   }

 /*  finally {
      await dbClient.close();
  } */
}

// Routes
var index = require("./routes/index");
var test = require("./routes/test");
var foo = require("./routes/errors/401");
var fot = require("./routes/errors/403");
var fof = require("./routes/errors/404");
var fho = require("./routes/errors/500");
var i2 = require("./routes/index2");
var bpbtpage = require("./routes/bopbot");

// Declarations
const PORT = 5000;
const BLOCKLIST = [];
const BOPBOTBANNEDWORDS = ['you are gay', 'i love methamphetamine', 'i love heroin', 'i love drugs', 'i love crack', 'i love cocaine'];

// App init
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { maxHttpBufferSize: 1e7 });
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('../node_modules'));

// Socket.io init
io.on('connection', function (client) {
  console.log('Client connected...');

  client.on('join', function (data) {
    console.log(data);
    get(client).catch(console.dir);
  });

  client.on('joinEmit', function (data) {
    client.broadcast.emit('broad', "<div id='joinmsg'>" + data + "</div>")
    client.emit('broad', "<div id='joinmsg'>You joined the chat room.</div>")
  });

  client.on('messages', function (data) {
    if (BOPBOTBANNEDWORDS.some(function(v) { return data.text.indexOf(v) >= 0; })) {
    client.emit('broad', "<div class='chmscon'><strong>BopBot:</strong><div class='chat-msg bopbot'>You've been bopped! This is because your message contained banned words. Your message was not sent. Only you can see this message. Click <a style='text-decoration: wavy underline; color: inherit;' href='/bopbot'>here</a> to learn more.</div></div>")
    } else {
      if (data.image == null) {
        client.emit('broad', "<div class='chmscon'><strong>" + data.disName + " (" + data.genName + "):</strong><div class='chat-msg user'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "</div></div>");
        client.broadcast.emit('broad', "<div class='chmscon'><strong>" + data.disName + " (" + data.genName + "):</strong><div class='chat-msg other'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "</div></div>");
        send("<div class='chmscon'><strong>" + data.disName + " (" + data.genName + "):</strong><div class='chat-msg other'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "</div></div>").catch(console.dir);
      } else {
        client.emit('broad', "<div class='chmscon'><strong>" + data.disName + " (" + data.genName + "):</strong><div class='chat-msg user'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<br><img class='sentImage' src='" + data.image + "'>" + "</div></div>");
      client.broadcast.emit('broad', "<div class='chmscon'><strong>" + data.disName + " (" + data.genName + "):</strong><div class='chat-msg other'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<br><img class='sentImage' src='" + data.image + "'>" + "</div></div>");
      send("<div class='chmscon'><strong>" + data.disName + " (" + data.genName + "):</strong><div class='chat-msg other'>" + striptags(md.render(data.text), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<br><img class='sentImage' src='" + data.image + "'>" + "</div></div>").catch(console.dir);
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