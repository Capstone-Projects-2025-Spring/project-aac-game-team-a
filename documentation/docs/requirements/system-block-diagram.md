---
sidebar_position: 2
---

# System Block Diagram
![System Block Diagram](https://github.com/Capstone-Projects-2025-Spring/project-aac-game-team-a/blob/docasaurus-system-block-diagram/documentation/static/img/system-block-diagram.png?raw=true)
**Figure 1.** High-level design of Scribblers! web application.

## Description
The system diagram shown in Figure 1 shows the architecture of the Scribblers application at a high-level.
AAC and Non-AAC Users access the game through the same webpage interface. 
The webpage is rendered by the React front-end framework, handling user inputs and updating the webpage with game data processed by the back-end. 
The back-end, hosted on a server running Node.js, processes any data received from the front-end and handles external API calls as needed.