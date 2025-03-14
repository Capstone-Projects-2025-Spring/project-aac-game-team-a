const express = require('express');
const SocketHandlerClass = require("./SocketHandler.cjs")
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', async (socket) => {

  console.log("New user joined server: " + socket.id)

  const SocketHandler = new SocketHandlerClass(io, socket)
  SocketHandler.onPlayerJoin()
  SocketHandler.broadcastToRoom()
  SocketHandler.onChatMessage()

});



server.listen(3000, () => {
  console.log('listening on *:3000');
});

// import { WebSocketServer } from 'ws';

// const wss = new WebSocketServer({ port: 8080 });
// const games = []

// wss.on('connection', function connection(ws, req) {
//   // const ip = req.socket.remoteAddress;
//   console.dir(ws)
//   console.log("ip address of user: " + ip)
//   ws.on('error', console.error);

//   ws.on('message', function message(data) {
//     console.log('received: %s', data);
//   });

//   // starts a game session
//   ws.on('startSession', function gameRoom(data) {
//     ws.emit(data)
//   })

//   ws.send('something');
// });

// // a quick response to know the websocket started
// console.log("websocket started")