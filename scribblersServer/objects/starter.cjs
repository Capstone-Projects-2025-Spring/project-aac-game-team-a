const express = require('express');
const SocketHandlerClass = require("./SocketHandler.js")
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
  socket.on("draw_data", (data) => {
    console.log("draw_data log")
    try {
        // const jsonData = JSON.parse(data);
        // console.log('Received JSON data:', jsonData);
        // const roomId = jsonData.roomId
        // console.log('room id: ' + roomId)
        // const returnData = {
        //     "roomID": roomId, 
        //     "msg": jsonData.msg, 
        //     "sender": socket.id
        // }
        // io.to(roomId).emit("on_chat_message", JSON.stringify({"message":returnData}));
        // console.log(socket.id + " sent " + {"message":data} + " to " + roomId +" room")
        console.log(data)

    } catch (err){
        console.log("Message data unable to be updated");
        console.error(err)
    }
});

});



server.listen(3001, () => {
  console.log('listening on *:3001');
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