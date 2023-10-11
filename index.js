// Imports
const socketio = require("socket.io");
const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Declarations
let app, httpServer, io;

/* Routes */
let routes = {
  main: require("./routes/main.js"),
};

// Functions

// Initialization
app = express();
httpServer = http.createServer(app);
io = new socketio.Server(httpServer, {
  /* options */
});

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* Routes */
app.use("/", routes.main);

// Socket.io
io.on("connection", (client) => {
  console.log("Client connected...");
  client.join("::GENERAL");

  client.on("messages", (data) => {
    client.emit(
      "broad",
      "<div><span>" +
        data.user.disName +
        " (" +
        data.user.uuid +
        "): </span><span>" +
        data.message +
        "</span></div>",
    );
    client.to(data.room).emit("broad", "<div>");
  });
});

httpServer.listen(8443);
