// Imports
const socketio = require("socket.io");
const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const striptags = require("striptags");
const compression = require("compression");
const { instrument } = require("@socket.io/admin-ui");

const markdown = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
})
  .use(require("markdown-it-emoji")) // there
  .use(require("markdown-it-abbr")) // are
  .use(require("markdown-it-deflist")) // way
  .use(require("markdown-it-footnote")) // too
  .use(require("markdown-it-ins")) // many
  .use(require("markdown-it-sub")) // of
  .use(require("markdown-it-sup")) // these
  .use(require("markdown-it-mark")) // it
  .use(require("markdown-it-anchor")) // looks

// Declarations
let app = express();
let clients = [];
let httpServer = http.createServer(app);
let io = new socketio.Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true
  }
});

instrument(io, {
  auth: {
    type: "basic",
    username: "admin",
    password: "$2a$10$emXkyLqEe9.A9zLmsrCkFuHfPx3ayPvHk2mEyhGcK1vR4KAt9eiWu"
  },
});

/* Routes */
let routes = {
  main: require("./routes/main.js"),
  login: require("./routes/login.js"),
  extras: require("./routes/extras.js"),
};

// Functions
function cleanseMessage(message) {
    return striptags(markdown.render(striptags(`<pre style="font-family:  'Inter Tight', sans-serif; white-space: nowrap; margin: 0;">${message}</pre>`, ['pre'])), [
            'strong',
            'i',
            'em',
            'code',
            'a',
            'div',
            'sub',
            'sup',
            's',
            'abbr',
            'dl',
            'hr',
            'ins',
            'section',
            'ol',
            'li',
            'sup',
            'sub',
            'code',
            'pre',
            'br',
            'h1',
            'h2',
            'h3','h4','h5','h6'
          ])
}

function createMessage(username, message, bio) {
  let msg =
  `<div style='margin: 10px 0;'><span><span class='pfplink' onclick='window.location = "/profile?user=${username}&bio=${bio}"'>${username} </span><span style='font-size: small;'>[at <span id='date'></span>]</span></span><div id='message'>${cleanseMessage(message)}</div></div>`

  return msg;
}

// Initialization
app.use(compression())
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* Routes */
app.use("/", routes.main);
app.use("/", routes.login);
app.use("/", routes.extras);

// Socket.io
io.on('connection', (client) => {
  console.log('Client connected...')
  client.join('::GENERAL')

  client.on('join', function (data) {
    if (!(data.user.disName == undefined)) {
      if (!(data.preroom == '')) {
        client.leave(data.preroom)
        client.join(data.room)
        client
          .to(data.room)
          .emit(
            'broad',
            `<div class='statusmsg'>${data.user.disName}@${data.user.ugn} joined this chat room.</div>`
          )
        client
          .to(data.preroom)
          .emit(
            'broad',
            `<div class='statusmsg'>${data.user.disName}@${data.user.ugn}left this chat room.</div>`
          )
        client.emit(
          'broad',
          `<div class='statusmsg'>You joined ${data.room}.</div>`
        )
      } else {
        console.log(
          `${data.user.disName}@${data.user.ugn} joined.`
        )
        client
          .to('::GENERAL')
          .emit(
            'broad',
            `<div class='statusmsg'>${data.user.disName}@${data.user.ugn} joined this chat room.</div>`
          )
        client.emit(
          'broad',
          "<div class='statusmsg'>You joined the chat room.</div>"
        )
      }
    }
  })

  client.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`)
  })

  client.on('messages', (data) => {
    if (!(data.user.disName == undefined)) {
      client.emit(
        'broad', createMessage(data.user.disName, data.message, data.user.bio)
      )
      client.to(data.room).emit('notification', data)
      client
        .to(data.room)
        .emit(
          'broad', createMessage(data.user.disName, data.message, data.user.bio)
        )
    }
  })
})

httpServer.listen(8443, () => {
  console.log("running arcs at localhost:8443");
});