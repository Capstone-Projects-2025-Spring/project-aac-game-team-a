/**
 * This class manages the game session and rounds on the server
 */
//  GAME SETTINGS
const roundTimerLength = 60; //set length of round timer
let imagesPerPrompt = 3; // represents the amount of images to choose from per prompt
let usedPromptIds = []; // Store prompts already used

// Drawing prompt objects categorized by type
const promptList = [
    {id: 1, word: 'Eat', type: 'Actions'},
    {id: 2, word: 'Jump', type: 'Actions'},
    {id: 3, word: 'Run', type: 'Actions'},
    {id: 4, word: 'Sleep', type: 'Actions'},

    {id: 5, word: 'Bird', type: 'Animals'},
    {id: 6, word: 'Cat', type: 'Animals'},
    {id: 7, word: 'Dog', type: 'Animals'},
    {id: 8, word: 'Elephant', type: 'Animals'},
    {id: 9, word: 'Horse', type: 'Animals'},
    {id: 10, word: 'Mouse', type: 'Animals'},

    {id: 11, word: 'Glasses', type: 'Clothing'},
    {id: 12, word: 'Glove', type: 'Clothing'},
    {id: 13, word: 'Hat', type: 'Clothing'},
    {id: 14, word: 'Pants', type: 'Clothing'},
    {id: 15, word: 'Shirt', type: 'Clothing'},
    {id: 16, word: 'Shoe', type: 'Clothing'},

    {id: 17, word: 'Apple', type: 'Food'},
    {id: 18, word: 'Banana', type: 'Food'},
    {id: 19, word: 'Carrot', type: 'Food'},
    {id: 20, word: 'Grapes', type: 'Food'},
    {id: 21, word: 'Pizza', type: 'Food'},
    {id: 22, word: 'Spaghetti', type: 'Food'},

    {id: 23, word: 'Circle', type: 'Shapes'},
    {id: 24, word: 'Oval', type: 'Shapes'},
    {id: 25, word: 'Square', type: 'Shapes'},
    {id: 26, word: 'Triangle', type: 'Shapes'},
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
        // Get a random number based on the length of the promptList
        const randomIndex = Math.floor(Math.random() * promptList.length);
        // Use the random number as the index for the prompt
        let chosenPromptObj = promptList[randomIndex];
    
        // Look through the used prompt ids
        for (let index in usedPromptIds){
            // While current used is is equal to the id of the chosen prompt object,
            while (usedPromptIds[index] == chosenPromptObj.id){
                // Get a random number based on the length of the promptList
                const randomIndex = Math.floor(Math.random() * promptList.length);
                // Use the random number as the index for the prompt
                chosenPromptObj = promptList[randomIndex];
            }
        }
        // Push the id of the prompt into a used list
        usedPromptIds.push(chosenPromptObj.id)
        // Return the chosen prompt
        return chosenPromptObj;
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
