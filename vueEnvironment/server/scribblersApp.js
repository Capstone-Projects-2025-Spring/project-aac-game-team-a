// this is a shortcut to not use "var app = Express()"
// using Express
const Express = require("exrpess")();
// Needed for the configuration process of socket.io
const Http = require("http").Server(Express);
// include socket.io
const Socketio = require("socket.io")(Http);

// some object to prove the socket is working
var connectMsg = {
    message: "connected"
}

// start socket
Socketio.on("connection", socket => {
    // everytime a client socket enters a server, it triggers the event
    socket.emit("connectMsg", connectMsg)
})

// listen on port 3000
// 
Http.listen(3000, () => {
    console.log("listening at port 3000")
})