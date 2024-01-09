class Game {
  constructor(air) {
    this.player = null;
    this.treasures = [];
    this.width = 800;
    this.height = 500;
    this.remainingAir = air;
    this.timeElapsed = 0;
    this.score = 0;
    this.state = undefined;
  }
  reset() {
    console.log("status")

      const endScreen = document.getElementById("end-screen");
      endScreen.style.display = "none";
      const board = document.getElementById("board")
      board.style.display = "block"

      
      this.player.top = 0
      this.player.left = 400
      this.player.updatePosition()
      this.treasures.forEach(element=>{
          element.domElement.remove()
      })
      this.player.directionX = 0;
      this.player.directionY = 0;
      this.treasures = [];
      this.timeElapsed = 0;
      this.player.diveCount = 1;
      this.player.state = "floating"
      this.score = 0;
      this.state = "play";


    // create three treasure elements
    const shellTreasure = new Treasure("shell");
    const chestTreasure = new Treasure("treasure-chest");
    const jewelTreasure = new Treasure("jewel");
    // put the treasure items into the array
    this.treasures.push(shellTreasure, chestTreasure, jewelTreasure);

    this.gameLoop()
  }
  play() {
    this.state = "play";
    const startScreen = document.getElementById("start-screen");
    startScreen.style.display = "none";
    const endScreen = document.getElementById("end-screen");
    endScreen.style.display = "none";

    const board = document.getElementById("board");
    board.style.display = "block";
    board.style.position = "relative";
    board.style.width = `${this.width}px`;
    board.style.height = `${this.height}px`;
    // set up the game board with player, treasures and divs for timers
    this.player = new Player(this.width, this.height);

    // create three treasure elements
    const shellTreasure = new Treasure("shell");
    const chestTreasure = new Treasure("treasure-chest");
    const jewelTreasure = new Treasure("jewel");
    // put the treasure items into the array
    this.treasures.push(shellTreasure, chestTreasure, jewelTreasure);

    // create a container for all timers and game status info
    const infoContainer = document.createElement("div");
    board.appendChild(infoContainer);
    infoContainer.style.position = "absolute";
    infoContainer.style.top = "10px";

    // create a stopwatch element that keeps track of the elapsed time
    const stopWatch = document.createElement("div");
    stopWatch.id = "stop-watch";
    infoContainer.appendChild(stopWatch);

    // create an element for the air timer needed for each dive
    const airTimer = document.createElement("div");
    airTimer.id = "air-timer";
    infoContainer.appendChild(airTimer);

    // create an element that will show the player how many dives they can make
    const diveCounter = document.createElement("div");
    diveCounter.id = "dive-counter";
    infoContainer.appendChild(diveCounter);

    this.setTimers();
    this.attachEventListeners();
    this.gameLoop();
  }
  start() {
    this.state = "start";
    // change from start screen to game board
    const playButton = document.getElementById("play");
    playButton.addEventListener("click", () => {
      this.play();
    });
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
    // listen for the arrow keys and change the direction value accordingly
    window.addEventListener("keydown", (event) => {
      const sprite = document.getElementById("diver-img");
      const input = event.key;
      if (input === "ArrowDown") {
        // console.log("listened for a key")
        this.player.directionY = 1;
        sprite.classList.add("downwards");
      }
      if (input === "ArrowUp") {
        this.player.directionY = -2;
        sprite.classList.add("upwards");
      }
      if (input === "ArrowLeft") {
        this.player.directionX = -1;
        sprite.classList.remove("right-facing");
        sprite.classList.add("left-facing");
      }
      if (input === "ArrowRight") {
        this.player.directionX = 1;
        sprite.classList.remove("left-facing");
        sprite.classList.add("right-facing");
      }
     
    });
    // resets the direction values when keys are up
    // arrow down is treated specially to make the player float up if it isnt pressed
    window.addEventListener("keyup", (event) => {
      const input = event.key;
      const sprite = document.getElementById("diver-img");
      if (input === "ArrowDown") {
        //console.log("listened for a key")
        this.player.directionY = -1;
        sprite.classList.remove("downwards");
      }
      if (input === "ArrowUp") {
        this.player.directionY = -1;
        sprite.classList.remove("upwards");
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
    // check the player state
    // console.log("player position", this.player.domElement.getBoundingClientRect())
    // console.log("board", document.getElementById("board").getBoundingClientRect())
    if (this.player.top > 6) {
      this.player.state = "diving";
    } else if (this.player.top <= 6) {
      if(this.player.state === "diving"){
        this.player.diveCount += 1;
      }
      this.player.state = "floating";
    }
    
    this.player.move();
    this.detectCollision();
    // fills in content for the info container elements
    const stopWatch = document.getElementById("stop-watch");
    stopWatch.innerHTML = `<h5>Time Elapsed:<br> ${this.timeElapsed}</h5>`;

    const diveTimer = document.getElementById("air-timer");
    diveTimer.innerHTML = `<h5>Remaining air:<br> ${this.remainingAir}`;

    const diveCounter = document.getElementById("dive-counter");
    diveCounter.innerHTML = `<h5>Numer of dives:<br>${this.player.diveCount}</h5>`;
  }
  gameLoop() {
    this.update();

    // check if the game is won or lost
    if (this.player.diveCount > 3) {
      this.state = "lost";
    }
    if (!this.treasures.length && this.player.state === "floating") {
      this.state = "won";
    }
    if (this.state === "lost" || this.state === "won") {
      this.gameEnd();
      return this.timeElapsed
    }

    window.requestAnimationFrame(() => this.gameLoop());
  }
  setTimers() {
    // console.log("starting the air timer")
    setInterval(() => {
      if (this.player.state === "floating") {
        this.remainingAir = 20;
      }
      if (this.player.state === "diving" && this.player.top > 20) {
        this.remainingAir -= 1;
      }
      if (this.remainingAir === 0) {
        this.state = "lost";
      }
    }, 1000);
    // define an interval to keep count of the seconds elapsed
    setInterval(() => {
      this.timeElapsed += 1;
    }, 1000);
  }
  gameEnd() {
    // change from game screen to end screen
    const board = document.getElementById("board");
    board.style.display = "none";
    const endScreen = document.getElementById("end-screen");
    endScreen.style.display = "flex";

    const gameWon = document.getElementById("game-won");
    const gameLost = document.getElementById("game-lost");
    // calculate the score if the game was won
    if (this.state === "won") {
      const time = this.timeElapsed;
      if (time <= 50) {
        this.score += 20;
        this.score += 50 - time;
      }
      if (time <= 30) {
        this.score += 40;
        this.score += 30 - time;
      }
      gameLost.style.display = "none";
      const scoreDomElement = document.createElement("div")
      gameWon.appendChild(scoreDomElement)
      scoreDomElement.innerHTML = `<br><p class="score">Score: ${this.score}</p>`;
    }
    if (this.state === "lost") {
      gameWon.style.display = "none";
    }
    const replay = document.getElementById("reload");
    replay.addEventListener("click", () => {
      this.reset()
      return;
    });
  }
}

class Player {
  constructor(boardWidth, boardHeight) {
    this.height = 60;
    this.width = 100;
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
    this.left = 400;
    this.top = 0;
    this.directionX = 0;
    this.directionY = 0;
    this.diveCount = 1;
    this.state = "floating";

    this.domElement = this.spawnPlayer();
    this.domElement.style.position = "relative";
  }
  spawnPlayer() {
    // create the player sprite
    const sprite = document.createElement("img");
    sprite.id = "diver-img";
    sprite.src = "./img/diver_sprite.png";
    sprite.style.height = "60px";
    sprite.style.left = `${this.left}px`;
    sprite.style.top = `${this.top}px`;
    sprite.classList.add("right-facing");

    // append the sprite to the board
    const board = document.getElementById("board");
    board.appendChild(sprite);
    return sprite;
  }
  move() {
    this.left += this.directionX;
    this.top += this.directionY;

    // making sure the player stays within the board
    if (this.left < 0) {
      this.left = 0;
    }
    if (this.top < 0) {
      this.top = 0;
    }
    if (this.left > this.boardWidth - this.width) {
      this.left = this.boardWidth - this.width;
    }
    if (this.top > this.boardHeight - this.height) {
      this.top = this.boardHeight - this.height;
    }

    this.updatePosition();
  }

  updatePosition() {
    const diver = document.getElementById("diver-img");
    diver.style.left = `${this.left}px`;
    diver.style.top = `${this.top}px`;
  }
}
class Treasure {
  constructor(name) {
    this.width = 60;
    this.height = 60;
    // this.left = 0;
    // this.top = 0;
    this.isCollected = false;

    this.domElement = this.placeTreasures(name);
  }
  placeTreasures(name) {
    const treasure = document.createElement("div");
    treasure.id = name;
    treasure.className = "treasure";
    treasure.style.width = `${this.width}px`;
    treasure.style.height = `${this.height}px`;
    treasure.style.position = "absolute";
    treasure.style.display = "block";

    // first location
    if (treasure.id === "treasure-chest") {
      treasure.style.left = "12%";
      treasure.style.top = "50%";
    }

    // second location
    if (treasure.id === "jewel") {
      treasure.style.left = "48%";
      treasure.style.top = "38%";
    }
    // third location
    if (treasure.id === "shell") {
      treasure.style.left = "87%";
      treasure.style.top = "65%";
    }
    const board = document.getElementById("board");
    board.appendChild(treasure);
    return treasure;
  }
}

const game = new Game(20);
game.start();
