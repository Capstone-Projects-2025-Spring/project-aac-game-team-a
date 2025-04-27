// socket.test.js
import { describe, it, expect, beforeAll, afterAll, expectTypeOf } from 'vitest';
import socketClient from './client';
import SocketHandler from '../scribblersServer/objects/SocketServerHandler';
import GameDataClass from '../scribblersServer/objects/GameData'
const { Server } = require('socket.io');
import isPortReachable from 'is-port-reachable';
const express = require('express'); // Creates backend server
const http = require('http'); // Creates HTTP server

const app = express(); // Express initialization
const server = http.createServer(app); // Create HTTP server using Express

// import { io, server } from '../gameFiles/backend/starter.cjs';

describe('Socket.IO Connection', () => {
  let socket = new SocketHandler();
  const mappedGameData = new Map();
  const gameData = new GameDataClass(3, 2, 5, "everybody", "dog", "me", 10, 20, mappedGameData)
  let clientSocket;
  let clients = [];

  const playerData = new Map();
  playerData.set("wasd", {currentGuess: "", score: 0})

  // beforeAll((done) => {
  //   // server.listen(3001, () => { // Use a different port for testing
  //   //   clientSocket = socketClient;
  //   //   clientSocket.on('connect', done);
  //   // });
  //     clientSocket = socketClient;
  //     clientSocket.on('connect', done);
  //   // for(let interval=0; interval<4; interval++){
  //   //     clientSocket = new client();
  //   //     clientSocket = clientSocket.socket
  //   //     clientSocket.on('connect', done);
  //   //     clients.push(clientSocket)
  //   // }

  // });

  // afterAll((done) => {
  //   // for(let interval=0; interval<clients.length; interval++){
  //   //     let socketClient = clients.pop()
  //   //     socketClient.close()
  //   // }
  //   clientSocket.close();
  //   // io.close(done);
  //   // server.close();
  // });

  it('Creating the server', () => {
    let tempServer = socket.createServerInstance(server)
    console.log(typeof(tempServer))
    expect(typeof(tempServer)).toBe('object');
    // expect(tempServer).toBe(Server)
    expectTypeOf(tempServer).toBeObject(Server)
  })

  it('starting the server', () =>{
    let tempServer = socket.createServerInstance(server)
    //socket.startServer(server, 3001)
    socket.startServer(server, 3000);
    
    
    // Example Usage
    (async () => {
      //console.log(await isPortReachable(80, {host: 'google.com'}));
      const isReachable = await isPortReachable(3000, { host: '127.0.0.1' });
      console.log(`Port 3001 is ${isReachable ? 'reachable' : 'not reachable'}`);
      expect(isReachable).toBe(true)
    })();
  })

  // it('initalizing the socket', ()=>{
  //   let tempServer = socket.createServerInstance(server)
  //   // const mappedGameData = new Map(); // Create global map to manage game data objects
  //   tempServer.on('connection', (socketContr) => {
  //     socket.initializeServerListeners(tempServer, socketContr, mappedGameData);
  //   })
  //   socket.startServer(server, 3001);
  //   (async () => {
  //     //console.log(await isPortReachable(80, {host: 'google.com'}));
  //     const isReachable = await isPortReachable(3001, { host: '127.0.0.1' });
  //     console.log(`Port 3001 is ${isReachable ? 'reachable' : 'not reachable'}`);
  //     expect(isReachable).toBe(true)
  //   })();

  // })

  it('game data startNewRound', () => {
    let tempServer = socket.createServerInstance(server)
    tempServer.on('connection', (socketCtr) => {
      // socket.initializeServerListeners(tempServer, socketContr, mappedGameData);
      gameData.startNewRound(tempServer, 123, mappedGameData)
      console.log("drawer: " + gameData.drawer)
    })
  })

  it('should connect to the server', () => {
    let result = gameData.getPromptObject()
    console.log("result: " + JSON.stringify(result))
    // expect(clientSocket.connected).toBe(true);
    expect(typeof(result)).toBe('object')
  });

  it('get the path', () =>{
    let result = gameData.getPromptObject()
    let result_path = gameData.getPath(result)
    console.log("result path: " + result_path)

    expect(typeof(result_path)).toBe('string')
  })

  it('all guesses correct', () => {
    let getGuess = gameData.allGuessesCorrect()
    console.log("result from guess")

    expect(typeof(getGuess)).toBe('boolean')
  })

  it('update timer', () =>{
    let tempServer = socket.createServerInstance(server)
    const gameData2 = new GameDataClass(10, 0, 4, 4, null, "", 0, 0, playerData);
    mappedGameData.set("132", gameData2);
    gameData2.updateTimer(tempServer, "132", mappedGameData)
    console.log("gameData: " + mappedGameData.get("132").timerValue)
    let time = mappedGameData.get("132").timerValue
    expect(time).toBe(60)

    gameData2.updateTimer(tempServer, "132", mappedGameData)
    console.log("gameData2: " + mappedGameData.get("132").timerValue)
    time = mappedGameData.get("132").timerValue
    expect(time).toBe(59)
    // expect().
  })
  // it('should receive a message from the server', (done) => {
  //   clientSocket.emit('message', 'Hello Server');

  //   clientSocket.on('message', (data) => {
  //     expect(data).toBe('Hello Server');
  //     done();
  //   });
  // });

  // it('should handle disconnect', (done) => {
  //   clientSocket.disconnect();
  //   clientSocket.on('disconnect', () => {
  //     expect(clientSocket.connected).toBe(false);
  //     done();
  //   });
  // }, 500);
});
