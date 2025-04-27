# Scribblers Backend Documentation

## Overview
This document covers the backend server architecture and functionality.

## Project Structure

### Main Files
- **server.js**: Main entry point that initializes the Express server and Socket.io connections
- **SocketServerHandler.js**: Manages socket server interactions and client event listeners
- **GameData.js**: Handles game session data and round management

## Classes

### SocketHandler
```
Class: SocketHandler
Location: SocketServerHandler.js
```

This class manages socket initialization and event listeners for client-server communication.

#### Methods

##### `createServerInstance(httpServer)`
Creates and configures a new Socket.io server instance.

- **Parameters**:
  - `httpServer` - HTTP server created using an Express application
- **Returns**: 
  - New Socket.io server instance on success
  - `0` on failure
- **Configuration**:
  - CORS: Allows connections from any origin
  - Methods: GET, POST

##### `startServer(httpServer, port)`
Starts the HTTP server on the specified port.

- **Parameters**:
  - `httpServer` - HTTP server created using an Express application
  - `port` - Port number to listen on

##### `initializeServerListeners(server, client, gameDataMap)`
Initializes Socket.io event listeners to handle client requests.

- **Parameters**:
  - `server` - Socket.io server instance
  - `client` - Socket.io client connecting to server
  - `gameDataMap` - Server-side map of game session data

#### Event Listeners

| Event | Description |
|-------|-------------|
| `start-game` | Starts a new game session in the specified room |
| `play-again` | Resets the game to play another round |
| `create-new-lobby` | Generates a unique room code and creates a new game session |
| `join-room` | Handles a player joining an existing room |
| `leave-room` | Manages player disconnection and room cleanup |
| `reset-scores` | Resets all player scores in a room |
| `update-user-guess` | Updates a player's guess and checks if all players guessed correctly |
| `draw-init` | Initializes drawing parameters for all clients |
| `draw` | Broadcasts draw coordinates to all clients |
| `draw-end` | Signals the end of a drawing action |
| `draw-clear` | Clears the canvas for all clients |
| `draw-undo` | Undoes the last drawing action |
| `disconnect` | Handles client disconnection |

### GameData
```
Class: GameData
Location: GameData.js
```

This class manages game session data and round mechanics.

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `numberRounds` | number | Total number of rounds configured for the game |
| `currentRound` | number | Current round number |
| `maxPlayers` | number | Maximum number of players allowed |
| `players` | array | Array of player avatars in the game |
| `prompt` | object | Current drawing prompt |
| `drawer` | string | Current player assigned to draw |
| `timerID` | number | Timer interval ID |
| `timerValue` | number | Current time remaining in seconds |
| `playerData` | Map | Player-specific data (scores, guesses) |

#### Methods

##### `constructor(numberRounds, currentRound, maxPlayers, players, prompt, drawer, timerID, timerValue, playerData)`
Creates a new game session with specified parameters.

##### `startNewRound(server, room, gameDataMap)`
Begins a new round in the specified room.

- **Parameters**:
  - `server` - Socket.io server instance
  - `room` - Room identifier
  - `gameDataMap` - Server-side map of game session data
- **Process**:
  1. Clears previous guesses
  2. Increments round number
  3. Checks if game should end
  4. Selects a new drawer
  5. Generates new prompt
  6. Starts round timer

##### `getPromptObject()`
Randomly selects a drawing prompt, avoiding previously used prompts.

- **Returns**: A prompt object containing word and type

##### `getPath(promptObject)`
Forms the file path for the prompt image.

- **Parameters**:
  - `promptObject` - The selected prompt object
- **Returns**: Path to the prompt image

##### `clearGuesses(server, room)`
Clears all player guesses and updates clients.

- **Parameters**:
  - `server` - Socket.io server instance
  - `room` - Room identifier

##### `allGuessesCorrect()`
Checks if all players have guessed correctly.

- **Returns**: `true` if all non-drawing players guessed correctly, `false` otherwise

##### `updateTimer(server, room, gameDataMap)`
Updates the round timer and handles timer expiration.

- **Parameters**:
  - `server` - Socket.io server instance
  - `room` - Room identifier
  - `gameDataMap` - Server-side map of game session data

## Game Constants

### Prompts
The game includes drawing prompts organized by categories:
- Actions: Eat, Jump, Run, Sleep
- Animals: Bird, Cat, Dog, Elephant, Horse, Mouse
- Clothing: Glasses, Glove, Hat, Pants, Shirt, Shoe
- Food: Apple, Banana, Carrot, Grapes, Pizza, Spaghetti
- Shapes: Circle, Oval, Square, Triangle

### Game Settings
- Round duration: 60 seconds
- Images per prompt: 3

## Game Flow

1. Players create or join a room using a unique code
2. Host starts the game
3. For each round:
   - A random player is selected as the drawer
   - A random prompt is assigned
   - The drawer draws the prompt
   - Other players attempt to guess the word
   - Round ends when time expires or all players guess correctly
4. Game ends after the configured number of rounds

## Server Initialization (server.js)

```javascript
/**
 * This file it the main executable for the Scribblers backend. Node, Express, and Socket.io 
 * are used to listen for requests and send/receive game data.
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
```