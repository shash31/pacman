class Pacman {
    constructor(speed) {
        this.x = gameX+(cellWidth/2)
        this.y = gameY+(cellHeight/2)
        // this.pos = { x: 0, y: 0 }

        // Mouth eating animation
        // 0 is on right side of circle and pi is on left side
        this.maxMouthBottom = Math.PI*1/4
        this.mouthbottom = this.maxMouthBottom
        this.mouthclose = 0
        this.closingmouth = true

        this.radius = cellHeight*0.3
        this.dir = { x: 0, y: 0 }
        this.nextTurn = {}
        this.turning = false
        this.speed = speed
    }

    turn(e) {
        if (!this.turning) {
            if (e.code == 'ArrowDown') {
                this.nextTurn = { x: 0, y: 1 }
            } else if (e.code == 'ArrowUp') {
                this.nextTurn = { x: 0, y: -1 }
            } else if (e.code == 'ArrowRight') {
                this.nextTurn = { x: 1, y: 0 }
            } else if (e.code == 'ArrowLeft') {
                this.nextTurn = { x: -1, y: 0 }
            } else {
                return
            }
            if (this.nextTurn.x == this.dir.x && this.nextTurn.y == this.dir.y) {
                this.nextTurn = {}
                return
            }

            // If turn is in opposite direction, we can immediately change direction
            if (this.nextTurn.x == this.dir.x || this.nextTurn.y == this.dir.y) {
                this.dir.x = this.nextTurn.x
                this.dir.y = this.nextTurn.y
                this.nextTurn = {}
                this.updatemouthangles();
                return
            }

            // Turn is adjacent; Handle at intersection
            this.turning = true
        }
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
        this.x = gameX + Math.floor((this.x - gameX)/cellWidth)*cellWidth + (cellWidth/2)
        this.y = gameY + Math.floor((this.y - gameY)/cellHeight)*cellHeight + (cellHeight/2)
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

    update() {
        this.updatemouth();

        // Handle turning at intersections
        if (this.turning) {
            const xcenter = (this.x+(cellWidth/2)-gameX)%cellWidth
            const ycenter = (this.y+(cellHeight/2)-gameY)%cellHeight
            const xmargin = cellWidth*0.04
            const ymargin = cellHeight*0.04
            const xalign = this.within(xcenter, cellWidth, xmargin) || this.within(xcenter, 0, xmargin)
            const yalign = this.within(ycenter, cellHeight, ymargin) || this.within(ycenter, 0, ymargin)
            if (xalign && yalign){
                this.dir.x = this.nextTurn.x; this.dir.y = this.nextTurn.y
                this.nextTurn = {}
                this.turning = false
                this.align()
                this.updatemouthangles();
            }

        }

        if ((this.x >= (gameX+(cellWidth/2))) && (this.x<= (gameX+((gridSize-1)*cellWidth)+(cellWidth/2)))) {
            this.x += this.dir.x*this.speed
        } else {
            if ((this.x-this.radius) > gameX){
                this.align()
            } else {
                this.x = gameX + (cellWidth/2)
            }
            this.dir.x = 0
        }

        if ((this.y >= (gameY+(cellHeight/2))) && (this.y <= (gameY+((gridSize-1)*cellHeight)+(cellHeight/2)))) {
            this.y += this.dir.y*this.speed
        } else {
            if ((this.y-this.radius) > gameY) {
                this.align()
            } else {
                this.y = gameY + (cellHeight/2)
            }
            this.dir.y = 0
        }
    }
}