# Frontend Class Documentation

**Frontend-Backend Integration**
The frontend and backend communicate through API endpoints.

### JSON Overview

The following section provides an overview of JSON fields.

#### **User JSON**

```json
{
  "data": {
    "id": "string", // Unique identifier
    "created_at": "string", // Read-only, creation timestamp
    "updated_at": "string" // Read-only, last update timestamp
  }
}
```

#### **Game JSON**

```json
{
  "data": {
    "id": "string", // Unique game identifier
    "room_code": "string", // Unique game room code
    "current_round": "int", // Current round number
    "max_rounds": "int", // Total number of rounds
    "players": [
      {
        "id": "string", // Player identifier
        "score": "int" // Player score
      }
    ],
    "created_at": "string",
    "updated_at": "string"
  }
}
```

#### **Drawing JSON**

```json
{
  "data": {
    "game_id": "string", // Associated game ID
    "player_id": "string", // Player who drew
    "canvas_data": "string", // Encoded drawing data
    "created_at": "string",
    "updated_at": "string"
  }
}
```
