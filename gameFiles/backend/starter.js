import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const games = []

wss.on('connection', function connection(ws, req) {
  // const ip = req.socket.remoteAddress;
  console.dir(ws)
  console.log("ip address of user: " + ip)
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  // starts a game session
  ws.on('startSession', function gameRoom(data) {
    ws.emit(data)
  })

  ws.send('something');
});

// a quick response to know the websocket started
console.log("websocket started")