class Pacman {
    constructor(speed) {
        this.x = gameX+(cellWidth/2)
        this.y = gameY+(cellHeight/2)
        this.pos = { x: 0, y: 0 }

        // Mouth eating animation
        // 0 is on right side of circle and pi is on left side
        this.maxMouthBottom = Math.PI*1/4
        this.mouthbottom = this.maxMouthBottom
        this.mouthclose = 0
        this.closingmouth = true

        this.radius = cellHeight*0.3
        this.dir = { x: 0, y: 0 }
        this.nextTurn = {}
        this.turningQueue = []
        this.turning = false
        this.speed = speed
    }

    turn(e) {
        let turn;
        if (e.code == 'ArrowDown') {
            turn = { x: 0, y: 1 }
        } else if (e.code == 'ArrowUp') {
            turn = { x: 0, y: -1 }
        } else if (e.code == 'ArrowRight') {
            turn = { x: 1, y: 0 }
        } else if (e.code == 'ArrowLeft') {
            turn = { x: -1, y: 0 }
        } else {
            return
        }

        // Add to queue if turning is in progress
        if (this.turning) {
            // Only store 2 turns at a time (could change/add later)
            if (this.turningQueue.length < 2) {
                let lastTurn
                if (this.turningQueue.length == 0) {
                    lastTurn = this.nextTurn
                } else {
                    lastTurn = this.turningQueue[this.turningQueue.length-1] 
                }
                if (lastTurn.x == turn.x && lastTurn.y == turn.y) return
                this.turningQueue.push(turn)
                console.log(this.turningQueue)
            }
            return
        }

        // If turn is already current direction, then invalid
        if ((turn.x == this.dir.x && turn.y == this.dir.y)) {
            // At this point, there isn't a queue
            this.nextTurn = {}
            return
        }

        // If turn is in opposite direction, we can immediately change direction
        if (turn.x == this.dir.x || turn.y == this.dir.y) {
            this.dir.x = turn.x
            this.dir.y = turn.y
            console.log(this.dir.x, this.dir.y)
            this.nextTurn = {}
            this.updatemouthangles();
            return
        }

        // Turn is adjacent; Handle at intersection
        this.nextTurn.x = turn.x; this.nextTurn.y = turn.y
        this.turning = true
    }

    validFuturePos(xdir, ydir) {
        const futureposx = this.pos.x+xdir; const futureposy = this.pos.y+ydir;
        if (this.inbounds(futureposx, futureposy) && (grid[futureposy][futureposx] != 1)) return true
        return false
    }

    inbounds(x, y) {
        if ((0 <= x) && (x < gridSize) && (0 <= y) && (y < gridSize)) return true
        return false
    }

    draw() {
        c.fillStyle = 'yellow'
        c.beginPath()
        if (this.mouthbottom <= this.mouthclose) {
            c.arc(this.x, this.y, this.radius, 0, Math.PI*2)
        } else {
            c.arc(this.x, this.y, this.radius, this.mouthbottom, (2*this.mouthclose) - this.mouthbottom)
            c.lineTo(this.x, this.y)
            c.lineTo(this.x+(this.radius*Math.cos(this.mouthbottom)), this.y+(this.radius*Math.sin(this.mouthbottom)))
        }
        c.stroke()
        c.fill()
    }

    within(x, y, margin) {
        return (Math.abs(y-x) <= margin)
    }

    align() {
        this.x = gameX + this.pos.x*cellWidth + (cellWidth/2)
        this.y = gameY + this.pos.y*cellHeight + (cellHeight/2)
    }

    updatemouthangles() {
        // mouthbottom is always decreasing when closing mouth and increasing when opening mouth
        if (this.dir.x == 1 && this.dir.y == 0) {
            // Right
            this.maxMouthBottom = Math.PI*1/4
            this.mouthclose = 0
        } else if (this.dir.x == -1 && this.dir.y == 0) {
            // Left
            this.maxMouthBottom = Math.PI*5/4
            this.mouthclose = Math.PI
        } else if (this.dir.x == 0 && this.dir.y == 1) {
            // Down
            this.maxMouthBottom = Math.PI*3/4
            this.mouthclose = Math.PI/2
        } else if (this.dir.x == 0 && this.dir.y == -1) {
            // Up
            this.maxMouthBottom = Math.PI*7/4
            this.mouthclose = Math.PI*3/2
        }
        // Reset to open mouth
        this.mouthbottom = this.maxMouthBottom
    }

    updatemouth() {
        if (this.closingmouth) {
            this.mouthbottom -= 0.05
            if (this.mouthbottom <= this.mouthclose) this.closingmouth = false
        } else {
            this.mouthbottom += 0.05
            if (this.mouthbottom >= this.maxMouthBottom) this.closingmouth = true
        }
    }

    updatepos() {
        this.pos.x = Math.floor((this.x - gameX)/cellWidth)
        this.pos.y = Math.floor((this.y - gameY)/cellHeight)
        console.log(this.pos.x, this.pos.y)
    }

    stop() {
        this.align()
        this.dir.x = 0
        this.dir.y = 0
    }

    update() {
        this.updatemouth();

        // Handle turning at intersections
        // if (this.turning && this.validFuturePos(this.nextTurn.x, this.nextTurn.y)) {
        if (this.turning) {
            if (this.validFuturePos(this.nextTurn.x, this.nextTurn.y)) {
                const xcenter = (this.x+(cellWidth/2)-gameX)%cellWidth
                const ycenter = (this.y+(cellHeight/2)-gameY)%cellHeight
                const xmargin = cellWidth*0.04
                const ymargin = cellHeight*0.04
                const xalign = this.within(xcenter, cellWidth, xmargin) || this.within(xcenter, 0, xmargin)
                const yalign = this.within(ycenter, cellHeight, ymargin) || this.within(ycenter, 0, ymargin)
                if (xalign && yalign){
                    this.dir.x = this.nextTurn.x; this.dir.y = this.nextTurn.y
                    if (this.turningQueue.length >= 1) {
                        console.log('going to next turn in queue')
                        this.nextTurn = this.turningQueue[0]
                        this.turningQueue.splice(0, 1)
                    } else {
                        this.nextTurn = {}
                        this.turning = false
                    }
                    this.align()
                    this.updatemouthangles();
                }
            } else {
                // Running into wall/border
                // If turns waiting in queue, skip this one
                if (this.turningQueue.length != 0) {
                    this.nextTurn = this.turningQueue[0]
                    this.turningQueue.splice(0, 1)
                }
            }

        }

        if ((this.x >= (gameX+(cellWidth/2))) && (this.x <= (gameX+((gridSize-1)*cellWidth)+(cellWidth/2)))
            && (this.y >= (gameY+(cellHeight/2))) && (this.y <= (gameY+((gridSize-1)*cellHeight)+(cellHeight/2)))) {
            this.x += this.dir.x*this.speed
            this.y += this.dir.y*this.speed

            this.updatepos()
            
            if (!this.validFuturePos(this.dir.x, this.dir.y)) {
                if (this.dir.x == 1) {
                    if (this.x > (gameX+(this.pos.x*cellWidth)+(cellWidth/2))) {
                        this.stop()
                        return
                    }
                } else if (this.dir.x == -1) {
                    if (this.x < (gameX+(this.pos.x*cellWidth)+(cellWidth/2))) {
                        this.stop()
                        return
                    }
                } else if (this.dir.y == 1) {
                    if (this.y > (gameY+(this.pos.y*cellHeight)+(cellHeight/2))) {
                        this.stop()
                        return
                    }
                } else if (this.dir.y == -1) {
                    if (this.y < (gameY+(this.pos.y*cellHeight)+(cellHeight/2))) {
                        this.stop()
                        return
                    }
                }
            }
        } else {
            this.stop()
        }
    }
}