
# Frontend-Backend Integration Documentation

## Overview

This documentation provides a comprehensive guide to the frontend-backend integration for the Scribblers game application. The system uses WebSockets for real-time communication between the client and server, enabling features like live drawing, game state synchronization, and player interaction.

## WebSocket Communication

### Socket Connection

The game client establishes a WebSocket connection to the server when the game component is mounted:

```javascript
mounted() {
    this.socketInstance = SocketHandler.connectSocketServer(socketServer, testServer, inProduction, this)
}

```

The connection parameters include:

-   `socketServer`: The production server address ("scribblersserver.fly.dev")
-   `testServer`: The local development server address ("localhost")
-   `inProduction`: Boolean flag to determine which server to connect to

### Socket Client Handler

The application uses a `SocketClientHandler` class to manage WebSocket connections:

```javascript
import SocketClientHandler from "../objects/SocketClientHandler.js";
const SocketHandler = new SocketClientHandler;

```

This handler likely contains methods for establishing connections, registering event listeners, and managing the WebSocket lifecycle.

## Socket Events

### Outgoing Events (Client to Server)


| Event Name       | Parameters                        | Description                                 |
|------------------|-----------------------------------|---------------------------------------------|
| leave-room       | roomCode, username                | Notifies server when a player leaves the room |
| update-user-guess| roomCode, username, guess, imagePath, score | Sends player's guess to the server          |
| draw-init        | roomCode, x, y, drawColor, drawWidth | Initializes drawing action                  |
| draw             | roomCode, x, y                    | Sends ongoing drawing coordinates           |
| draw-end         | roomCode                          | Signals end of drawing stroke               |
| draw-clear       | roomCode                          | Requests to clear the canvas                |
| draw-undo        | roomCode                          | Requests to undo the last drawing action    |
| timer-start      | roomCode, length                  | Requests to start the game timer            |
| start-game       | roomCode                          | Initiates the game session                  |
| reset-scores     | roomCode                          | Resets all player scores                    |
| play-again       | roomCode                          | Requests to restart the game                |


### Incoming Events (Server to Client)

While the events aren't explicitly defined in the provided code, based on the client implementation, we can infer the following server events:


| Event Name      | Description                                |
|-----------------|--------------------------------------------|
| connect         | Confirms successful connection to the server |
| disconnect      | Signals disconnection from the server      |
| room-update     | Updates player list and room status        |
| game-start      | Notifies clients that the game has started |
| game-end        | Notifies clients that the game has ended   |
| round-start     | Signals the start of a new round           |
| round-end       | Signals the end of a round                 |
| draw-data       | Receives drawing data from the server      |
| timer-update    | Updates the remaining time in the round    |
| guess-update    | Updates player guess information           |
| prompt-update   | Provides the drawing prompt to the drawer  |


## Game State Management

The application uses a state management pattern to track game information:

```javascript
import { GameState } from '@/stores/GameState';
import { SettingState } from '@/stores/SettingState';

```

### GameState Store

Stores game-related information:

-   `currentUser`: Current player's username
-   `currentUserAvatar`: Current player's avatar image
-   `roomCode`: Room identifier
-   `isHost`: Whether the current user is the host
-   `maxPlayers`: Maximum number of players allowed
-   `rounds`: Number of game rounds
-   `isHostPlaying`: Whether the host is also playing

### SettingState Store

Manages application settings:

-   `enableTTS`: Toggle for text-to-speech functionality
-   `volumeTTS`: Volume level for text-to-speech
-   `showSettings`: Controls visibility of settings overlay

## Game Flow

1.  **Room Creation/Joining**:
    
    -   Host creates a room with settings for max players and rounds
    -   Players join using the room code (represented as shapes)
2.  **Waiting Room**:
    
    -   Players see who has joined
    -   Host can start the game once ready
3.  **Game Play**:
    
    -   Random player is selected as drawer
    -   Drawer receives a prompt word and reference image
    -   Other players guess using AAC board
    -   Round timer counts down
    -   Players receive points based on correct guesses and timing
4.  **Round Transition**:
    
    -   Round ends when time runs out or all players guess correctly
    -   New drawer is selected for next round
5.  **Game End**:
    
    -   After all rounds complete, end screen shows results
    -   Players can choose to play again or leave

## Error Handling

The application includes error handling for WebSocket disconnections:

```javascript
serverDisconnect() {
    try {
        this.playerCount = 0;
        this.speakNow('Quitting game')
        if (this.socketInstance && this.socketInstance.connected) {
            this.socketInstance.emit("leave-room", this.roomCodeStr, GameState().currentUser);
            this.socketInstance.disconnect();
            console.log("Disconnected from server.");
        } else {
            console.warn("Socket is not connected or already null.");
        }
    } catch (error) {
        console.error("Error during disconnection:", error.message || error);
    }
}

```

## Accessibility Features

The application includes text-to-speech functionality for accessibility:

```javascript
speakNow(textToSpeak) {
    speechSynthesis.cancel();
    if(this.settingsState.enableTTS && !textToSpeak.includes('null')){
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.volume = this.settingsState.volumeTTS
        utterance.lang = 'en';
        speechSynthesis.speak(utterance);
    }
}

```

## Development Environment Configuration

The application includes configuration for switching between development and production environments:

```javascript
const inProduction = false; //change this variable to switch between connecting to public backend server and localhost
const socketServer = "scribblersserver.fly.dev"; //web address for hosted websocket server
const testServer = "localhost" //set to IP address of test server

```

## Recommendations for Implementation

1.  **Server-Side Implementation**:
    
    -   Implement matching socket event handlers on the server side
    -   Add validation for all incoming socket events
    -   Implement room management with unique codes
    -   Track player connections and handle disconnections gracefully
2.  **Authentication & Authorization**:
    
    -   Consider adding simple authentication for persistent user identities
    -   Implement room ownership validation for host-only actions
3.  **Data Persistence**:
    
    -   Consider storing game history and user statistics
    -   Implement leaderboards for competitive play
4.  **Performance Optimization**:
    
    -   Optimize drawing data transmission for bandwidth efficiency
    -   Implement throttling for rapid drawing actions
5.  **Testing**:
    
    -   Create test cases for socket communication
    -   Test disconnection and reconnection scenarios
    -   Verify game state synchronization across multiple clients