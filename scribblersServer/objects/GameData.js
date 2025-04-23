/**
 * This class manages the game session and rounds on the server
 */
//  GAME SETTINGS
const roundTimerLength = 60; //set length of round timer
let imagesPerPrompt = 3; // represents the amount of images to choose from per prompt

// Drawing prompt objects categorized by type
const promptList = [
    {word: 'Eat', type: 'Actions'},
    {word: 'Jump', type: 'Actions'},
    {word: 'Run', type: 'Actions'},
    {word: 'Sleep', type: 'Actions'},

    {word: 'Bird', type: 'Animals'},
    {word: 'Cat', type: 'Animals'},
    {word: 'Dog', type: 'Animals'},
    {word: 'Elephant', type: 'Animals'},
    {word: 'Horse', type: 'Animals'},
    {word: 'Mouse', type: 'Animals'},

    {word: 'Glasses', type: 'Clothing'},
    {word: 'Glove', type: 'Clothing'},
    {word: 'Hat', type: 'Clothing'},
    {word: 'Pants', type: 'Clothing'},
    {word: 'Shirt', type: 'Clothing'},
    {word: 'Shoe', type: 'Clothing'},

    {word: 'Apple', type: 'Food'},
    {word: 'Banana', type: 'Food'},
    {word: 'Carrot', type: 'Food'},
    {word: 'Grapes', type: 'Food'},
    {word: 'Pizza', type: 'Food'},
    {word: 'Spaghetti', type: 'Food'}
]

class GameData{
    /**
     * Creates an instance of an GameSession to track data about the current game session
     * 
     * @param {number} numberRounds The number of rounds selected for the game
     * @param {number} currentRound The current round for the game
     * @param {number} maxPlayers The maximum number of players allowed to join the game
     * @param {string} players An array of avatars currently in game
     * @param {Map}    playerData Game data associate to individual players such as score and current guess
     * @param {object} prompt The prompt for drawers to draw and guessers to guess
     * @param {string} drawer The currently selected drawer
     * @param {number} timerID The ID related to the timer interval for the room
     * @param {number} timerValue The current value of the round timer
     */

    constructor( numberRounds, currentRound, maxPlayers, players, prompt, drawer, timerID, timerValue, playerData ){
        this.numberRounds = numberRounds;
        this.currentRound = currentRound;
        this.maxPlayers = maxPlayers;
        this.players = players;
        this.prompt = prompt;
        this.drawer = drawer;
        this.timerID = timerID;
        this.timerValue = timerValue;
        this.playerData = playerData;
    }

    /**
     * Start new round in specified room
     * @param {SocketServer} server Socket.io server instance
     * @param {number} room Socket.io room 
     */
    startNewRound(server, room, gameDataMap) {

        console.log(`Starting new round in room ${room}...`)
        this.clearGuesses(server, room);

        console.log(this.playerData);
        if (this.currentRound != 0)
            server.to(room).emit("cast-draw-clear");

        //  Increment round count and verify it is not end of round
        this.currentRound++
        server.to(room).emit('update-round', this.currentRound);
        if (this.currentRound > this.numberRounds) {
            this.currentRound = 0
            server.to(room).emit('end-game');
            return;
        }

        //  Select new drawer for room and update current drawer for all users in room
        let newDrawerSelected = false;
        while (!newDrawerSelected) {
            //  Randomly select player from players array
            let randomIndex = Math.floor(Math.random() * this.players.length);
            
            //  Verify new drawer is not the current drawer
            if (this.drawer == this.players[randomIndex])
                console.log(`${this.drawer} is already drawing, choosing new drawer`)
            else {
                //  Set as new drawer and update all users in room
                this.drawer = this.players[randomIndex];
                console.log(`${this.drawer} chosen as drawer`)
                server.to(room).emit('update-drawer', this.drawer);
                newDrawerSelected = true;
            }
        }
        
        //  Generate new prompt and update prompt for all users in room
        this.prompt = this.getPromptObject();
        server.to(room).emit('update-prompt', this.prompt, this.getPath(this.prompt));

        //  Start Round Timer
        gameDataMap.get(room).timerValue = roundTimerLength;
        this.timerID = setInterval(this.updateTimer, 1000, server, room, gameDataMap);
        console.log(this)
    }

    /**
     * Randomly selects a prompt from the prompt list
     * @returns the selected prompt
     */
    getPromptObject() {
        const randomIndex = Math.floor(Math.random() * promptList.length);
        return promptList[randomIndex];
    }

    /**
     * Form the file path for the prompt image
     * @param {object} promptObject 
     * @returns path to prompt image
     */
    getPath(promptObject){
        // Get random number to append for the image associated for the prompt 
        let randomImgNumber = Math.floor(Math.random() * imagesPerPrompt) + 1;

        // Ensure the image name is in all lowercase and append the number 
        // Images follow this format: "1image.png", "2image.png", ...
        let lowerCaseWord = randomImgNumber + promptObject.word.toLowerCase();

        // Assemble the path
        let path = 'promptImages/' + promptObject.type + '/' + promptObject.word + '/' + lowerCaseWord + '.png';

        return path;
    }

    /**
     * Clears all user guesses and updates each user in the room 
     */
    clearGuesses(server, room) {

        this.playerData.forEach((value, key) => {
            
            value.currentGuess = ''
            server.to(room).emit("update-user-guess", key, '')
        })
    }

    /**
     * Check all guesses, return true if all are correct, return false if there are no correct guesses
     * @returns true if all guesses are correct, false if any guesses are incorrect
     */
    allGuessesCorrect() {
        let output = true
        this.playerData.forEach((value, key) => {
            if (key != this.drawer && value.currentGuess != "Correct!")       
                output = false
        })
        return output
    }

    /**
     * Update timer value when called. 
     * @param {SocketServer} server Socket.io server instance
     * @param {number} room Socket.io room 
     */
    updateTimer(server, room, gameDataMap) {
        
        try {
            server.in(room).emit("timer-update", gameDataMap.get(room).timerValue);

            //  Clear interval if it is still running and all players have left
            if (!gameDataMap.get(room).playerData) {
                console.log("Timer cleared")
                clearInterval(gameDataMap.get(room).timerID)
                //mappedGameData.delete(room) 
            }
            
            //  Start new round once timer hits 0
            if (gameDataMap.get(room).timerValue == 0) {
                console.log("Timer cleared")
                clearInterval(gameDataMap.get(room).timerID);
                gameDataMap.get(room).startNewRound(server, room);
            }
            else
            gameDataMap.get(room).timerValue--;
        }
        catch{
            console.error(`Error during timer update in room ${room}`)
        }
    };
}



module.exports = GameData;
