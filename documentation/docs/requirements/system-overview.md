---
sidebar_position: 1
---

# System Overview
## Project abstraction

Scribblers is a Pictionary-style, web-based application game that implements AAC controls through an external API. The project uses frontend frameworks for AAC communication, drawing functionality, lobby hosting & joining, real-time event handling, and real-time communciation. The backend will be designed to handle external API implementation, game logic, real-time user interaction updates, and game history & statisitcs. 

## Conceptual Design
### Frontend  
* **Vue.js** - Frontend framework being used to build the game interface, handle client-side event communication, and to comply with the API written for the AAC board to be implemented.
* **Vue Router** - Vue.js library to dynamically update the user interface during navigation between views or components.
* **Pinia** - Vue.js state management framework to store game state and keeping UI componenets consistent during gameplay.
* **Fabric.js** - JavaScript canvas library to handle board and drawing components.
* **Socket.io (Client-Side)** - JavaScript library that uses the WebSocket protocol for real-time communication between users.

### Backend
* **Node.js** - Backend framework to implement a runtime enviornment for handling game logic, handle server-side game state, and manage real-time events.
* **Express** - Framework used to create establish a web server for real-time communcication.
* **Socket.io (Server-Side)** - JavaScript library that uses the WebSocket protocol for providing real-time updates to users.
