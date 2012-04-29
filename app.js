var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

var WebSocketServer = require('websocket').server;

var ws = new WebSocketServer({
  httpServer: app,
  maxReceivedFrameSize: 0x1000000,
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

ws.on('request', function(req) {
  var con = req.accept(null, req.origin);

  con.on('message', function(message) {
    console.log((new Date()) + ' Server on message');
    //console.log(message);
    if (message.type === 'utf8') {
      // text data
      ws.broadcast(message.utf8Data);
    } else if (message.type === 'binary') {
      ws.broadcast(message.binalyData);
    }
  });

  con.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + con.remoteAddress + ' disconnected.');
  });

});

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});



