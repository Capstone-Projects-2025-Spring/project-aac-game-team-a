
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=17850491)
<div align="center">

# Scribblers
[![Report Issue on Jira](https://img.shields.io/badge/Report%20Issues-Jira-0052CC?style=flat&logo=jira-software)](https://temple-cis-projects-in-cs.atlassian.net/jira/software/c/projects/DT/issues)
[![Deploy Docs](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml/badge.svg)](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml)
[![Documentation Website Link](https://img.shields.io/badge/-Documentation%20Website-brightgreen)](https://capstone-projects-2025-spring.github.io/project-aac-game-team-a/)


</div>


## Keywords

Section #, as well as any words that quickly give your peers insights into the application like programming language, development platform, type of application, etc.

## Project Abstract

The goal of "Scribblers!" is to create a fun experience for children who struggle with communicating verbally or who prefer to use other forms of communication. This project emulates the game "Pictionary", but includes the use of a custom AAC (Augmented and Alternative Communication) board along with other accesibility features. Users will take turns drawing a random prompt, and those who take on the role of a guesser will use the AAC board to select their guesses.

## High Level Requirement

The requirements that will be needed for the game to flow as intended will include: 
* Lobby Management
* Drawing Interface
* Avatar Selection
* Turn-Based Gameplay
* LeaderBoard
* Game Progression
* Real-Time Interaction

The requirements for accessibility functionality include:
* AAC Communication
* Audio and Visual Feedback
* Customization Options for Audio and Visual Feedback

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
  
## Background

"Scribblers!" draws inspiration from the game "Pictionary" where a drawer is given a word to draw at the start of the round, and guessers will take turns to try and guess what the word is based on how the drawing looks. The number of rounds and number of players is specifed by the users, and the game includes a timer that is used to calculate a user's score. 

Inspiration for the AAC board is drawn from the [AsTeRICS Grid](https://grid.asterics.eu/#grid/grid-data-1739806952446-161) project that includes examples and open source AAC boards.

## Required Resources

### Hardware
* Laptop device
* Tablet device
* Mobile device (Out of scope)

### Software
* Deployment service
* IDE (Web or Desktop service)

## Collaborators

[//]: # ( readme: collaborators -start )
<table>
<tr>
    <td align="center">
        <a href="https://github.com/tuo62395">
            <img src="https://github.com/user-attachments/assets/435425ae-fc11-42ec-a150-2d36e2cd33a7" width="100;" alt="SchwartzIsaac"/>
            <br />
            <sub><b>Isaac Schwartz</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/kenfonseca">
            <img src="https://github.com/Capstone-Projects-2025-Spring/project-aac-game-team-a/blob/main/documentation/static/img/kenProfPic.jpeg?raw=true" width="100;" alt="FonsecaKenneth"/>
            <br />
            <sub><b>Kenneth Fonseca</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/tlheyward">
            <img src="https://github.com/Capstone-Projects-2025-Spring/project-aac-game-team-a/blob/main/documentation/static/img/terrellProfPic.jpg?raw=true" width="100;" alt="HeywardTerrell"/>
            <br/>
            <sub><b>Terrell Heyward</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/ljtron">
              <img src="" width="100;" alt="McloudLincoln"/>
              <br/>
              <sub><b>Lincoln Mcloud</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/Vasil132">
            <img src="" width="100;" alt="KladasVasilios"/>
            <br/>
            <sub><b>Vasilios Kladas</b></sub>
        </a>
    </td>
    <td align="center">
          <a href="https://github.com/Dex215">
              <img src="" width="100;" alt="GiglioDex"/>
              <br/>
              <sub><b>Dex Giglio</b></sub>
          </a>
    </td>
</tr>
</table>

[//]: # ( readme: collaborators -end )
