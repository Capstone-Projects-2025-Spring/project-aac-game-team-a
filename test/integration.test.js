// !!!DISCLAIMER!!!: The paths to the following imports need to be redone as the project goes on
import { io } from 'socket.io-client'; // Importing the Socket.io client library
import { mount } from '@vue/test-utils'; // Importing Vue test utilities
import LandingPage from 'LandingPage'; // Importing the LandingPage component
import LobbyPage from 'LobbyPage'; // Importing the LobbyPage component
import DrawingPage from 'DrawingPage'; // Importing the DrawingPage component
import GuessingPage from 'GuessingPage'; // Importing the GuessingPage component
import SummaryPage from 'SummaryPage'; // Importing the SummaryPage component

// "describe" the test suite
describe('Scribblers Integration Tests', () => {
    let socket;

    // "beforeEach()" = perform this action before all tests
    beforeEach(() => {
        socket = io('http://localhost:3000'); // Establishing a connection to the backend server
    });

    // "afterEach()" = perform this action after all tests
    afterEach(() => {
        socket.disconnect(); // Disconnecting the socket after each test
    });

    // test that the host can create a lobby and receive a code  
    test('Host creates a lobby and receives a room code', async () => {
        const wrapper = mount(LandingPage); // Mount the LandingPage component

        await wrapper.find('button#host-game').trigger('click'); // Simulate clicking the "Host Game" button
        
        socket.on('roomCreated', (roomCode) => { // Listen for the roomCreated event
            expect(roomCode).toMatch(/[A-Z0-9]{6}/); // Check that the room code matches the expected format (format may be changed)
        });
    });

    // test that other players can join a room with the code given
    test('Players enter room code and join lobby', async () => {
        const wrapper = mount(LandingPage); // Mount the LandingPage component
        
        await wrapper.find('input#room-code').setValue('ABC123'); // Simulate entering a room code
        await wrapper.find('button#join-game').trigger('click'); // Simulate clicking the "Join Game" button
        
        socket.on('roomJoined', (success) => { // Listen for the roomJoined event
            expect(success).toBe(true); // Ensure the backend confirms successful room entry
        });
    });

    // testing to see if users can select an avatar
    test('Players select an avatar', async () => {
        const wrapper = mount(LandingPage); // Mount the LandingPage component
        
        socket.emit('avatarChoices', ['Avatar1', 'Avatar2', 'Avatar3']); // Simulate receiving available avatars
        await wrapper.find('button#select-avatar-0').trigger('click'); // Simulate selecting an avatar
        
        socket.on('avatarSelected', (selectedAvatar) => { // Listen for the avatarSelected event
            expect(['Avatar1', 'Avatar2', 'Avatar3']).toContain(selectedAvatar); // Ensure selected avatar is valid
        });
    });

    // Testing to see that users are given the correct roles when a game starts
    test('Host starts the game and players navigate to drawing/guessing pages', async () => {
        const wrapper = mount(LobbyPage); // Mount the LobbyPage component
        
        await wrapper.find('button#start-game').trigger('click'); // Simulate clicking the "Start Game" button
        
        socket.on('gameStarted', (role) => { // Listen for the gameStarted event
            expect(['drawer', 'guesser']).toContain(role); // Ensure players receive a valid role
        });
    });

    // Testing to ensure phases end correctly
    test('Phase ends when timer expires or all guesses are correct', async () => {
        const wrapper = mount(GuessingPage); // Mount the GuessingPage component

        socket.emit('phaseEnd', { reason: 'timerExpired' }); // Simulate phase ending due to timer expiration
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for UI update
        expect(wrapper.text()).toContain('Round Over'); // Ensure phase end message is displayed
    });

    // Testing to ensure the prompt selection is working
    test('Drawer selects a prompt and starts drawing', async () => {
        const wrapper = mount(DrawingPage); // Mount the DrawingPage component
        
        socket.emit('promptChoices', ['Cat', 'Tree', 'Car']); // Simulate receiving three prompt choices
        await wrapper.find('button#select-prompt-0').trigger('click'); // Simulate selecting the first prompt
        
        socket.on('promptSelected', (selectedPrompt) => { // Listen for the promptSelected event
            expect(['Cat', 'Tree', 'Car']).toContain(selectedPrompt); // Ensure selected prompt is valid
        });
    });

    // Testing to see if drawing progress and guesses work 
    test('Guessers see drawing progress and can submit guesses', async () => {
        const wrapper = mount(GuessingPage); // Mount the GuessingPage component
        
        socket.emit('drawingData', { lines: [{ x: 10, y: 20 }] }); // Simulate receiving drawing data
        await wrapper.find('input#guess-input').setValue('Cat'); // Simulate entering a guess
        await wrapper.find('button#submit-guess').trigger('click'); // Simulate submitting a guess
        
        socket.on('guessResponse', (correct) => { // Listen for the guessResponse event
            expect(typeof correct).toBe('boolean'); // Ensure response is a boolean (correct or incorrect guess)
        });
    });

    // Testing that players are correctly awarded points
    test('Players are awarded points correctly', async () => {
        socket.emit('correctGuess', { player: 'Alice', points: 10 }); // Simulate correct guess event
        
        socket.on('updateScore', ({ player, points }) => { // Listen for score update
            expect(player).toBe('Alice'); // Ensure correct player received points
            expect(points).toBe(10); // Ensure correct point value was awarded
        });
    });

    // Testing to make sure that the summary screen shows the proper data
    test('Game ends and users see the summary screen', async () => {
        const wrapper = mount(SummaryPage); // Mount the SummaryPage component
        
        socket.emit('gameOver', { rankings: [{ player: 'Alice', score: 10 }] }); // Simulate game over event
        
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for UI update
        
        expect(wrapper.text()).toContain('Alice'); // Ensure the summary screen displays the player's name
    });
});

