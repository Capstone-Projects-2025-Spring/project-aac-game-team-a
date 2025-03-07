const exp = require('constants'); // Importing constants module (not needed in this case)
const express = require('express'); // Importing Express.js to create the server
const http = require('http'); // Importing HTTP module to create an HTTP server
const { Server } = require('socket.io'); // Importing the Server class from socket.io

const app = express(); // Initializing an Express application
const server = http.createServer(app); // Creating an HTTP server using Express

// Initializing a new Socket.io server instance and configuring CORS
const io = new Server(server, {
    cors: {
        origin: "*", // Allows connections from any origin (use restrictive policies in production)
        methods: ['GET', "POST"] // Specifies allowed HTTP methods
    }
});

// Event listener for new socket connections
io.on('connection', (socket) => {
    console.log(`User ${socket.id} is connected`); // Logs when a new user connects

    // Listener for 'message' events from the client
    socket.on('message', (data) => {
        socket.broadcast.emit('message:received', data); // Broadcasts received messages to all other clients
    });

    // Listener for socket disconnection
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`); // Logs when a user disconnects
    });
});

// Start the server and listen on port 3000
server.listen(3000, () => {
    console.log("Chat server is running on port 3000");
});
