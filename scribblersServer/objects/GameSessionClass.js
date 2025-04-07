/**
 * This class manages the game session and rounds on the server
 */
class GameSession{
    /**
     * Creates an instance of an GameSession to track data about the current game session
     * 
     * @param {Number} sessionID The unique ID of the current game session
     * @param {Array} players The array of player objects linked to the game session
     * @param {number} numberRounds The amount of rounds for this game
     * @param {number} roundsCompleted The counter of number of rounds completed in the current game session
     * @param {string} winner The declared winner of the game session
     * @param {string} prompt The prompt that all non-drawers are guessing
     * @param {string} drawer This is the person doing the drawing
     * @param {Number} numberPlayers This is the amount of players in the game
     * @param {String} wordImg This is the path of the generated word's image
     */
    constructor(sessionID, players, numberRounds, roundsCompleted, winner, prompt, drawer, numberPlayers, wordImg
    ){
        this.sessionID = sessionID;
        this.players = players;
        this.numberRounds = numberRounds;
        this.roundsCompleted = roundsCompleted;
        this.winner = winner;
        this.prompt = prompt;
        this.drawer = drawer;
        this.numberPlayers = numberPlayers;
        this.wordImg = wordImg;
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
            this.roundsCompleted = this.roundsCompleted + 1

            if(this.roundsCompleted > this.numberRounds){
                console.log("End of a the game")
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
            "sessionID": this.sessionID,
            "players": this.players,
            "numberRounds": this.numberRounds,
            "winner": this.winner,
            "prompt": this.prompt,
            "drawer": this.drawer,
            "numberOfPlayers": this.numberPlayers,
            "wordImg": this.wordImg
        }
    }

    // returns a string of all of the values
    toString(){
        return "session: " + this.sessionID + " players: " + this.players + " number of Rounds: " + this.numberRounds + " number of rounds completed: " + this.roundsCompleted + " winner: " + this.winner + " number of players: " + this.numberPlayers + " path to image " + this.wordImg
    }
}

module.exports = GameSession;
