var connect = require('connect'),
  sio = require('socket.io');

var app = connect.createServer(
  connect.static(__dirname + '/public')
);

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {

  socket.on('face', function (message) {
    console.log((new Date()) + ' Server on message');
    socket.broadcast.volatile.emit('facecast', message);
  });

  socket.on('disconnect', function () {
    console.log('close %d', socket.id);
  });

});

io.configure('production', function () {
  io.enable('browser client minification');
  io.enable('browser client etag');
  io.enable('browser client gzip');
  io.set('log level', 1);
  io.set('transports', [
    'websocket'
    , 'xhr-polling'
  ]);
});

app.listen(3000, function () {
  console.log("Connect server listening on port %d in %s mode", app.address().port, process.env.NODE_ENV);
});