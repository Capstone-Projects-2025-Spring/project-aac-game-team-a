---
sidebar_position: 1
---

# System Overview
## Project abstraction

Scribblers is a web-based, Pictionary-style game that integrates Augmentative and Alternative Communication (AAC) controls. The project uses frontend frameworks for AAC communication, drawing functionality, lobby hosting and joining, real-time event handling, and real-time communication. The backend manages external API integration, game logic, real-time user interactions, and game history and statistics.

## Conceptual Design
### Frontend  
* **Vue.js 3** -  Frontend framework for building the game interface and handling client-side events.
* **Vue Router** - Library for dynamic navigation between views and components.
* **Pinia** - State management library for maintaining consistent state across UI components.
* **HTML5 Canvas** - API for managing the drawing board and user drawing actions.
* **Socket.io (Client-Side)** - Library for real-time communication between players via WebSocket.

### Backend
* **Node.js** - Backend runtime environment for processing game logic, managing server-side state, and handling real-time events.
* **Express** - Web server framework for establishing API endpoints and managing HTTP requests.
* **Socket.io (Server-Side)** - Library for broadcasting real-time updates between clients through WebSocket connections.

### Deployment
* **Fly.io** - Cloud deployment platform to deploy the frontend and backend
* **Docker Container** - Package that will bundle the application's build and run environment configuration to be deployed by Fly.io
