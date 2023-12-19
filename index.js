class Game{
    constructor(){
        this.player = null
        
    }
    start(){
        this.player = new Player()
        this.attachEventListeners()


    }
    detectCollision(){

    }
    attachEventListeners(){
        window.addEventListener("load", function(){
            // making the board visible
            const board = document.getElementById("board")
            board.style.display = "block"
        })
    }
}

class Player{
    constructor(){
        this.height = "60px"
        this.width = "100px"
        this.positionX = 0
        this.positionY = 0

        this.domElement = this.spawnPlayer()

    }
    spawnPlayer(){
        // create the player sprite
        const sprite = document.createElement("img")
        sprite.id = "diver"
        sprite.src = "./img/diver_sprite.png"
        sprite.style.height = "60px"
        


        // append both
        const board = document.getElementById("board")
        board.appendChild(sprite)
        return sprite
    }
}
class Treasure{
    constructor(){

    }
}

const game = new Game()
game.start()
