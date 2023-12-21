class Game {
  constructor() {
    this.player = null;
    this.remainingAir = 30;
    this.timeElapsed = 0;
    this.treasures = [];
    this.score = 0;
    this.gameOver = false;
  }
  start() {
    this.player = new Player();
    this.attachEventListeners();
    const firstTreasure = new Treasure("coral");
    const secondTreasure = new Treasure("yellow");
    const thirdTreasure = new Treasure("pink");

    this.treasures.push(firstTreasure, secondTreasure, thirdTreasure);
    this.gameLoop()
  }
  detectCollision() {
      
}
attachEventListeners() {
    window.addEventListener("load", function () {
        // making the board visible
        const board = document.getElementById("board");
        board.style.display = "block";
    });
    window.addEventListener("keydown", (event) => {
        const input = event.key;
        if (input === "ArrowDown") {
            console.log("listened for a key")
            this.player.directionY = 1;
        }
        if (input === "ArrowUp") {
            this.player.directionY = -1;
        }
        if (input === "ArrowLeft") {
            this.player.directionX = -1;
        }
        if (input === "ArrowRight") {
            this.player.directionX = 1;
        }
        
    });

    window.addEventListener("keyup", (event) => {
        const input = event.key;
        if (input === "ArrowDown") {
            console.log("listened for a key")
            this.player.directionY = -1;
        }
        if (input === "ArrowUp") {
            this.player.directionY = 0;
        }
        if (input === "ArrowLeft") {
            this.player.directionX = 0
        }
        if (input === "ArrowRight") {
            this.player.directionX = 0;
        }
        
    });
}
update(){
    //console.log("in the update method")
    this.player.move()
}
gameLoop(){
    //console.log("in the game loop")
    if(this.gameOver===true){
        alert("Game Over")
        return;
    }
    this.update()

    window.requestAnimationFrame(()=> this.gameLoop())
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

    this.domElement = this.spawnPlayer();
    this.domElement.style.position = "absolute";
  }
  spawnPlayer() {
    // create the player sprite
    const sprite = document.createElement("img");
    sprite.id = "diverImg";
    sprite.src = "./img/diver_sprite.png";
    sprite.style.height = "60px";
    sprite.style.left = `${this.left}px`
    sprite.style.top = `${this.top}px`

    // append the sprite in to the board
    const board = document.getElementById("board");
    board.appendChild(sprite);
    return sprite;
  }
  move() {
    
    
    this.left += this.directionX
    this.top += this.directionY

    if(this.left < 20){
        this.left = 20
    }
    if(this.top < 20){
        this.top = 20
    }
    if(this.left > 780){
        this.left = 780
    }
    if(this.top > 480){
        this.top = 480
    }
    
    this.updatePosition()
    
  }

  updatePosition() {
    
    const diver = document.getElementById("diverImg");
    diver.style.left = `${this.left}px`
    diver.style.top = `${this.top}px`
  }
  
}
class Treasure {
  constructor(color) {
    this.width = "4vw";
    this.height = "4vh";

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
