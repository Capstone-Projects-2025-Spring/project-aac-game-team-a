---
sidebar_position: 2
---

# Scribblers Integration Tests

## Overview
This document describes the integration tests for the Scribblers game, ensuring that essential gameplay mechanics function correctly. Each test includes a brief description and the corresponding test code.

---

## 1. Host Creates a Lobby and Receives a Room Code
### Description
This test checks whether the host can create a game lobby and receive a valid room code from the server.

```javascript
test('Host creates a lobby and receives a room code', async () => {
    const wrapper = mount(LandingPage);
    await wrapper.find('button#host-game').trigger('click');
    
    socket.on('roomCreated', (roomCode) => {
        expect(roomCode).toMatch(/[A-Z0-9]{6}/);
    });
});
```

---

## 2. Players Enter Room Code and Join Lobby
### Description
Ensures that players can enter a valid room code and successfully join the lobby.

```javascript
test('Players enter room code and join lobby', async () => {
    const wrapper = mount(LandingPage);
    
    await wrapper.find('input#room-code').setValue('ABC123');
    await wrapper.find('button#join-game').trigger('click');
    
    socket.on('roomJoined', (success) => {
        expect(success).toBe(true);
    });
});
```

---

## 3. Players Select an Avatar
### Description
Tests whether players can select an avatar before joining the game.

```javascript
test('Players select an avatar', async () => {
    const wrapper = mount(LandingPage);
    
    socket.emit('avatarChoices', ['Avatar1', 'Avatar2', 'Avatar3']);
    await wrapper.find('button#select-avatar-0').trigger('click');
    
    socket.on('avatarSelected', (selectedAvatar) => {
        expect(['Avatar1', 'Avatar2', 'Avatar3']).toContain(selectedAvatar);
    });
});
```

---

## 4. Host Starts the Game and Players Navigate to Their Roles
### Description
Validates that the host can start the game and players receive their roles (drawer or guesser).

```javascript
test('Host starts the game and players navigate to drawing/guessing pages', async () => {
    const wrapper = mount(LobbyPage);
    await wrapper.find('button#start-game').trigger('click');
    
    socket.on('gameStarted', (role) => {
        expect(['drawer', 'guesser']).toContain(role);
    });
});
```

---

## 5. Phase Ends Correctly
### Description
Ensures that the game phase ends when the timer expires or when all players guess correctly.

```javascript
test('Phase ends when timer expires or all guesses are correct', async () => {
    const wrapper = mount(GuessingPage);
    
    socket.emit('phaseEnd', { reason: 'timerExpired' });
    await new Promise(resolve => setTimeout(resolve, 500));
    expect(wrapper.text()).toContain('Round Over');
});
```

---

## 6. Drawer Selects a Prompt and Starts Drawing
### Description
Tests whether the drawer can select a prompt and begin drawing.

```javascript
test('Drawer selects a prompt and starts drawing', async () => {
    const wrapper = mount(DrawingPage);
    
    socket.emit('promptChoices', ['Cat', 'Tree', 'Car']);
    await wrapper.find('button#select-prompt-0').trigger('click');
    
    socket.on('promptSelected', (selectedPrompt) => {
        expect(['Cat', 'Tree', 'Car']).toContain(selectedPrompt);
    });
});
```

---

## 7. Guessers See Drawing Progress and Submit Guesses
### Description
Ensures that guessers can see the drawing progress and submit guesses.

```javascript
test('Guessers see drawing progress and can submit guesses', async () => {
    const wrapper = mount(GuessingPage);
    
    socket.emit('drawingData', { lines: [{ x: 10, y: 20 }] });
    await wrapper.find('input#guess-input').setValue('Cat');
    await wrapper.find('button#submit-guess').trigger('click');
    
    socket.on('guessResponse', (correct) => {
        expect(typeof correct).toBe('boolean');
    });
});
```

---

## 8. Players Are Awarded Points Correctly
### Description
Validates that players who guess correctly and the drawer are awarded the correct points.

```javascript
test('Players are awarded points correctly', async () => {
    socket.emit('correctGuess', { player: 'Alice', points: 10 });
    
    socket.on('updateScore', ({ player, points }) => {
        expect(player).toBe('Alice');
        expect(points).toBe(10);
    });
});
```

---

## 9. Game Ends and Users See the Summary Screen
### Description
Checks that when the game ends, players see the summary screen with final rankings.

```javascript
test('Game ends and users see the summary screen', async () => {
    const wrapper = mount(SummaryPage);
    
    socket.emit('gameOver', { rankings: [{ player: 'Alice', score: 10 }] });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    expect(wrapper.text()).toContain('Alice');
});
```


