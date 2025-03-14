// client.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('connected to server');
});

socket.on('message', (data) => {
  console.log('message received:', data);
});

socket.on('disconnect', () => {
    console.log('disconnected from server');
});

export default socket;