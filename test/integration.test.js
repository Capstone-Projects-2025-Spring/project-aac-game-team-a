// Imports the Socket.IO client library to create a WebSocket client for testing
import io from "socket.io-client"; // Need to declare the path to the Socket.io library when implemented
// Imports the actual Node.js server from the project
import { server } from "server"; // Import our server by replacing "server" with our server's actual path
import { createServer } from "http";
import { Server } from "socket.io";
import { mount } from "vue/test-utils"; // Need to rename path to actual file
import GameBoard from "GameBoard.vue"; // Need to rename path to actual file

// Describing the "test suite" i.e. all tests in this section for backend Socket.IO Integration
describe("Scribblers Socket.IO Integration Tests", () => {
    // declare socketClients(1 and 2) to store WebSocket connection
    // declare the Socket.IO and HTTP servers
    let socketClient1, socketClient2, ioServer, httpServer; 

    // beforeAll() is used to ensure that this is the first action done before proceeding with tests
    //      Purpose: need to setup socket to test socket back and forth communciation
    //      Method listens for "done" signal
    beforeAll(done => {
        // create HTTP server
        httpServer = createServer();
        // use HTTP server to create Socket.io server
        ioServer = new Server(httpServer);

        // Start a listener 
        httpServer.listen(() => {
            // grab a random port from the HTTP instance
            const { port } = httpServer.address();

            // connect two players to `http://localhost` at random port
            socketClient1 = io(`http://localhost:${port}`);
            socketClient2 = io(`http://localhost:${port}`);

            // once both players are connected, signal the action is "done"
            Promise.all([
                new Promise(resolve => socketClient1.on("connect", resolve)),
                new Promise(resolve => socketClient2.on("connect", resolve))
            ]).then(done);
        });
    });

    // afterAll() ensures this action is done after all others
    //      Purpose: can't diconnect client sockets and server instances if all tests are not done running
    afterAll(() => 
        socketClient1.disconnect(),
        socketClient2.disconnect(),
        ioServer.close(),
        httpServer.close()
    );

    // Testing a player can join a game
    test("Player joins a room", done => {
        // declare object "playerData"
        const playerData = { username: "P1:", userAvatar: "Lion", room: "room1" };

        // the client socket emits a "joinRoom" message
        //      this simulates a player attempting to join a room with the "playerData"
        socketClient1.emit("joinRoom", playerData);

        // expect the following when the server emits a "roomJoined" event
        socketClient1.on("roomJoined", ({ room, players, avatar }) => {
            // expect the room to be the one declared in playerData
            expect(room).toBe(playerData.room);
            // expect the players avatar to be the one declared in playerData
            expect(avatar).toBe(playerData.userAvatar);
            // expect the current players connected to include the username declared 
            expect(players).toContain(playerData.username);
            // this test is done
            done();
        });
    });

    // Testing a player can leave the room
    test("Player leaves a room", done => {
        // declare object "playerData"
        const playerData = { username: "P1:", userAvatar: "Lion", room: "room1" };

        // once a player emits "joinRoom", they emit "leaveRoom"
        //      this simulates the player joining then leaving
        socketClient1.emit("joinRoom", playerData);
        socketClient1.emit("leaveRoom", playerData);

        // expect the players in the session to not contain the username for socketClient1
        socketClient1.on("roomLeft", ({ players }) => {
            expect(players).not.toContain(playerData.username);
            // test is finished
            done();
        });
    });

    // Test to ensure that data sent by one player reaches all players
    test("Broadcasts a message to all players", done => {
        // object with message for other users
        const messageData = { message: "Me Scribble, you Scribble" };

        // client1 emits the messages
        socketClient1.emit("sendMessage", messageData);

        // client2 receives the message
        socketClient2.on("messageReceived", ({ message }) => {
            // the message client2 receieves should match the one the client1 sent
            expect(message).toBe(messageData.message);
            // test is finished
            done();
        });
    });
    
    // Testing the room starts when the users join the game
    test("Game starts when enough players join", done => {
        // room object with a max of 2 players
        const room1 = {maxPlayers: 2, roomID: "room1", rounds: 1}

        // two player objects
        const player1 = { username: "Player1", room: room1.roomID };
        const player2 = { username: "Player2", room: room1.roomID };

        // have both users join
        socketClient1.emit("joinRoom", player1);
        socketClient2.emit("joinRoom", player2);
        
        // once the game has started, expect the following
        socketClient1.on("gameStarted", ({ room }) => {
            // expect the room ID to match player 1's room
            expect(room.roomID).toBe(player1.room);
            // expect the room ID to match player 2's room
            expect(room.roomID).toBe(player2.room);
            done();
        });
    });
    
    // Testing that the server returns an error message when invalid events are made by user
    test("Handles invalid events", done => {
        // emit some invalid event form the client
        socketClient1.emit("invalidEvent");

        // when the client receives the error message, it should be an invalid event
        socketClient1.on("error", ({ message }) => {
            expect(message).toBe("Invalid event");
            done();
        });
    });
});


// mock a socket.io client connection
jest.mock("socket.io-client");

// Describing the "test suite" i.e. all tests in this section for frontend Vue.js GameBoard Integration
describe("GameBoard", () => {

    // socket variable to store the mocked instance
    let socket;

    // setup socket
    beforeEach(() => {
        // mock socket.on() to recieve server messages and socket.emit() to send server messages
        socket = { on: jest.fn(), emit: jest.fn() };
        // ensure that a mocked version of socket.io is used instead of the real thing
        io.mockReturnValue(socket);
    });

    // Test that the gameboard is being rendered 
    test("Renders game board correctly", () => {
        // render GameBoard componenet
        const wrapper = mount(GameBoard);
        // Finds and checks to see if the element ".game-board" exists
        expect(wrapper.find(".game-board").exists()).toBe(true);
    });

    // Tests if drawings can be emited to the server
    test("emits drawing event to the server", async () => {
        // render GameBoard componenet
        const wrapper = mount(GameBoard);
        // emit a drawing with the coordinates shown
        await wrapper.vm.$emit("draw", { x: 10, y: 20 });

        // ensure that the message emitted was a "drawing" message with the coordinates shown
        expect(socket.emit).toHaveBeenCalledWith("drawing", { x: 10, y: 20 });
    });

    // Testing for message emitting from a guess
    test("emits guess event when user submits a guess", async () => {
         // render GameBoard componenet
        const wrapper = mount(GameBoard);
      
        // simulate user input
        const input = wrapper.find("input[type='text']");
        await input.setValue("Apple");
      
        // simulate form submission
        await wrapper.find("form").trigger("submit.prevent");
      
        // ensure socket emits the "guess" event with the correct data
        expect(socket.emit).toHaveBeenCalledWith("guess", { message: "Apple" });
      });
});
