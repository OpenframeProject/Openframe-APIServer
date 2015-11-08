/*jslint node: true, indent: 2 */
'use strict';
var restify, bunyan, routes, log, server, socketio, io;

var restify = require('restify'),
    bunyan  = require('bunyan'),
    routes  = require('./routes/'),
    socketio = require('socket.io'),
    log = bunyan.createLogger({
      name        : 'openframe-api',
      level       : process.env.LOG_LEVEL || 'info',
      stream      : process.stdout,
      serializers : bunyan.stdSerializers
    }),
    server,
    socketio,
    io,
    db = require('./core/db').connect();

// create restify server
server = restify.createServer({
  name : 'openframe-api',
  log  : log,
  formatters : {
    'application/json' : function (req, res, body) {
      res.setHeader('Cache-Control', 'must-revalidate');

      // Does the client *explicitly* accepts application/json?
      var sendPlainText = (req.header('Accept').split(/, */).indexOf('application/json') === -1);

      // Send as plain text
      if (sendPlainText) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      }

      // Send as JSON
      if (!sendPlainText) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      }
      return JSON.stringify(body);
    }
  }
});


server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.pre(restify.pre.sanitizePath());

// create socket.io server
io = socketio.listen(server.server);

/*jslint unparam:true*/
// Default error handler. Personalize according to your needs.
// server.on('uncaughtException', function (req, res, err) {
//   console.log('Error!');
//   console.log(err);
//   res.send(500, { success : false });
// });
/*jslint unparam:false*/

server.on('after', restify.auditLogger({ log: log }));

// setup routes
routes(server, io);

console.log('Server started.');
server.listen(8888, function () {
  log.info('%s listening at %s', server.name, server.url);
});

