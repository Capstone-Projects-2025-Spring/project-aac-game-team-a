/**
 * This class manages the game session and rounds on the server
 */
class GameSession{
    /**
     * Creates an instance of an GameSession to track data about the current game session
     * 
     * @param {string} sessionID The unique ID of the current game session
     * @param {Player[]} players The array of player objects linked to the game session
     * @param {number} roundsCompleted The counter of number of rounds completed in the current game session
     * @param {Player} winner The declared winner of the game session
     */
    constructor(sessionID, players, roundsCompleted, winner){
        this.sessionID = sessionID;
        this.players = players;
        this.roundsCompleted = roundsCompleted;
        this.winner = winner;
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
    startRound(){
        try {

        } catch (err){
            console.log("Could not start new round");
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
}
