/**
 * Handles all socket client events including server connection and listener initialization.
 */
import io from "socket.io-client"; // Import the socket.io-client library to enable WebSocket communication

class SocketClientHandler {

    /**
     * Initialize connection to socket server.
     * @param {*} socketInstance 
     * @param {*} socketServer 
     * @param {*} isProduction 
     */
    initServerConnection(socketInstance, socketServer, inProduction){
        // Establish connection to the WebSocket server
        if (inProduction) 
            socketInstance = io(socketServer);
        else 
            socketInstance = io("http://localhost:3001");
    }

}

