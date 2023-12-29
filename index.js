class Game {
  constructor() {
    this.player = null;
    this.remainingAir = 30;
    this.timeElapsed = 0;
    this.treasures = [];
    this.score = 0;
    this.gameOver = false;
    this.gameWon = false;
  }
  start() {
    this.player = new Player();
    this.attachEventListeners();

    // create three treasure elements
    const firstTreasure = new Treasure("coral");
    const secondTreasure = new Treasure("yellow");
    const thirdTreasure = new Treasure("pink");
    // put the treasure items into the array
    this.treasures.push(firstTreasure, secondTreasure, thirdTreasure);

    // create a stopwatch element that keeps track of the elapsed time
    const stopWatch = document.createElement("div");
    stopWatch.id = "stop-watch";

    const board = document.getElementById("board");
    board.appendChild(stopWatch);

    // define an interval to keep count the seconds elapsed
    setInterval(() => {
      this.timeElapsed += 1;
    }, 1000);

    // create an element for the air timer needed for each dive
    const airTimer = document.createElement("div");
    airTimer.id = "air-timer";

    board.appendChild(airTimer);

    this.gameLoop();
    this.airTimer();
  }

  detectCollision() {
    const player = this.player.domElement.getBoundingClientRect();
    const treasureCollision = this.treasures.filter((treasure) => {
      return (treasure.collisionBody =
        treasure.domElement.getBoundingClientRect());
    });
    treasureCollision.forEach((treasureInstance) => {
      if (
        player.top < treasureInstance.collisionBody.bottom &&
        player.left < treasureInstance.collisionBody.right &&
        player.bottom > treasureInstance.collisionBody.top &&
        player.right > treasureInstance.collisionBody.left
      ) {
        treasureInstance.isCollected = true;
        return treasureInstance;
      }
    });

    this.treasures.forEach((treasure, index) => {
      if (treasure.isCollected === true) {
        treasure.domElement.style.display = "none";
        this.score += 20;
        this.treasures.splice(index, 1);
      }
    });
  }
  attachEventListeners() {
    window.addEventListener("load", function () {
      // making the board visible
      const board = document.getElementById("board");
      board.style.display = "block";
    });
    // listen for the arrow keys and change the direction value accordingly
    window.addEventListener("keydown", (event) => {
      const input = event.key;
      if (input === "ArrowDown") {
        // console.log("listened for a key")
        this.player.directionY = 1;
      }
      if (input === "ArrowUp") {
        this.player.directionY = -2;
      }
      if (input === "ArrowLeft") {
        this.player.directionX = -1;
      }
      if (input === "ArrowRight") {
        this.player.directionX = 1;
      }
      if(this.player.diveCount === 3 && input === "ArrowDown"){
        this.gameOver = true
      }
    });
    // resets the direction values when keys are up
    // arrow down is treated specially to make the player float up if it isnt pressed
    window.addEventListener("keyup", (event) => {
      const input = event.key;
      if (input === "ArrowDown") {
        //console.log("listened for a key")
        this.player.directionY = -1;
      }
      if (input === "ArrowUp") {
        this.player.directionY = 0;
      }
      if (input === "ArrowLeft") {
        this.player.directionX = 0;
      }
      if (input === "ArrowRight") {
        this.player.directionX = 0;
      }
    });
  }
  update() {
    //console.log("in the update method")
    this.player.move();
    this.detectCollision();
    if(this.player.top===21){
        console.log(this.player.diveCount)
        this.player.diveCount+= 0.5
    }

    const stopWatch = document.getElementById("stop-watch");
    stopWatch.innerHTML = `<h5>Time Elapsed: ${this.timeElapsed}</h5>`;

    const diveTimer = document.getElementById("air-timer");
    diveTimer.innerHTML = `<h5>Remaining air: ${this.remainingAir}`;
  }
  gameLoop() {
    // check the player state
    if (this.player.top > 40) {
      this.player.state.diving = true;
      this.player.state.floating = false;
    } else if (this.player.top < 40) {
      this.player.state.diving = false;
      this.player.state.floating = true;
    }

    this.update();

    // check if the game is won or lost
    if(this.player.diveCount > 3){
        alert("You haven't got enough air to dive again")
        this.gameOver = true;
    }
    if (!this.treasures.length && this.player.state.floating === true) {
      this.gameWon = true;
    }
    if (this.gameWon || this.gameOver) {
      this.gameEnd();
      return;
    }

    window.requestAnimationFrame(() => this.gameLoop());
  }
  airTimer() {
    // console.log("starting the air timer")
    setInterval(() => {
      if (this.player.state.floating === true) {
        this.remainingAir = 30;
      }
      if (this.player.state.diving === true) {
        this.remainingAir -= 1;
      }
      if (this.remainingAir === 0) {
        this.gameOver = true;
      }
    }, 1000);
  }
  gameEnd() {
    // change from game screen to end screen
    const board = document.getElementById("board");
    board.style.display = "none";
    const endScreen = document.getElementById("end-screen");
    endScreen.style.display = "flex";

    // calculate the score if the game was won
    if (this.gameWon) {
      const time = this.timeElapsed;
      if (time <= 60) {
        this.score += 10;
        this.score += 60 - time;
      }
      if (time <= 40) {
        this.score += 20;
        this.score += 40 - time;
      }
      endScreen.innerHTML = `<h1>Your score: /n ${this.score}</h1>`;
    }
  }
}

class Player {
  constructor() {
    this.height = 0;
    this.width = 0;
    this.left = 400;
    this.top = 20;
    this.directionX = 0;
    this.directionY = 0;
    this.diveCount = 0;
    this.state = {
      floating: true,
      diving: false,
    };

    this.domElement = this.spawnPlayer();
    this.domElement.style.position = "absolute";
  }
  spawnPlayer() {
    // create the player sprite
    const sprite = document.createElement("img");
    sprite.id = "diverImg";
    sprite.src = "./img/diver_sprite.png";
    sprite.style.height = "60px";
    sprite.style.left = `${this.left}px`;
    sprite.style.top = `${this.top}px`;

    // append the sprite in to the board
    const board = document.getElementById("board");
    board.appendChild(sprite);
    return sprite;
  }
  move() {
    this.left += this.directionX;
    this.top += this.directionY;

    // making sure the player stays within the board
    if (this.left < 20) {
      this.left = 20;
    }
    if (this.top < 20) {
      this.top = 20;
    }
    if (this.left > 780) {
      this.left = 780;
    }
    if (this.top > 480) {
      this.top = 480;
    }

    this.updatePosition();
  }

  updatePosition() {
    const diver = document.getElementById("diverImg");
    diver.style.left = `${this.left}px`;
    diver.style.top = `${this.top}px`;
  }
}
class Treasure {
  constructor(color) {
    this.width = "4vw";
    this.height = "4vh";
    this.isCollected = false;

    this.domElement = this.placeTreasures(color);
  }
  placeTreasures(color) {
    const treasure = document.createElement("div");
    treasure.id = color;
    treasure.className = "treasure";
    treasure.style.width = `${this.width}`;
    treasure.style.height = `${this.height}`;
    treasure.style.backgroundColor = color;
    treasure.style.position = "absolute";

    // first location

    if (treasure.id === "coral") {
      treasure.style.left = "150px";
      treasure.style.top = "480px";
    }

    // second location
    if (treasure.id === "yellow") {
      treasure.style.position = "absolute";
      treasure.style.left = "400px";
      treasure.style.top = "260px";
    }
    // third location
    else if (treasure.id === "pink") {
      treasure.style.position = "absolute";
      treasure.style.left = "780px";
      treasure.style.top = "380px";
    }

    const board = document.getElementById("board");
    board.appendChild(treasure);
    return treasure;
  }
}

const game = new Game();
game.start();
