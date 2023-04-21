'use strict'

const { Server } = require('socket.io');
const PORT = process.env.PORT || 3001;

const io = new Server(PORT);

io.on('connection', (socket) => {
  console.log('A new user has connected');

  socket.on('addPlayer', (contestant) => {
    console.log(`new player ${contestant.name}`);
    // Save the name to the server here
  });
});

console.log(`Listening on ${PORT}`);
