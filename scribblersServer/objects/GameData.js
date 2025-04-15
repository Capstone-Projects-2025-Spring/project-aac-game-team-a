/**
 * This class manages the game session and rounds on the server
 */
class GameData{
    /**
     * Creates an instance of an GameSession to track data about the current game session
     * 
     * @param {number} numberRounds The number of rounds selected for the game
     * @param {number} currentRound The current round for the game
     * @param {number} maxPlayers The maximum number of players allowed to join the game
     * @param {string} players An array of avatars currently in game
     * @param {object} prompt The prompt for drawers to draw and guessers to guess
     * @param {string} drawer The currently selected drawer
     * @param {number} timerID The ID related to the timer interval for the room
     * @param {number} timerValue The current value of the round timer
     * @param {Map}    scores The scores of each player, each key is a playerID and value is score
     */

    constructor( numberRounds, currentRound, maxPlayers, players, prompt, drawer, timerID, timerValue, scores ){
        this.numberRounds = numberRounds;
        this.currentRound = currentRound;
        this.maxPlayers = maxPlayers;
        this.players = players;
        this.prompt = prompt;
        this.drawer = drawer;
        this.timerID = timerID;
        this.timerValue = timerValue;
        this.scores = scores;
    }

    /**
     * Starts a new game session
     * 
     * @throws An error if it cannot start a new game session
     */
    startSession(){
        try {

        } catch (err){
            console.log("Could not start new game session");
        }
    }

    /**
     * Ends an existing game session
     * 
     * @throws An error if it cannot end an existing game session
     */
    endSession(){
        try {

        } catch (err){
            console.log("Could not end game session");
        }
    }

    /**
     * Starts a new round in an existing game session
     * 
     * @throws An error if it cannot start a new round in an existing game session
     */
    startRound(newPrompt, drawer){
        try {
            this.prompt = newPrompt
            this.drawer = drawer
            this.numberRounds--

            if(this.roundsCompleted == 0){
                console.log("Game over.")
                return false
            }

            console.log("start of a new round")
            return true
        } catch (err){
            console.log("Could not start new round");
            console.error(err)
        }
    }

    /**
     * Ends a round in an existing game session
     * 
     * @throws An error if it cannot end a round in an existing game session
     */
    endRound(){
        try {

        } catch (err){
            console.log("Could not end round");
        }
    }

    // returns the json data
    toJson(){
        return {
            "numberRounds": this.numberRounds,
            "winner": this.winner,
            "prompt": this.prompt,
            "drawer": this.drawer
        }
    }

    // returns a string of all of the values
    toString(){
        return "number of Rounds: " + this.numberRounds + this.maxPlayers + this.players + this.prompt + this.drawer + this.timerID + this.timerValue + this.scores
    }
}

module.exports = GameData;
