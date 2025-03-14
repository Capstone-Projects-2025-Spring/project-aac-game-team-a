// socket.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import socketClient from './client';
// import { io, server } from '../gameFiles/backend/starter.cjs';

describe('Socket.IO Connection', () => {
  let clientSocket;
  let clients = [];

  beforeAll((done) => {
    // server.listen(3001, () => { // Use a different port for testing
    //   clientSocket = socketClient;
    //   clientSocket.on('connect', done);
    // });
      clientSocket = socketClient;
      clientSocket.on('connect', done);
    // for(let interval=0; interval<4; interval++){
    //     clientSocket = new client();
    //     clientSocket = clientSocket.socket
    //     clientSocket.on('connect', done);
    //     clients.push(clientSocket)
    // }

  });

  afterAll((done) => {
    // for(let interval=0; interval<clients.length; interval++){
    //     let socketClient = clients.pop()
    //     socketClient.close()
    // }
    clientSocket.close();
    // io.close(done);
    // server.close();
  });

  it('should connect to the server', () => {
    expect(clientSocket.connected).toBe(true);
  });

  it('should receive a message from the server', (done) => {
    clientSocket.emit('message', 'Hello Server');

    clientSocket.on('message', (data) => {
      expect(data).toBe('Hello Server');
      done();
    });
  });

  it('should handle disconnect', (done) => {
    clientSocket.disconnect();
    clientSocket.on('disconnect', () => {
      expect(clientSocket.connected).toBe(false);
      done();
    });
  }, 500);
});





// import { beforeEach, describe, afterEach, test, expect, toBe } from "vitest";
// import { io } from 'socket.io-client';


// function createSocketClient() {
//     const SERVER_URL = 'http://localhost:3000'
//     return io(SERVER_URL, { autoConnect: true });
// }

// describe('websocket unit tests', () => {
//     let clients = [];

//     beforeEach(() => {
//         // Create multiple clients
//         for (let i = 0; i < 3; i++) {
//             const socket = createSocketClient();
//             clients.push(socket);
//             //socket.connect();
//         }
//     });

//     afterEach(() => {
//         // Disconnect all clients
//         clients.forEach(socket => socket.disconnect());
//         clients = [];
//     });

//     test('Clients should connect to the server', async () => {
//         clients.forEach(socket => {
//             //console.log(socket)
//             io.on('connection', (socket) => {
//                 console.log(`New connection: ${socket.id}`);
            
//                 socket.emit('notification', 'Thanks for connecting to Codedamn!')
            
//                 socket.on('message', (data) => {
//                     console.log(`New message from ${socket.id}: ${data}`);
//                 })
//             })
            
//             expect(socket.connected).toBe(true);
//         });
//     });

// })