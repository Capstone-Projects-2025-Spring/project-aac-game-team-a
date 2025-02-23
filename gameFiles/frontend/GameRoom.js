/**
 * This class represents frontend data associated with the game lobby and session
 */
class GameRoom{
    /**
     * Creates an instance of a GameRoom to be used by players
     * 
     * @param {Player} host the player that is designated as the host
     * @param {Player[]} playerList list of players that have joined the lobby 
     * @param {number} lobbyID the id that identifies the lobby
     * @param {number} maxPlayers the maxiumum number of players that can join
     * @param {number} numPlayers the number of players that have joined the lobby
     */

    
    constructor(host, maxPlayers) {
        /** 
         * @type {Player} 
         * @private 
         */
        this._host = host;
        
        /** 
         * @type {Player[]} 
         * @private 
         */
        this._playerList = [];

        /** 
         * @type {number} 
         * @private 
         */
        this._lobbyID = Math.floor(Math.random() * 10000); // Generate a random lobby ID
        
        /** 
         * @type {number} 
         * @private 
         */
        this._maxPlayers = maxPlayers;
        
        /** 
         * @type {number} 
         * @private 
         */
        this._numPlayers = 1; // Starts with the host
    }

    /** @returns {Player} The host of the game room. */
    get host() {
        return this._host;
    }

    /** @param {Player} newHost - The new host of the game room. */
    set host(newHost) {
        this._host = newHost;
    }

    /** @returns {Player[]} The list of players in the game room. */
    get playerList() {
        return this._playerList;
    }

    /** 
     * @param {Player[]} newPlayerList - The updated list of players.
     */
    set playerList(newPlayerList) {
        this._playerList = newPlayerList;
        this._numPlayers = newPlayerList.length + 1; // Update numPlayers (including host)
    }

    /** @returns {number} The unique lobby ID. */
    get lobbyID() {
        return this._lobbyID;
    }

    /** @param {number} newLobbyID - The new lobby ID. */
    set lobbyID(newLobbyID) {
        this._lobbyID = newLobbyID;
    }

    /** @returns {number} The maximum number of players allowed. */
    get maxPlayers() {
        return this._maxPlayers;
    }

    /** @param {number} newMaxPlayers - The new maximum player limit. */
    set maxPlayers(newMaxPlayers) {
        this._maxPlayers = newMaxPlayers;
    }

    /** @returns {number} The current number of players in the room. */
    get numPlayers() {
        return this._numPlayers;
    }

    /** @param {number} newNumPlayers - The updated player count. */
    set numPlayers(newNumPlayers) {
        this._numPlayers = newNumPlayers;
    }
}