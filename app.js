// Imports
const pino = require('pino');
const pretty = require('pino-pretty');
const logger = pino(pretty());
const fastify = require("fastify")({ logger: logger });
const fastifyIO = require("fastify-socket.io");
const cors = require("@fastify/cors");
const striptags = require("striptags");
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const fmsql = require('@fastify/mysql');
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
  .use(require('markdown-it-link-attributes'), {
  attrs: {
    target: '_blank',
  }
})
  .use(require("markdown-it-task-lists"));

// Declarations
/* none needed */
  
// Functions
function cleanseMessage(message) {
    return striptags(markdown.render(striptags(message)), [
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
            'h3','h4','h5','h6', 'ul', 'input'
          ])
}

function createMessage(username, message, bio) {
  let cleansedMessage = cleanseMessage(message);
  let formattedUsername = `<span class='pfplink' onclick='window.location = "/profile?user=${username}&bio=${bio}"'>${username}</span>`;
  let formattedDate = `<span style='font-size: small;'> [at <span id='date'></span>]</span>`;
  let formattedMessage = `<div id='message'><pre>${cleansedMessage}</pre></div>`;
  let formattedDiv = `<div style='margin: 10px 0;'><span>${formattedUsername}${formattedDate}</span>${formattedMessage}</div>`;

  return formattedDiv;
}

// Init
fastify.register(fastifyIO);
fastify.register(cors);
fastify.register(
  require('@fastify/compress'),
  { global: true }
);
fastify.register(require("@fastify/view"), {
  engine: {
    ejs: require("ejs"),
  },
});
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
});

fastify.register(fmsql, {
  connectionString: `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
})
  
fastify.register(function (instance, options, done) {
  instance.setNotFoundHandler(function (req, res) {
                                                        code = 404
                                                        msg = "Can't find that webpage."
                                                        res.view("/views/error.ejs") 
  })
  done()
}, { prefix: '/' })
                                                         
fastify.setErrorHandler(function (err, req, res) {
  request.log.warn(err)
  var statusCode = err.statusCode >= 400 ? err.statusCode : 500
  res
    .code(statusCode)
    .type('text/html')
    .send(ejs.render(fs.readFileSync('./views/error.ejs', 'utf8'), { code: statusCode, msg: err.message }))
})

// GET Routes                                                         
fastify.get("/", function (req, res) {
  res.view("/views/main.ejs");
});

fastify.get("/chat", function (req, res) {
    res.view("/views/chat.ejs");
});

fastify.get("/profile", function (req, res) {
  user = req.query.user
  bio = req.query.bio

  res.view("/views/profile.ejs");
});

fastify.get("/edit", function (req, res) {
  res.view("/views/editinfo.ejs");
});

fastify.get("/about", function (req, res) {
  res.view("/views/about.ejs");
});

fastify.get("/rules", function (req, res) {
    res.view("/views/rules.ejs");
});
                                                         
// POST Routes                                                         
fastify.post('/api/user/verify', async (request, reply) => {
  const { username, ugn, bio, password } = request.body;

  try {
    const connection = fastify.mysql.getConnection();

    // Query the database to check if the user exists
    const result = await connection.query('SELECT COUNT(*) AS count FROM users WHERE username = ?', [username]);
    const userExists = result[0].count > 0;

    // Close the database connection
    connection.release();

    if (userExists) {
      reply.send({ success: false });
    } else {
      reply.send({ success: true });
    }
  } catch (error) {
    console.error(error);
    reply.code(500).send({ success: false, error: 'Internal Server Error' });
  }
});
                                                         
                                                         
fastify.ready().then(() => {
  
fastify.io.on('connection', (client) => {
  logger.info('Client connected...')
  client.join('::GENERAL')

  client.on('join', function(data) {
    if (data.user.disName !== undefined) {
      if (data.preroom !== '') {
        client.leave(data.preroom);
        client.join(data.room);
        client.to(data.room).emit('broad', `<div class='statusmsg'>${data.user.disName}@${data.user.ugn} joined this chat room.</div>`);
        client.to(data.preroom).emit('broad', `<div class='statusmsg'>${data.user.disName}@${data.user.ugn} left this chat room.</div>`);
        client.emit('broad', `<div class='statusmsg'>You joined ${data.room}.</div>`);
      } else {
        logger.info(`${data.user.disName}@${data.user.ugn} joined.`);
        client.to('::GENERAL').emit('broad', `<div class='statusmsg'>${data.user.disName}@${data.user.ugn} joined this chat room.</div>`);
        client.emit('broad', "<div class='statusmsg'>You joined the chat room.</div>");
      }
    }
  });

  client.on('connect_error', (err) => {
    logger.error(`connect_error due to ${err.message}`)
  })

  client.on('messages', (data) => {
    if (data.user.disName !== undefined) {
      const message = createMessage(`${data.user.disName}@${data.user.ugn}`, data.message, data.user.bio);
      client.emit('broad', message);
      client.to(data.room).emit('notification', data);
      client.to(data.room).emit('broad', message);
    }
  });
})
});
                                                         
fastify.listen({ path: 'passenger', host: '127.0.0.1' });