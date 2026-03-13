class Ghost {
    constructor(x, y, color, speed) {
        this.x = gameX + x*cellWidth + cellWidth/2
        this.y = gameY + y*cellHeight + cellHeight/2
        this.pos = { x: x, y: y}
        this.radius = cellHeight*0.3
        this.color = color

        this.dir = { x: 0, y: 0 }
        this.nextTurn = undefined;
        this.speed = speed
        this.newdir()
    }

    newdir() {
        let availableDirs = [{x:-1,y:0}, {x:1,y:0}, {x:0, y:1}, {x:0,y:-1}]
        for (let i = 0; i < availableDirs.length; i++) {
            if (!this.validFuturePos(availableDirs[i].x, availableDirs[i].y)) {
                availableDirs.splice(i, 1)
                i--;
            }
        }
        console.log(`available dirs at ${this.pos.x}, ${this.pos.y}`)
        console.log(availableDirs)
        
        // Pick random valid direction
        this.nextTurn = availableDirs[Math.floor(Math.random()*availableDirs.length)]
    }

    validFuturePos(xdir, ydir) {
        const futureposx = this.pos.x+xdir; const futureposy = this.pos.y+ydir;
        if (this.inbounds(futureposx, futureposy) && (grid[futureposy][futureposx] != 'W')) return true
        return false
    }

    inbounds(x, y) {
        if ((0 <= x) && (x < gridWidth) && (0 <= y) && (y < gridHeight)) return true
        return false
    }

    draw() {
        c.fillStyle = this.color
        c.beginPath();
        c.arc(this.x, this.y, this.radius, Math.PI, 0)
        c.lineTo(this.x+this.radius, this.y+this.radius)

        let npoints = 3
        let division = this.radius*2/npoints
        let height = this.radius*0.6
        for (let i = 0; i < npoints; i++) {
            c.lineTo(this.x+this.radius-((i+1)*division) + division/2, this.y+height)
            c.lineTo(this.x+this.radius-((i+1)*division), this.y+this.radius)
        }
        c.lineTo(this.x-this.radius, this.y)
        c.stroke()
        c.fill()

        // Eyes
        c.fillStyle = 'white'
        const xdist = this.radius*Math.cos(Math.PI/4)/2
        const ydist = this.radius*Math.sin(Math.PI/4)/2
        c.beginPath()
        c.arc(this.x-xdist, this.y-ydist, 2, 0, Math.PI*2)
        c.stroke()
        c.fill()
        c.beginPath()
        c.arc(this.x+xdist, this.y-ydist, 2, 0, Math.PI*2)
        c.stroke()
        c.fill()
    }

    align() {
        this.x = gameX + this.pos.x*cellWidth + (cellWidth/2)
        this.y = gameY + this.pos.y*cellHeight + (cellHeight/2)
    }

    updatepos() {
        this.pos.x = Math.floor((this.x - gameX)/cellWidth)
        this.pos.y = Math.floor((this.y - gameY)/cellHeight)
    }

    update() {
        if ((this.x >= (gameX+(cellWidth/2))) && (this.x <= (gameX+((gridWidth-1)*cellWidth)+(cellWidth/2)))
            && (this.y >= (gameY+(cellHeight/2))) && (this.y <= (gameY+((gridHeight-1)*cellHeight)+(cellHeight/2)))) {
            
            this.updatepos()
            
            if (this.nextTurn) {
                const xcenter = (this.x+(cellWidth/2)-gameX)%cellWidth
                const ycenter = (this.y+(cellHeight/2)-gameY)%cellHeight
                const xmargin = cellWidth*0.04
                const ymargin = cellHeight*0.04
                const xalign = Math.abs(xcenter-cellWidth) <= xmargin || Math.abs(xcenter) <= xmargin
                const yalign = Math.abs(ycenter-cellHeight) <= ymargin || Math.abs(ycenter) <= ymargin
                if (xalign && yalign){
                    this.dir.x = this.nextTurn.x; this.dir.y = this.nextTurn.y
                    this.nextTurn = undefined
                    this.align()
                }
            }

            this.x += this.dir.x*this.speed
            this.y += this.dir.y*this.speed

            if (!this.validFuturePos(this.dir.x, this.dir.y)) {
                this.newdir()
            } else {
                // 1% chance to change direction
                if (Math.random() < 0.01) {
                    console.log('randomly changing direction')
                    this.newdir()
                }
            }
        } else {
            this.align()
            this.newdir()
        }
    }
}