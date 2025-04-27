import { io } from "socket.io-client";

// Connect to your server (replace with your server's URL if needed)
const socket = io("http://localhost:3000");

// When connected
socket.on("connect", () => {
  console.log("Connected to server with id:", socket.id);
});

// Listen for a test event
socket.on("test", (data) => {
  console.log("Received 'test' event with data:", data);
});

// Emit a test event
function sendTestMessage() {
  socket.emit("test", { message: "Hello from client!" });
}

// Example: send a message after 2 seconds
setTimeout(() => {
  sendTestMessage();
}, 2000);

// Handle disconnect
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
