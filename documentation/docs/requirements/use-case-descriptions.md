---
sidebar_position: 5
---

# Use-case descriptions

## Use Case Diagram
![AAC_use_case_diagram](https://github.com/user-attachments/assets/be1ec26e-8bf2-4118-8e8b-9cffd4c2b6de)

Figure 1: Use Case Diagram  
This diagram shows the flow of the game and how 3 players interact with it. For clarity, Child 1's interactions with the system are that of a drawer and Child 2 and 3's interactions are that of guessers, when in practice they will all take turns being the drawer.

## Use Cases

### Use Case 1: Non-Playing User Hosts a Game Lobby

<img width="540" alt="Screenshot 2025-04-27 at 12 11 53 PM" src="https://github.com/user-attachments/assets/05225396-ebf1-479e-8af8-34cdc2e255e8" />

**Actor(s):** User

**Preconditions:** 
- User is on the [Scribblers!](https://scribblersgame.fly.dev/) website homepage.

**Flow of Events:**
1. User clicks the "Create Lobby" button.
2. User specifies the "Max Players" (2–8).
3. User specifies the "Number of Rounds" (1–10).
4. User clicks the "Launch Room" button.

**Postconditions:**
- A new game lobby is created without the host participating as a player.

---

### Use Case 2: Playing User Hosts a Game Lobby

<img width="727" alt="Screenshot 2025-04-27 at 12 22 54 PM" src="https://github.com/user-attachments/assets/de48274d-1182-440b-8d3b-74b42a14653f" />

**Actor(s):** User

**Preconditions:** 
- User is on the [Scribblers!](https://scribblersgame.fly.dev/) website homepage.

**Flow of Events:**
1. User clicks the "Create Lobby" button.
2. User specifies the "Max Players" (2–8).
3. User specifies the "Number of Rounds" (1–10).
4. User clicks the "I'm Playing Too" button.
5. User selects an avatar.
6. User clicks the "Launch Room" button.

**Postconditions:**
- A new game lobby is created with the host participating as a player.

---

### Use Case 3: Hosting User Shares Game Lobby Code

<img width="691" alt="Screenshot 2025-04-27 at 12 34 01 PM" src="https://github.com/user-attachments/assets/a21e8bd6-2bbd-43bf-9207-40e2aceed87f" />

**Actor(s):** Hosting user

**Preconditions:**
- A game lobby has been created.

**Flow of Events:**
1. A shape-based room code is generated automatically.
2. User views the room code on screen.
3. User shares the room code with other players.

**Postconditions:**
- Other players are able to join the lobby using the shared code.

---

### Use Case 4: User Joins an Existing Game Lobby

<img width="702" alt="Screenshot 2025-04-27 at 12 38 47 PM" src="https://github.com/user-attachments/assets/2f917009-e6ff-45c5-a6ca-74ee7f741a5f" />

**Actor(s):** User

**Preconditions:**
- User has received a valid room code.

**Flow of Events:**
1. User navigates to the [Scribblers!](https://scribblersgame.fly.dev/) website.
2. User clicks the "Join Lobby" button.
3. User enters the provided room code.
4. User selects an avatar.
5. User clicks the "Join Lobby" button.

**Postconditions:**
- User successfully joins the existing lobby.

---

### Use Case 5: User Attempts to Join a Non-Existing Lobby

<img width="875" alt="Screenshot 2025-04-27 at 12 40 16 PM" src="https://github.com/user-attachments/assets/b2b95c16-bd0c-4d9a-8bbe-92887a945453" />

**Actor(s):** User

**Preconditions:**
- User is on the [Scribblers!](https://scribblersgame.fly.dev/) website.

**Flow of Events:**
1. User clicks the "Join Lobby" button.
2. User enters a random or incorrect room code.
3. User selects an avatar.
4. User clicks the "Join Lobby" button.
5. An error message is displayed indicating the room does not exist.

**Postconditions:**
- User remains on the "Join Lobby" screen.

---

### Use Case 6: Hosting User Starts a Game

<img width="586" alt="Hosting User Starts a Game" src="https://github.com/user-attachments/assets/45f5914d-e7d1-4942-9aa5-893ba72296de" />

**Actor(s):** Hosting user

**Preconditions:**
- A lobby has been created and players have joined.

**Flow of Events:**
1. Host waits for players to join the lobby.
2. Host clicks the "Start Game" button once ready.

**Postconditions:**
- The game begins, and the first round starts.

---

### Use Case 7: User is Presented with a Drawing Prompt

<img width="437" alt="User is Presented with a Drawing Prompt" src="https://github.com/user-attachments/assets/301f9d53-49f2-4a81-be9e-8d648e4515d7" />

**Actor(s):** Drawing user

**Preconditions:**
- Game has started, and it is the user's turn to draw.

**Flow of Events:**
1. User is selected to draw.
2. User is shown a prompt word above the drawing board.
3. User is shown an image associated with the prompt word.

**Postconditions:**
- User prepares to draw the assigned prompt.

---

### Use Case 8: User is Assigned to Draw on the Drawing Board

<img width="532" alt="User is Assigned to Draw on the Drawing Board" src="https://github.com/user-attachments/assets/c691e585-08c7-4fd9-9e12-1b012972d5ce" />

**Actor(s):** Drawing user

**Preconditions:**
- User has been assigned the drawing role.

**Flow of Events:**
1. User's avatar displays a "Drawer" status and a pencil icon.
2. User gains access to drawing tools.
3. User draws by dragging finger or mouse across the canvas.

**Postconditions:**
- Drawing is broadcasted to all connected users.

---

### Use Case 9: Drawer Undoes a Drawing Stroke

<img width="608" alt="Drawer Undoes a Drawing Stroke" src="https://github.com/user-attachments/assets/edafe385-f5eb-4a58-baf4-028ce5b75892" />


**Actor(s):** Drawing user

**Preconditions:**
- User is actively drawing.

**Flow of Events:**
1. User clicks the "Undo" button.
2. The most recent stroke is undone on the canvas for all users.

**Postconditions:**
- Canvas updates reflect the undone stroke for all players.

---

### Use Case 10: Drawer Clears the Drawing Board

<img width="579" alt="Drawer Clears the Drawing Board" src="https://github.com/user-attachments/assets/39cfbd63-67ba-47e3-bd7c-eb40e9819e3e" />

**Actor(s):** Drawing user

**Preconditions:**
- User is actively drawing.

**Flow of Events:**
1. User clicks the "Clear" button.
2. Entire drawing board is cleared for all users.

**Postconditions:**
- Canvas is reset to blank for all players.

---

### Use Case 11: Drawer Changes Stroke Color

<img width="604" alt="Drawer Changes Stroke Color" src="https://github.com/user-attachments/assets/4709849d-35a1-475e-b466-182f487998d0" />

**Actor(s):** Drawing user

**Preconditions:**
- User is actively drawing.

**Flow of Events:**
1. User clicks a color option from the palette.
2. User continues drawing with the selected stroke color.

**Postconditions:**
- New stroke color is displayed on the canvas.

---

### Use Case 12: Drawer Changes Stroke Width

<img width="606" alt="Drawer Changes Stroke Width" src="https://github.com/user-attachments/assets/f20db187-241f-4a58-9a7e-76252fc2706f" />

**Actor(s):** Drawing user

**Preconditions:**
- User is actively drawing.

**Flow of Events:**
1. User adjusts the stroke width slider.
2. User continues drawing with the selected stroke width.

**Postconditions:**
- New stroke width is applied to the canvas.

---

### Use Case 13: User is Assigned the Role of Guesser

<img width="606" alt="User is Assigned the Role of Guesser" src="https://github.com/user-attachments/assets/cd1432d4-4514-4949-beec-a4f5e16e1951" />

**Actor(s):** Guessing user

**Preconditions:**
- A drawing round is in progress.

**Flow of Events:**
1. User is assigned as a guesser.
2. User is shown the drawing canvas and an AAC board of possible guesses.

**Postconditions:**
- User is able to select guesses based on the drawing.

---

### Use Case 14: Guesser Selects an Incorrect Guess

<img width="615" alt="Guesser Selects an Incorrect Guess" src="https://github.com/user-attachments/assets/688be5c1-5d79-4321-af3d-7a6d0df62e79" />

**Actor(s):** Guessing user

**Preconditions:**
- User is viewing the AAC board during a round.

**Flow of Events:**
1. User selects an incorrect guess from the AAC board.
2. Guess is displayed on the message board.
3. AAC board becomes temporarily disabled for 5 seconds.

**Postconditions:**
- User must wait before making another guess.

---

### Use Case 15: Guesser Selects a Correct Guess

<img width="606" alt="Guesser Selects a Correct Guess" src="https://github.com/user-attachments/assets/98e3d560-f643-4cbf-ac41-23fd6271987e" />

**Actor(s):** Guessing user

**Preconditions:**
- User is viewing the AAC board during a round.

**Flow of Events:**
1. User selects the correct guess.
2. "Correct" message is displayed next to the user's avatar.
3. A checkmark image is shown beside the message.
4. User’s score is calculated based on time remaining.
5. AAC board disappears from the user's screen.

**Postconditions:**
- User successfully guessed the drawing.

---

### Use Case 16: All Guessers Guess Correctly

<img width="626" alt="All Guessers Guess Correctly" src="https://github.com/user-attachments/assets/035c26fd-3824-49a7-a6af-f7d78e79e02f" />


**Actor(s):** All guessing users

**Preconditions:**
- A drawing round is in progress.

**Flow of Events:**
1. All guessers select the correct guess before the timer ends.
2. A popup appears indicating all users guessed correctly.
3. Round ends and new roles are assigned.
4. A new round begins.

**Postconditions:**
- Game progresses to the next round.

---

### Use Case 17: Round Timer Ends Before All Guessers Guess Correctly

<img width="773" alt="Round Timer Ends Before All Guessers Guess Correctly" src="https://github.com/user-attachments/assets/f696fdc2-e53a-4410-aa8a-bc3426c1b4f1" />

**Actor(s):** All players

**Preconditions:**
- A drawing round is in progress.

**Flow of Events:**
1. Round timer reaches zero.
2. A popup appears indicating time has run out.
3. Round ends and new roles are assigned.
4. A new round begins.

**Postconditions:**
- Game progresses to the next round without all correct guesses.

---

### Use Case 18: Game Ends (Regular Player)

<img width="626" alt="Game Ends (Regular Player)" src="https://github.com/user-attachments/assets/22b0f6f2-6582-4b71-8ec5-825558cd3aa3" />

**Actor(s):** All players (non-host)

**Preconditions:**
- The maximum number of rounds is reached.

**Flow of Events:**
1. Game session ends.
2. Endgame screen displays final leaderboard.
3. User clicks the "Leave Lobby" button.

**Postconditions:**
- User returns to the main website or lobby list.

---

### Use Case 19: Game Ends (Host)

<img width="517" alt="Game Ends (Host)" src="https://github.com/user-attachments/assets/7fe659fb-114b-4a3a-84ee-1c1de7a71413" />

**Actor(s):** Hosting user

**Preconditions:**
- The maximum number of rounds is reached.

**Flow of Events:**
1. Game session ends.
2. Endgame screen displays final leaderboard.
3. Host is presented with a "Play Again" button and "Leave Lobby" button.

**Postconditions:**
- Host can choose to start a new game or leave the lobby.

---

### Use Case 20: Users Choose to Play Again After Game Ends

<img width="639" alt="Users Choose to Play Again After Game Ends" src="https://github.com/user-attachments/assets/3a0aabe2-bee5-4278-b36e-ef19aca0b378" />

**Actor(s):** Hosting user and players

**Preconditions:**
- Game session has ended, and players are on the endgame screen.

**Flow of Events:**
1. Host clicks the "Play Again" button.
2. All users are returned to the lobby.
3. Host clicks the "Start Game" button to begin a new session.

**Postconditions:**
- A new game session starts with the same players.

---
