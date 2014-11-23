#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
  console.log(request.url);
  response.writeHead(404);
  response.end();
});

server.listen(5050, function() {
  console.log('Server is listening on port 5050');
});

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

wsServer.on('request', function(request) {
  var connection = request.accept('echo-protocol', request.origin);

  connection.on('message', function(message) {
      connection.sendUTF(message.utf8Data);
      console.log('message: ' + message.utf8Data);
  });

  connection.on('close', function(reasonCode, description) {
    console.log('closed');
  });
});
