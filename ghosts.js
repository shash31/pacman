class Ghost {
    constructor(x, y, color, speed) {
        this.x = gameX + x*cellWidth + cellWidth/2
        this.y = gameY + y*cellHeight + cellHeight/2
        this.radius = cellHeight*0.3
        this.color = color

        this.dir;
        this.speed = speed
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
}