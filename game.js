const canvas = document.querySelector('canvas')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext('2d')

// TODO:
// 1) Add walls
// 2) Add boosts/food or whatever
// 3) Add score functionality
// 4) Make ghosts chase you

const gameWidth = canvas.width*0.4
const gameHeight = canvas.height*0.7
const gameX = (canvas.width / 2) - (gameWidth / 2)
const gameY = (canvas.height*0.05)

c.lineWidth = 2
c.strokeRect(gameX, gameY, gameWidth, gameHeight)

const gridSize = 10

const cellWidth = gameWidth / gridSize
const cellHeight = gameHeight / gridSize

const pacmanspeed = 4
const ghostspeed = 3.5

const pacman = new Pacman(pacmanspeed)
const redghost = new Ghost(5, 5, 'red', ghostspeed)
const blueghost = new Ghost(6, 5, 'darkblue', ghostspeed)

const boosts = []

function drawGrid() {
    for (let i = 1; i < gridSize+1; i++) {
        for (let j = 1; j < gridSize+1; j++) {
            if (!((i == 10) || (j == 10))) {
                c.beginPath()
                c.arc(gameX+(i*cellWidth), gameY+(j*cellHeight), 4, 0, Math.PI*2)
                c.stroke()
            }
            c.fillStyle = 'orange'
            c.fillRect(gameX+(i*cellWidth)-(cellWidth/2)-2, gameY+(j*cellHeight)-(cellHeight/2)-2, 4, 4)
        }
    }
}

function drawBoosts() {

}

function frame() {
    c.clearRect(0, 0, canvas.width, canvas.height)

    c.strokeRect(gameX, gameY, gameWidth, gameHeight)

    drawGrid();
    pacman.draw();
    pacman.update();

    redghost.draw();
    blueghost.draw();

    requestAnimationFrame(frame)
}

frame();

document.addEventListener('keydown', (e) => {
    pacman.turn(e)
})
