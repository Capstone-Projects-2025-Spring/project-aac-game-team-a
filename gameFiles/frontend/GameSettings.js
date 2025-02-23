/**
 * Stores the configuration of the game
 */
class GameSettings{
    /**
     * Creates an instance of settings to be used in a game
     * 
     * @param {number} roundTime The amount of time per round in a game
     * @param {number} maxPlayers The maximum amount of players in a game
     * @param {boolean} AACEnabled Determines whether ACC functions are enabled or disabled
     */
    constructor(roundTime, maxPlayers, AACEnabled){
        this.roundTime = roundTime;
        this.maxPlayers = maxPlayers;
        this.AACEnabled = AACEnabled;
    }
}