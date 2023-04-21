'use strict'

const { Server } = require('socket.io');
const PORT = process.env.PORT || 3001;

const io = new Server(PORT);

let state = {
  currentGames: []
}

class Game {
  constructor() {
    this.actualRetailPrice = 0;
    this.contestants = [];
    this.guesses = 0;
    this.id;
    this.status;
  }

  getRetailPrice() {
    this.actualRetailPrice = Math.floor(Math.random() * (5000 - 500 + 1) + 500)
  }

  checkForOvers(){
    for (let i = 0; i < this.contestants.length; i++){
      if (this.contestants[i].guess > this.actualRetailPrice){
        this.contestants[i].isOver = true;
      }
    }
  }

  findClosestContestant() {
    let closestGuess = -1;
    let closestContestant = null;
  
    for (let i = 0; i < this.contestants.length; i++) {
      const contestant = this.contestants[i];
      if (!contestant.isOver) {
        const distance = this.actualRetailPrice - contestant.guess;
        if (closestGuess === -1 || distance < closestGuess) {
          closestGuess = distance;
          closestContestant = contestant;
        }
      }
    }
  
    if (closestContestant !== null) {
      console.log(`Actual Retail Price: ${this.actualRetailPrice}!`);
      console.log(`${closestContestant.username} is the winner with a guess of ${closestContestant.guess}`)
    } else {
      console.log("No contestants guessed below the retail price.");
    }
  }
  
}

class Contestant {
  constructor(username, guess){
    this.username = username;
    this.guess = guess;
    this.isOver = false;
    this.points = 0;
  }
}


  let newGame = new Game;
  newGame.getRetailPrice();


io.on('connection', (socket) => {
  console.log('A new user has connected');
  newGame.guesses += 1;


  socket.on('addPlayer', (contestant) => {
    console.log(`new player ${contestant.username}, guess: ${contestant.guess}`);
    let newContestant = new Contestant(contestant.username, parseInt(contestant.guess));
    newGame.contestants.push(newContestant)
    newGame.guesses -= 1;
    newGame.checkForOvers();

    if (newGame.guesses === 0){
      newGame.findClosestContestant()
    }
    
  });
});

console.log(`Listening on ${PORT}`);
