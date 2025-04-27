---
sidebar_position: 5
---

# Use-case descriptions

## Use Case Diagram
![AAC_use_case_diagram](https://github.com/user-attachments/assets/be1ec26e-8bf2-4118-8e8b-9cffd4c2b6de)

Figure 1: Use Case Diagram  
This diagram shows the flow of the game and how 3 players interact with it. For clarity, Child 1's interactions with the system are that of a drawer and Child 2 and 3's interactions are that of guessers, when in practice they will all take turns being the drawer.

## Use Cases

### 1. Non-Playing User Hosts a Game Lobby
- User navigates to the [Scribblers!](https://scribblersgame.fly.dev/) website
- User clicks on the *"Create Lobby"* button
- User specifies the *"Max Players"* (2-8)
- User specifies the *"Number of Rounds"* (1-10)
- User clicks on *"Launch Room"* button to start a game lobby

### 2. Playing User Hosts a Game Lobby
- User navigates to the [Scribblers!](https://scribblersgame.fly.dev/) website
- User clicks on the *"Create Lobby"* button
- User specifies the *"Max Players"* (2-8)
- User specifies the *"Number of Rounds"* (1-10)
- User clicks on *"I'm playing too"* button
- User selects their avatar
- User clicks on *"Launch Room"* button to start a game lobby

### 3. Hosting User Shares Game Lobby Code
- User follows the steps to host a game lobby
- User is presented with a randomly generated "shape-based" room code
- User shares the code with other users who want to join the game lobby

### 4. User Joins an Exisiting Game Lobby
- User navigates to the [Scribblers!](https://scribblersgame.fly.dev/) website
- User clicks on *"Join Lobby"*
- User enters the room code from a user who is hosting a game lobby
- User selects an avatar
- User clicks the *"Join Lobby"* button

### 5. User Attempts to Join a Non-Existing Lobby
- User navigates to the [Scribblers!](https://scribblersgame.fly.dev/) website
- User clicks on *"Join Lobby"*
- User enters a random room code
- User selects an avatar
- User clicks the *"Join Lobby"* button
- User is presented with an error

### 6. Hosting User Starts a Game
- User follows the steps to host a game lobby
- User follows the steps to share a game lobby code
- User waits until the lobby is filled with other users
- User presses the *"Start Game"* button

## 7. User is Presented with a Drawing Prompt
- Host starts the game
- User is selected to draw
- User is presented with a word to draw above the broadcasted canvas
- User is presented with an image associated with the prompt word

### 8. User is Assigned to Draw on the Broadcasted Drawing Board
- User is selcted to draw
- User's avatar is given "Drawer" status and a pencil icon in the message board
- User is given access to a set of drawing tools
- User holds and drags their finger or mouse over the canvas area

### 9. Drawer Undoes a Drawing Stroke
- User is selcted to draw
- User holds and drags their finger or mouse over the canvas area
- User clicks the *"Undo"* button
- The last stroke the user made is undone and broadcasted to all users

### 10. Drawer Clears the Drawing Board
- User is selcted to draw
- User holds and drags their finger or mouse over the canvas area
- User clicks the *"Clear"* button
- The entire drawing board is cleared for all users

### 11. Drawer Changes Stroke Color
- User is selcted to draw
- User clicks on any of the colors presented
- User holds and drags their finger or mouse over the canvas area
- The stroke color should display the color chosen by the user

### 12. Drawer Changes Stroke Width
- User is selcted to draw
- User slides the stroke width slider either left or right
- User holds and drags their finger or mouse over the canvas area
- The stroke color should display the stroke width chosen by the user

### 13. User is Assigned the Role of Guesser
- User is assigned to guess the prompt being drawn
- User is given access to an AAC board with pre-provided prompt guesses
- User is shown a drawing board that broadcasts the drawing data of the drawer

### 14. Guesser Selects an Incorrect Guess
- User clicks/taps an incorrect guess on the AAC board
- User guess is displayed in the messsage board
- The AAC board times out for 5 seconds and does not allow user input

### 15. Guesser Selects a Correct Guess
- User clicks/taps a correct guess on the AAC board
- User guess is not displayed to the message board
- A "Correct" message is displayed next to the guesser's avatar
- A checkmark image is displayed next to the "Correct" message
- The user's score is calculated based on when they guesses correctly
- The AAC guess board is taken away from the guesser's display

### 16. All Guessers Guess Correctly
- Each user assigned as a guesser selects the correct guess
- Correct guesses are selected before the round timer runs out
- A popup is displayed indicating everyone guessed correctly
- The round ends
- Roles are changed
- A new round starts

### 17. Round Timer Ends Before All Guessers Guess Correctly
- Round timer gets to zero
- A popup is displayed indicating that time has run out
- The round ends
- Roles are changed
- A new round starts

### 18. Game Ends (Regular Player)
- The number of rounds in the game reaches the maximum set by the host
- All users are displayed an end game screen with a leaderboard and a *"Leave Lobby"* button

### 19. Game Ends (Host)
- The number of rounds in the game reaches the maximum set by the host
- All users are displayed an end game screen with a leaderboard and a *"Leave Lobby"* button
- The host is displayed a *"Play again"* button

### 20. Users Chooses to Play Again After Game Ends
- Users play a game
- Users reach the end game screen
- Host clicks the *"Play Again"* button
- All users are thrown back into the game lobby
- Host clicks the *"Start Game"* button
