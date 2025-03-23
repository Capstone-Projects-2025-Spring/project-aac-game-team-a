import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // Replace with your server URL

export default {
  install: (app) => {
    app.config.globalProperties.$socket = socket;
    app.provide("socket", socket);
  },
};

export { socket }; // Optional, for direct imports
