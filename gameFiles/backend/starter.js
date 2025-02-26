import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, req) {
  const ip = req.socket.remoteAddress;
  console.log("ip address of user: " + ip)
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});

// a quick response to know the websocket started
console.log("websocket started")

// const wss = new WebSocket.Server({ port: 8080 });

// wss.on('connection', ws => {
//   console.log('Client connected');

//   ws.on('message', message => {
//     console.log(`Received: ${message}`);
//     ws.send(`Server received: ${message}`);
//   });

//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });

//   ws.on('error', error => {
//     console.error('WebSocket error:', error);
//   });
// });

// console.log('WebSocket server started on port 8080');