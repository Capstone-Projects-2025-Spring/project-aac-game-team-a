// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // Replace with your backend URL

export default {
  install: (app) => {
    app.config.globalProperties.$socket = socket; // Make it globally available
    app.provide("socket", socket); // Provide it for Composition API users
  },
};

export { socket }; // Export in case you need direct access
