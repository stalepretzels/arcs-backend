// Imports
const socketio = require("socket.io");
const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const striptags = require("striptags");
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
  .use(require("@larose/markdown-it-katex")) // but
  .use(require("markdown-it-mark")) // it
  .use(require("markdown-it-anchor")) // looks
  .use(require("markdown-it-highlightjs")); // cool

// Declarations
let app = express();
let httpServer = http.createServer(app);
let io = new socketio.Server(httpServer, {
  /* options */
});

/* Routes */
let routes = {
  main: require("./routes/main.js"),
  login: require("./routes/login.js"),
  extras: require("./routes/extras.js"),
};

// Functions

// Initialization
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
io.on("connection", (client) => {
  console.log("Client connected...");
  client.join("::GENERAL");

  client.on("join", function (data) {
    console.log(data.user.disName + "@" + data.user.ugn + " joined.");
    client
      .to("::GENERAL")
      .emit(
        "broad",
        "<div class='statusmsg'>" +
          data.user.disName +
          "@" +
          data.user.ugn +
          " joined this chat room.</div>",
      );
    client.emit(
      "broad",
      "<div class='statusmsg'>You joined the chat room.</div>",
    );
  });

  client.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  client.on("joinRoom", (data) => {
    client.leave(data.pre);
    client.join(data.room);
    client
      .to(data.room)
      .emit(
        "broad",
        "<div class='statusmsg'>" +
          data.user.disName +
          "@" +
          data.user.ugn +
          " joined this chat room.</div>",
      );
    client.emit(
      "broad",
      "<div id='statusmsg'>You joined " + data.room + ".</div>",
    );
    console.log(data.jsc);
  });

  client.on("messages", (data) => {
    client.emit(
      "broad",
      "<div style='margin: 10px 0;'><span>" +
        data.user.disName +
        "@" +
        data.user.ugn +
        " <span style='font-size: small;'>[at " +
        new Date().toLocaleString(new Date().getTime()) +
        "]</span></span><div id='message'>" +
        striptags(markdown.render(striptags(data.message)), [
          "strong",
          "i",
          "em",
          "code",
          "a",
          "div",
          "sub",
          "sup",
          "s",
          "abbr",
          "dl",
          "hr",
          "ins",
          "section",
          "ol",
          "li",
          "sup",
          "sub",
          "code",
          "pre",
          "br",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
        ]) +
        "</div></div>",
    );
    client
      .to(data.room)
      .emit(
        "broad",
        "<div style='margin: 10px 0;'><span>" +
          data.user.disName +
          "@" +
          data.user.ugn +
          " <span style='font-size: small;'>[at " +
          new Date().toLocaleString(new Date().getTime()) +
          "]</span></span><div id='message'>" +
          striptags(markdown.render(striptags(data.message)), [
            "strong",
            "i",
            "em",
            "code",
            "a",
            "div",
            "sub",
            "sup",
            "s",
            "abbr",
            "dl",
            "hr",
            "ins",
            "section",
            "ol",
            "li",
            "sup",
            "sub",
            "code",
            "pre",
            "br",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
          ]) +
          "</div></div>",
      );
  });
});

httpServer.listen(8443, () => {
  console.log("running arcs at localhost:8443");
});
