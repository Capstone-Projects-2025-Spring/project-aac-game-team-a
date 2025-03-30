class GameSessions{
    /**
     * Creates an instance that handles saving the data about each session
     * 
     */
    constructor(){
        // console.log("Game sessions that are being played")
        this.sessions = {}
    }

    saveSession(gameSessionData){
        this.sessions[gameSessionData.sessionID] = gameSessionData
    }

    retrieveSession(gameSessionID){
        return this.sessions[gameSessionID]
    }
}

module.exports = GameSessions;