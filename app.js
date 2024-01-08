// Imports
const fastify = require("fastify")();
const fastifyIO = require("fastify-socket.io");
const cors = require("@fastify/cors");
const striptags = require("striptags");
const fs = require("read-file");
const path = require("path");
const mysql = require("mysql");
const jdenticon = require("jdenticon");
const markdown = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
})
  .use(require("markdown-it-emoji"))
  .use(require("markdown-it-abbr"))
  .use(require("markdown-it-deflist"))
  .use(require("markdown-it-footnote"))
  .use(require("markdown-it-ins"))
  .use(require("markdown-it-sub"))
  .use(require("markdown-it-sup"))
  .use(require("markdown-it-mark"))
  .use(require("markdown-it-anchor"))
  .use(require("markdown-it-link-attributes"), {
    attrs: {
      target: "_blank",
    },
  })
  .use(require("markdown-it-task-lists"));

// Declarations
let version = fs.sync(path.join(__dirname, "version.txt")).toString().trim();

// Functions
function cleanseMessage(message) {
  return striptags(markdown.render(striptags(message)), [
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
    "ul",
    "input",
  ]);
}

function createMessage(username, message, bio, date) {
  let cleansedMessage = cleanseMessage(message);
  let formattedDiv;
  let formattedUsername = `<a href='/profile/${encodeURIComponent(
    username[0] + "@" + username[1]
  )}'>${username[0]}@${username[1]}</a>`;
  let formattedDate = `<time datetime="${date.toISOString()}">${date.toLocaleString()}</time>`;
  let formattedMessage = `<div id='message'><pre>${cleansedMessage}</pre></div>`;
  formattedDiv = `<div style='margin: 10px 0;'><div class="userDisplay">${jdenticon.toSvg(
    username[2],
    26
  )}<span>${formattedUsername} [at ${formattedDate}]</span></div>${formattedMessage}</div>`;
  return formattedDiv;
}

// Init
fastify.register(fastifyIO, {
  cors: {
    origin: "*",
  },
});
fastify.register(cors, {
  origin: "*",
});
fastify.register(require("@fastify/compress"), { global: true });

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
});
connection.connect();

// GET Routes
fastify.get("/api/version", async (request, reply) => {
  reply.send({ version });
});

// POST Routes

fastify.ready().then(() => {
  fastify.io.on("connection", (client) => {
    console.log("Client connected...");
    client.join("::GENERAL");

    client.on("join", function (data) {
      if (data.user.disName !== undefined) {
        if (data.preroom !== "") {
          client.leave(data.preroom);
          client.join(data.room);
          client
            .to(data.room)
            .emit(
              "broad",
              `<div class='statusmsg'>${data.user.disName}@${data.user.ugn} joined this chat room.</div>`
            );
          client
            .to(data.preroom)
            .emit(
              "broad",
              `<div class='statusmsg'>${data.user.disName}@${data.user.ugn} left this chat room.</div>`
            );
          client.emit(
            "broad",
            `<div class='statusmsg'>You joined ${data.room}.</div>`
          );
        } else {
          console.log(`${data.user.disName}@${data.user.ugn} joined.`);
          client
            .to("::GENERAL")
            .emit(
              "broad",
              `<div class='statusmsg'>${data.user.disName}@${data.user.ugn} joined this chat room.</div>`
            );
          client.emit(
            "broad",
            "<div class='statusmsg'>You joined the chat room.</div>"
          );
        }
      }
    });

    client.on("connect_error", (err) => {
      console.error(`connect_error due to ${err.message}`);
    });

    client.on("messages", (data) => {
      if (data.user.disName !== undefined) {
        const message = createMessage(
          [data.user.disName, data.user.ugn, data.user.uuid],
          data.message,
          data.user.bio,
          data.sent
        );
        client.emit("broad", message);
        client.to(data.room).emit("notification", data);
        client.to(data.room).emit("broad", message);
      }
    });
  });
});

fastify.listen({ path: "passenger", host: "127.0.0.1" });
