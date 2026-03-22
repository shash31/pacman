const canvas = document.querySelector('canvas')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext('2d')

// TODO:
// 1) Make ghosts chase you
// 2) Add the boost or whatever
// 3) Eat ghosts
// 4) Respawn ghosts
// 5) Add saving option to grid maker (Probably shift to its own file)
// 6) Refactoring messy code (more functions and classes)
// 7) Add leaderboards

const gameWidth = canvas.width*0.6
const gameHeight = canvas.height*0.75
const gameX = (canvas.width / 2) - (gameWidth / 2)
const gameY = (canvas.height*0.05)

const customGridBtnX = canvas.width*0.9
const customGridBtnY = canvas.height*0.2
const customGridBtnRadius = canvas.height*0.1

const pauseplayBtnX = canvas.width*0.9
const pauseplayBtnY = canvas.height*0.5
const pauseplayBtnRadius = canvas.height*0.1
let paused = true

const resetBtnX = canvas.width*0.9
const resetBtnY = canvas.height*0.8
const resetBtnRadius = canvas.height*0.1

const availableGridsX = canvas.width*0.02
const availableGridsY = canvas.height*0.05
const availableGridsWidth = canvas.width*0.15
const availableGridsHeight = canvas.height*0.8
const availableGridsCellHeight = availableGridsHeight/12

let gridWidth;
let gridHeight;

let cellWidth;
let cellHeight;

let pacman;
let redghost;
let blueghost;

let pacmanspeed;
let ghostspeed;

let grid;
let score;
let boosts;

// For grid maker
let customGridWidth;
let customGridHeight;
let customGrid;

function init2dGrid(xlen, ylen, value='F') {
    grid = []
    for (let i = 0; i < ylen; i++) {
        grid.push([])
        for (let j = 0; j < xlen; j++) {
            grid[i].push(value)
        }
    }

    return grid
}

function init() {
    // grid = [[0, 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
    //         ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
    //         ['F', 'F', 'F', 'F', 'W', 'W', 'F', 'F', 'F', 'F'],
    //         ['F', 'F', 'W', 'W', 'W', 'W', 'W', 'W', 'F', 'F'],
    //         ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
    //         ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
    //         ['F', 'F', 'W', 'W', 'W', 'W', 'W', 'W', 'F', 'F'],
    //         ['F', 'F', 'F', 'F', 'W', 'W', 'F', 'F', 'F', 'F'],
    //         ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
    //         ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F']
    //     ]
    gameOver = false;

    // if (customGrid) {
    //     customGrid.forEach((row, i) => {
    //         row.forEach((el, j) => {
    //             if (el == 0) customGrid[i][j] = 'F'
    //         })
    //     });
    //     gridWidth = customGrid[0].length
    //     gridHeight = customGrid.length

    //     grid = customGrid
    // } else {
    //     gridWidth = 10
    //     gridHeight = 10

    //     // grid = init2dGrid(gridWidth, gridHeight, 'F')
    //     grid = [[0, "F", "F", "F", "F", "F", "F", "F", "F", "F"],
    //             ["F", "W", "F", "W", "F", "F", "W", "F", "W", "F"],
    //             ["F", "F", "F", "F", "F", "F", "F", "F", "F", "F"],
    //             ["F", "W", "F", "F", "W", "W", "F", "F", "W", "F"],
    //             ["F", "F", "F", "F", "W", "W", "F", "F", "F", "F"],
    //             ["F", "F", "W", "F", "F", "F", "F", "W", "F", "F"],
    //             ["F", "F", "W", "F", "F", "F", "F", "W", "F", "F"],
    //             ["F", "W", "W", "F", "W", "W", "F", "W", "W", "F"],
    //             ["F", "F", "W", "F", "W", "W", "F", "W", "F", "F"],
    //             ["F", "F", "F", "F", "F", "F", "F", "F", "F", "F"]]
    // }

    grid = []
    grids[selectedGrid].forEach((row, i) => {
        grid.push([])
        row.forEach((value) => {
            grid[i].push(value)
        })
    })

    gridWidth = grid[0].length
    gridHeight = grid.length;

    grid[0][0] = 0
    
    cellWidth = gameWidth / gridWidth
    cellHeight = gameHeight / gridHeight

    pacmanspeed = cellHeight/12
    ghostspeed = cellHeight/10

    score = 0

    pacman = new Pacman(pacmanspeed)
    redghost = new Ghost(5, 5, 'red', ghostspeed)
    blueghost = new Ghost(6, 5, 'darkblue', ghostspeed)

    console.log(grid)
    console.log(gameX, gameY)
    console.log(cellWidth, cellHeight)
    console.log(pacmanspeed, ghostspeed)

    // Initial frame
    c.clearRect(0, 0, canvas.width, canvas.height)

    c.lineWidth = 2
    c.strokeRect(gameX, gameY, gameWidth, gameHeight)

    showUsableGrids();

    drawGrid();

    displayScore();

    pacman.draw();
    redghost.draw();
    blueghost.draw();

    // Custom grid maker
    c.font = '18px Sans-Serif'
    c.fillStyle = 'blue'
    c.beginPath()
    c.arc(customGridBtnX, customGridBtnY, customGridBtnRadius, 0, Math.PI*2)
    c.stroke()
    c.fill()
    c.fillStyle = 'black'
    c.fillText('Make custom grid', customGridBtnX, customGridBtnY)

    // Pauseplay button
    c.fillStyle = 'orange'
    c.beginPath()
    c.arc(pauseplayBtnX, pauseplayBtnY, pauseplayBtnRadius, 0, Math.PI*2)
    c.stroke()
    c.fill()
    c.fillStyle = 'white'
    // Play sign
    c.fillStyle = 'green'
    c.beginPath()
    c.moveTo(pauseplayBtnX-pauseplayBtnRadius/2, pauseplayBtnY-pauseplayBtnRadius/2)
    c.lineTo(pauseplayBtnX+pauseplayBtnRadius/2, pauseplayBtnY)
    c.lineTo(pauseplayBtnX-pauseplayBtnRadius/2, pauseplayBtnY+pauseplayBtnRadius/2)
    c.lineTo(pauseplayBtnX-pauseplayBtnRadius/2, pauseplayBtnY-pauseplayBtnRadius/2)
    c.stroke()
    c.fill()

    // Reset button for testing
    c.fillStyle = 'red'
    c.beginPath()
    c.arc(resetBtnX, resetBtnY, resetBtnRadius, 0, Math.PI*2)
    c.stroke()
    c.fill()
    c.fillStyle = 'black'
    c.fillText('Reset', resetBtnX, resetBtnY)
}

function drawGrid() {
    for (let i = 1; i < gridHeight+1; i++) {
        for (let j = 1; j < gridWidth+1; j++) {
            c.beginPath()
            if (grid[i-1][j-1] == 'W') {
                c.strokeRect(gameX+((j-1)*cellWidth), gameY+((i-1)*cellHeight), cellWidth, cellHeight)
                continue
            }
            if (!((i == gridHeight) || (j == gridWidth))) {
                if (grid[i][j] != 'W' && grid[i][j-1] != 'W' && grid[i-1][j] != 'W') {
                    c.arc(gameX+(j*cellWidth), gameY+(i*cellHeight), 4, 0, Math.PI*2)
                    c.stroke()
                }
            }

            if (grid[i-1][j-1] == 'F') {
                c.fillStyle = 'orange'
                c.fillRect(gameX+(j*cellWidth)-(cellWidth/2)-2, gameY+(i*cellHeight)-(cellHeight/2)-2, 4, 4)
            }
        }
    }
}

function drawBoosts() {

}

function customGridMaker() {
    drawingGrid = true
    customGridWidth = 10
    customGridHeight = 10
    customGrid = init2dGrid(customGridWidth, customGridHeight, 'F')

    console.log(customGrid)

    function drawCustomGrid() {
        for (let i = 0; i < customGridHeight; i++) {
            for (let j = 0; j < customGridWidth; j++) {
                if (customGrid[i][j] == 'F') {
                    c.fillStyle = 'grey'
                } else if (customGrid[i][j] == 'W') {
                    c.fillStyle = 'red'
                }
                c.strokeRect(gameX+(j*cellWidth), gameY+(i*cellHeight), cellWidth, cellHeight)
                c.fillRect(gameX+(j*cellWidth), gameY+(i*cellHeight), cellWidth, cellHeight)
            }
        }
    }

    function gridMakerFrame() {
        animationID = requestAnimationFrame(gridMakerFrame)
        
        c.clearRect(0, 0, canvas.width, canvas.height)
        
        drawCustomGrid()

        // Instructions
        c.fillStyle = 'white'
        c.textAlign = 'center'
        c.textBaseline = 'middle'
        c.font = '25px Sans-Serif'
        c.fillText('Click on cells to make walls', canvas.width*0.5, canvas.height*0.9)

        // Export grid button
        c.font = '18px Sans-Serif'
        c.fillStyle = 'blue'
        c.beginPath()
        c.arc(customGridBtnX, customGridBtnY, customGridBtnRadius, 0, Math.PI*2)
        c.stroke()
        c.fill()
        c.fillStyle = 'black'
        c.fillText('Finish custom grid', customGridBtnX, customGridBtnY)

        // Cancel
        c.fillStyle = 'orange'
        c.beginPath()
        c.arc(resetBtnX, resetBtnY, resetBtnRadius, 0, Math.PI*2)
        c.stroke()
        c.fill()
        c.fillStyle = 'black'
        c.fillText('Cancel', resetBtnX, resetBtnY)
    }

    gridMakerFrame()
}

function displayScore() {
    // Display score
    c.fillStyle = 'white'
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.font = '30px Sans-Serif'
    c.fillText(`Score: ${score}`, canvas.width*0.5, canvas.height*0.9)
}

function showUsableGrids() {
    // c.fillStyle = '#2C2D2D'
    // c.fillRect(canvas.width*0.02, canvas.height*0.05, canvas.width*0.15, canvas.height*0.8)
    c.strokeRect(availableGridsX, availableGridsY, availableGridsWidth, availableGridsHeight)

    c.fillStyle = 'white'
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.font = '20px Sans-Serif'
    c.fillText('Available grids', availableGridsX+(availableGridsWidth/2), canvas.height*0.09)

    c.moveTo(availableGridsX, availableGridsY+availableGridsCellHeight)
    c.lineTo(availableGridsX+availableGridsWidth, availableGridsY+availableGridsCellHeight)
    c.stroke()

    // Default grid
    // if (selectedGrid == 'Default') {
    //     c.fillStyle = 'blue'
    //     c.fillRect(availableGridsX, availableGridsY+availableGridsCellHeight, availableGridsWidth, availableGridsCellHeight)
    // } else {
    //     c.strokeRect(availableGridsX, availableGridsY+availableGridsCellHeight, availableGridsWidth, availableGridsCellHeight)
    // }
    // c.fillStyle = 'white'
    // c.font = '17px Sans-Serif'
    // c.fillText('Default', availableGridsX+(availableGridsWidth/2), availableGridsY+(availableGridsCellHeight*3/2))

    let i = 1
    for (const key in grids) {
        if (key == selectedGrid) {
            c.fillStyle = 'blue'
            c.fillRect(availableGridsX, availableGridsY+(i*availableGridsCellHeight), availableGridsWidth, availableGridsCellHeight)
        } else {
            c.strokeRect(availableGridsX, availableGridsY+(i*availableGridsCellHeight), availableGridsWidth, availableGridsCellHeight)
        }
        c.fillStyle = 'white'
        c.fillText(key, availableGridsX+(availableGridsWidth/2), availableGridsY+(i*availableGridsCellHeight)+(availableGridsCellHeight/2))
        i++;
    }

    c.strokeRect(availableGridsX, availableGridsY+(11*availableGridsCellHeight), availableGridsWidth, availableGridsCellHeight)
    c.fillStyle = 'red'
    c.fillText('Delete', availableGridsX+(availableGridsWidth/2), availableGridsY+(11.5*availableGridsCellHeight))
}

function frame() {
    animationID = requestAnimationFrame(frame)
    if (!playingGame) {
        playingGame = true
        console.log(`Animation ID: ${animationID}`)
    }
    
    c.clearRect(0, 0, canvas.width, canvas.height)

    c.lineWidth = 2
    c.strokeRect(gameX, gameY, gameWidth, gameHeight)

    showUsableGrids();

    drawGrid();

    displayScore();

    pacman.draw();
    pacman.update();

    // Food eating detection
    if (grid[pacman.pos.y][pacman.pos.x] == 'F') {
        const xcenter = gameX + pacman.pos.x*cellWidth + cellWidth/2
        const ycenter = gameY + pacman.pos.y*cellHeight + cellHeight/2
        // If food in pacman's mouth, eat
        if (Math.abs(pacman.x - xcenter) <= pacman.radius && Math.abs(pacman.y - ycenter) <= pacman.radius) {
            grid[pacman.pos.y][pacman.pos.x] = 0
            score += 10
        }
    }

    redghost.draw();
    blueghost.draw();
    redghost.update();
    blueghost.update()

    // Custom grid maker button
    c.font = '18px Sans-Serif'
    c.fillStyle = 'blue'
    c.beginPath()
    c.arc(customGridBtnX, customGridBtnY, customGridBtnRadius, 0, Math.PI*2)
    c.stroke()
    c.fill()
    c.fillStyle = 'black'
    c.fillText('Make custom grid', customGridBtnX, customGridBtnY)

    // Pause button
    c.fillStyle = 'orange'
    c.beginPath()
    c.arc(pauseplayBtnX, pauseplayBtnY, pauseplayBtnRadius, 0, Math.PI*2)
    c.stroke()
    c.fill()
    c.fillStyle = 'white'
    if (!paused) {
        // Pause sign
        c.fillRect(pauseplayBtnX-pauseplayBtnRadius/2, pauseplayBtnY-pauseplayBtnRadius/2, pauseplayBtnRadius*0.25, pauseplayBtnRadius)
        c.fillRect(pauseplayBtnX+pauseplayBtnRadius/2-pauseplayBtnRadius*0.25, pauseplayBtnY-pauseplayBtnRadius/2, pauseplayBtnRadius*0.25, pauseplayBtnRadius)
    }
    // Reset button for testing
    c.fillStyle = 'red'
    c.beginPath()
    c.arc(resetBtnX, resetBtnY, resetBtnRadius, 0, Math.PI*2)
    c.stroke()
    c.fill()
    c.fillStyle = 'black'
    c.fillText('Reset', resetBtnX, resetBtnY)

    // Ghost collision detection
    if ((Math.abs(pacman.x - redghost.x) <= cellWidth*0.1 && Math.abs(pacman.y - redghost.y) <= cellHeight*0.1)
    || (Math.abs(pacman.x - blueghost.x) <= cellWidth*0.1 && Math.abs(pacman.y - blueghost.y) <= cellHeight*0.1)
    ) {
        console.log('game end')
        stopGame()
        gameOver = true
        // Gray out pause/play button
        c.fillStyle = 'grey'
        c.fillRect(pauseplayBtnX-pauseplayBtnRadius/2, pauseplayBtnY-pauseplayBtnRadius/2, pauseplayBtnRadius*0.25, pauseplayBtnRadius)
        c.fillRect(pauseplayBtnX+pauseplayBtnRadius/2-pauseplayBtnRadius*0.25, pauseplayBtnY-pauseplayBtnRadius/2, pauseplayBtnRadius*0.25, pauseplayBtnRadius)
    }
}

function stopGame() {
    playingGame = false
    cancelAnimationFrame(animationID)
}

let animationID
let playingGame = false
let drawingGrid = false
let gameOver;
const grids = {'Default' : [[0, "F", "F", "F", "F", "F", "F", "F", "F", "F"],
                            ["F", "W", "F", "W", "F", "F", "W", "F", "W", "F"],
                            ["F", "F", "F", "F", "F", "F", "F", "F", "F", "F"],
                            ["F", "W", "F", "F", "W", "W", "F", "F", "W", "F"],
                            ["F", "F", "F", "F", "W", "W", "F", "F", "F", "F"],
                            ["F", "F", "W", "F", "F", "F", "F", "W", "F", "F"],
                            ["F", "F", "W", "F", "F", "F", "F", "W", "F", "F"],
                            ["F", "W", "W", "F", "W", "W", "F", "W", "W", "F"],
                            ["F", "F", "W", "F", "W", "W", "F", "W", "F", "F"],
                            ["F", "F", "F", "F", "F", "F", "F", "F", "F", "F"]]}
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    // grids.push(JSON.parse(localStorage.getItem(key)))
    grids[key] = JSON.parse(localStorage.getItem(key))
}
let selectedGrid = 'Default'
init();

function pauseplay() {

}

document.addEventListener('keydown', (e) => {
    if ((paused || !playingGame) && !gameOver) {
        if (e.code == 'ArrowUp' || e.code == 'ArrowDown' || e.code == 'ArrowLeft' || e.code == 'ArrowRight') {
            paused = false;
            frame();
        }
    }
    pacman.turn(e)
})

canvas.addEventListener('click', (e) => {
    if (gameOver || paused || !playingGame) {
        if (e.clientX > availableGridsX && e.clientX < availableGridsX+availableGridsWidth && 
            e.clientY > availableGridsY+availableGridsCellHeight && e.clientY < availableGridsY+availableGridsHeight
        ) {
            const i = Math.floor((e.clientY - (availableGridsY+availableGridsCellHeight))/availableGridsCellHeight)
            const keys = Object.keys(grids)
            if (i < keys.length) {
                selectedGrid = keys[i]
                init()
            } else if (i == 10) {
                if (selectedGrid != 'Default') {
                    // Delete selected grid
                    console.log(grids)
                    localStorage.removeItem(selectedGrid)
                    delete grids[selectedGrid]
                    console.log(grids)
                    selectedGrid = 'Default'
                    init()
                }
            }
            return;
        }
    }

    if (drawingGrid) {
        if (e.clientX > gameX && e.clientX < gameX+gameWidth && e.clientY > gameY && e.clientY < gameY+gameHeight) {
            const x = Math.floor((e.clientX-gameX)/cellWidth)
            const y = Math.floor((e.clientY-gameY)/cellHeight)
            if (customGrid[y][x] == 'F') {
                customGrid[y][x] = 'W'
            } else {
                customGrid[y][x] = 'F'
            }
            return;
        }
    }

    const distToCustomGridBtn = Math.sqrt(Math.pow(e.clientX-customGridBtnX, 2)+Math.pow(e.clientY-customGridBtnY, 2))
    if (distToCustomGridBtn <= customGridBtnRadius) {
        if (!drawingGrid) {
            stopGame()
            customGridMaker()
        } else {
            drawingGrid = false
            cancelAnimationFrame(animationID)
            // Save custom grid to localStorage
            selectedGrid = `Custom Grid ${localStorage.length + 1}`
            localStorage.setItem(selectedGrid, JSON.stringify(customGrid))
            grids[selectedGrid] = customGrid
            init() // Using custom grid
        }
        return;
    }

    const distToPausePlayBtn = Math.sqrt(Math.pow(e.clientX-pauseplayBtnX,2)+Math.pow(e.clientY-pauseplayBtnY,2))
    if (distToPausePlayBtn <= pauseplayBtnRadius) {
        if (gameOver) return;
        if (paused) {
            paused = false
            frame()
        } else {
            paused = true
            cancelAnimationFrame(animationID)
            // Clear pause sign lines
            c.fillStyle = 'orange'
            c.fillRect(pauseplayBtnX-pauseplayBtnRadius/2-0.5, pauseplayBtnY-pauseplayBtnRadius/2-0.5, pauseplayBtnRadius*0.25+1, pauseplayBtnRadius+1)
            c.fillRect(pauseplayBtnX+pauseplayBtnRadius/2-pauseplayBtnRadius*0.25-0.5, pauseplayBtnY-pauseplayBtnRadius/2-0.5, pauseplayBtnRadius*0.25+1, pauseplayBtnRadius+1)
            // Play sign
            c.fillStyle = 'green'
            c.beginPath()
            c.moveTo(pauseplayBtnX-pauseplayBtnRadius/2, pauseplayBtnY-pauseplayBtnRadius/2)
            c.lineTo(pauseplayBtnX+pauseplayBtnRadius/2, pauseplayBtnY)
            c.lineTo(pauseplayBtnX-pauseplayBtnRadius/2, pauseplayBtnY+pauseplayBtnRadius/2)
            c.lineTo(pauseplayBtnX-pauseplayBtnRadius/2, pauseplayBtnY-pauseplayBtnRadius/2)
            c.stroke()
            c.fill()
        }
    }

    const distToResetBtn = Math.sqrt(Math.pow(e.clientX-resetBtnX, 2)+Math.pow(e.clientY-resetBtnY, 2))
    if (distToResetBtn <= resetBtnRadius) {
        if (!drawingGrid) {
            stopGame()
            init()
        } else {
            drawingGrid = false
            cancelAnimationFrame(animationID)
            customGrid = undefined
            init()
        }
        return;
    }
})
