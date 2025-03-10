# Backend Class Documentation

Documentation for the Scribblers backend classes.

## Controller Classes

### LobbyController Class
The purpose of this class is to handle lobby-related HTTP requests.

- **createLobby() method**: Creates a new game lobby.
  - **Pre-condition**: POST /api/lobby/
  - **Parameters**: Request $request
  - **Returns**: JSON response with lobby details and HTTP status code

- **joinLobby() method**: Allows a player to join an existing lobby.
  - **Pre-condition**: POST /api/lobby/join
  - **Parameters**: Request $request (including lobby ID and player info)
  - **Returns**: JSON response with lobby details and HTTP status code

- **getLobbyInfo() method**: Retrieves the current state of a lobby.
  - **Pre-condition**: GET /api/lobby/lobbyid
  - **Parameters**: int $lobbyId
  - **Returns**: JSON response with lobby state and HTTP status code

- **startGame() method**: Begins the game once enough players have joined.
  - **Pre-condition**: POST /api/lobby/lobbyid/start
  - **Parameters**: int $lobbyId
  - **Returns**: JSON response with game state and HTTP status code

### DrawingController Class
The DrawingController class manages all drawing-related operations.

- **submitDrawing() method**: Handles the submission of a drawing.
  - **Pre-condition**: POST /api/drawing/submit
  - **Parameters**: Request $request (including image data and player ID)
  - **Returns**: JSON response with HTTP status code

- **getCurrentDrawing() method**: Retrieves the current drawing in progress.
  - **Pre-condition**: GET /api/drawing/lobbyid
  - **Parameters**: int $lobbyId
  - **Returns**: JSON response with drawing data and HTTP status code

### GuessController Class
The GuessController class handles user guesses for the drawing.

- **submitGuess() method**: Submits a guess for the current drawing.
  - **Pre-condition**: POST /api/guess/
  - **Parameters**: Request $request (including guess text and player ID)
  - **Returns**: JSON response with correctness status and HTTP status code

- **getGuesses() method**: Retrieves all guesses for the current round.
  - **Pre-condition**: GET /api/guess/lobbyid
  - **Parameters**: int $lobbyId
  - **Returns**: JSON response with list of guesses and HTTP status code

### ScoreController Class
Manages scoring and ranking in the game.

- **calculateScores() method**: Computes and updates scores at the end of a round.
  - **Pre-condition**: POST /api/score/calculate
  - **Parameters**: int $lobbyId
  - **Returns**: JSON response with updated scores and HTTP status code

- **getLeaderboard() method**: Retrieves the leaderboard for a lobby.
  - **Pre-condition**: GET /api/score/leaderboard/lobbyid
  - **Parameters**: int $lobbyId
  - **Returns**: JSON response with ranking data and HTTP status code

## Model Classes

### Lobby
Represents a game lobby with relevant details.

- **Fields**:
  - lobby_id: string
  - players: array
  - game_status: string (waiting, active, completed)

### Drawing
Represents a submitted drawing.

- **Fields**:
  - drawing_id: string
  - lobby_id: string
  - player_id: string
  - image_data: binary
  - created_at: timestamp

### Guess
Represents a player’s guess.

- **Fields**:
  - guess_id: string
  - lobby_id: string
  - player_id: string
  - text: string
  - is_correct: boolean
  - created_at: timestamp

### Score
Represents a player's score.

- **Fields**:
  - player_id: string
  - lobby_id: string
  - score: int
  - updated_at: timestamp

## WebSocket Events

### Game Events

- **playerJoined**: Triggered when a player joins a lobby.
  - **Payload**: player_id, lobby_id

- **drawingSubmitted**: Triggered when a player submits a drawing.
  - **Payload**: drawing_id, lobby_id

- **guessMade**: Triggered when a player submits a guess.
  - **Payload**: guess_id, lobby_id, is_correct

- **roundEnded**: Triggered at the end of a round.
  - **Payload**: lobby_id, scores

- **gameStarted**: Triggered when the game starts.
  - **Payload**: lobby_id, players

## Migrations

### create_lobbies_table
Creates the lobbies table in the database.

- **run() method**: Defines schema for storing lobby data.

### create_drawings_table
Creates the drawings table in the database.

- **run() method**: Defines schema for storing drawing data.

### create_guesses_table
Creates the guesses table in the database.

- **run() method**: Defines schema for storing guesses.

### create_scores_table
Creates the scores table in the database.

- **run() method**: Defines schema for storing player scores.

---
This documentation provides an overview of the backend structure for Scribblers, covering controllers, models, WebSocket events, factories, and database migrations.

