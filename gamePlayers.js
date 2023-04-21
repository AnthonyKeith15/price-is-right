'use strict';
const readline = require('readline');
const { io } = require('socket.io-client');
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const socket = io(SERVER_URL);

class ContestantInfo {
  constructor(username, guess) {
    this.username = username;
    this.guess = guess;
  }
}


socket.on('connect', () => {
  console.log('Connected to server');
  rl.question('What is your name? ', (username) => {
    let contestant = new ContestantInfo
    rl.question('What is your guess? ', (guess) => {
      contestant.username = username
      contestant.guess = guess
      socket.emit('addPlayer', contestant)
      console.log('Waiting for other players')
    });
  })
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});


