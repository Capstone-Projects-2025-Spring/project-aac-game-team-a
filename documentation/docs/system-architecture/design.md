---
sidebar_position: 1
---

**Purpose**

The Design Document - Part I Architecture describes the software architecture and how the requirements are mapped into the design. This document will be a combination of diagrams and text that describes what the diagrams are showing.

**Requirements**

In addition to the general requirements the Design Document - Part I Architecture will contain:

### Frontend (Client-Side):

**GameRoom**  
The GameRoom class contains elements that pertain to management of game sessions, including players, game rounds, and prompt information. It is the core game logic and controls the flow of the game such as which players are drawing, which players are guessing, the transitions between rounds, and starting and ending the game. It will handle prompts ensuring that none are repeated, and provides references to images pertaining to the prompts. This class also handles server-side functionality but for organization it is under client-side.

**Player**  
This class is used to represent individual users who will be playing the game. It will store a player’s details and score pertaining to the game session, and 

**DrawingCanvas**  
This class handles drawing functionality such as the canvas to draw on, the tools to draw with, and the stroke/color to draw with. It gathers the data from the drawer so it can be sent to the interfaces of the other players. It will also aid in displaying the reference image to the current drawer and only the drawer. 

**ReferenceImageProvider**  
This will gather any paths to reference images to feed to GameRoom class so it can be displayed to the current drawer. The image paths are selected by the current word for the drawing prompt, and ensures that image selection is randomized each time. 

**ChatMessage**  
The messages or symbols to be sent in chat are handled by this class. It stores a player’s chat history to broadcast it to other player interfaces and also to determine the correct word for a prompt.

**GameSettings**\
This class is used to provide game sessions with rules and configurations such as how much time per round, how many players can join, and if AAC controls are enabled or not.

**AACBoard**\
This class manages AAC board integration from the AsTeRICS Grid REST API. It will fetch and store symbols from a board in the API and allow players to use them in the chat.

**AACSymbol**\
This class is used to represent symbols fetched from the API with information such as an ID and the URL, and then give a label and category. 

### Backend (Server-Side):

**GameSession**  
This class uses the attributes from the GameRoom class and starts the game. GameSession handles the functionality of game session initiation, progression, and termination. It keeps track of current players in session, rounds completed, and then determines the winning player at the end. 

**DataDrawing**  
This class is fed by the GameSession class and records the data from drawings made by an individual user.

**StrokeData**  
The class is used to represent an individual stroke of a drawing, and stores the coordinates, color, and size.

**SocketHandler**  
This class manages WebSocket integration so that players can interact in real-time. It will handle client-server communication such ad connections, disconnections, drawing and chat events, and round starting or stopping.

<img width="1057" alt="Screenshot 2025-02-14 at 6 00 27 PM" src="https://github.com/user-attachments/assets/557f1ac1-3c1d-4f5d-8f31-6e43e22697d5" />
<img width="1050" alt="Screenshot 2025-02-14 at 6 03 46 PM" src="https://github.com/user-attachments/assets/52505ab7-c295-41a5-9da8-6bc54d5100c5" />

Sequence diagrams showing the data flow for _all_ use cases. One sequence diagram corresponds to one use case and different use cases should have different corresponding sequence diagrams.

Describe algorithms employed in your project, e.g. neural network paradigm, training and training data set, etc.

If there is a database:

Entity-relation diagram.

Table design.

A check list for architecture design is attached here [architecture\_design\_checklist.pdf](https://templeu.instructure.com/courses/106563/files/16928870/download?wrap=1 "architecture_design_checklist.pdf")  and should be used as a guidance.
