---
sidebar_position: 2
---

# System Block Diagram
![System Block Diagram](https://capstone-projects-2025-spring.github.io/project-aac-game-team-a/img/system-block-diagram.png)

**Figure 1.** High-level design of Scribblers! web application.

## Description
The Scribblers! project stack is composed as followed:

#### Front-End: 
* Vue.js
* Socket.io (Client)

#### Back-End: 
* Node.js
* Express
* Socket.io (Server)

#### Hosting: 
* Fly.io

AAC and Non-AAC Users access the game through the same webpage interface. The front-end handles visual rendering, user input for all features, and updating the webpage with game data processed by the back-end. The back-end processes any data sent by the front-end, handles game data functions such as timers and round starting and stopping, and updates the other users with data from the server to maintain syncronization across multiple users.

