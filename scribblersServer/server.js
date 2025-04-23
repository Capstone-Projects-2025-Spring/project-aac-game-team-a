/**
 * This file it the main executable for the Scribblers backend. Node, Express, and Socket.io 
 * are used to listen for requests and send/recieve game data.
 */
//  IMPORTING
const express = require('express'); // Creates backend server
const http = require('http'); // Creates HTTP server
const SocketServerHandler = require("./objects/SocketServerHandler.js"); // Manages socket server interactions

//  INITIALIZATIONS
const app = express(); // Express initialization
const server = http.createServer(app); // Create HTTP server using Express
const mappedGameData = new Map(); // Create global map to manage game data objects
const SocketServer = new SocketServerHandler(); // Create socket manager
const io = SocketServer.createServerInstance(server); // Create Socket.io server instance

// Event listener for new socket connections
io.on('connection', (socket) => {
    
    SocketServer.initializeServerListeners(io, socket, mappedGameData);
});

SocketServer.startServer(server, 3001);
