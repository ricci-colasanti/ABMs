function rndInt(maxVal) {
    return Math.floor(Math.random() * maxVal);
}

class CACanvas {
    constructor(size, cSize = 20) {
        this.size = size;
        this.cSize = cSize;
        this.buffer = document.createElement("canvas");
        this.buffer.width = this.size * this.cSize;
        this.buffer.height = this.size * this.cSize;
        this.ctx = this.buffer.getContext("2d");
    }

    draw(x, y, cellColor, circle = false, circleColor = "#000000") {
        this.ctx.beginPath();
        this.ctx.rect(x * this.cSize, y * this.cSize, this.cSize, this.cSize)
        this.ctx.fillStyle = cellColor;
        this.ctx.fill();
        if (circle === true) {
            let offset = Math.floor(this.cSize / 2);
            this.ctx.beginPath();
            this.ctx.arc(x * this.cSize + offset, y * this.cSize + offset, offset - 1, 0, 2 * Math.PI)
            this.ctx.fillStyle = circleColor;
            this.ctx.fill();
            this.ctx.strokeStyle = '#000000';
            this.ctx.stroke();

        }
    }

    drawLine(x1,y1,x2,y2){
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#000000';
        let offset = Math.floor(this.cSize / 2);
        this.ctx.moveTo(x1 * this.cSize+offset, y1 * this.cSize+offset)
        this.ctx.lineTo(x2 * this.cSize+offset, y2 * this.cSize+offset)
        this.ctx.stroke();
    }

    update(canvasID) {
        let visible_canvas = document.getElementById(canvasID);
        let vctx = visible_canvas.getContext("2d");
        vctx.drawImage(this.buffer, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height, 0, 0, vctx.canvas.width, vctx.canvas.height);
    }
}


class Patches {
    /* single list contaner for patch
    has dimentions and functions for converting x y coordinates to 1d
    */
    constructor(size) {
        this.list = new Array();
        this.xMax = size;
        this.yMax = size;
        this.size = size * size;
    }

    coordinates(num) {
        let x = num % this.xMax;
        let y = Math.floor(num / this.yMax);
        return { x: x, y: y };
    }

    addPatch(patch) {
        this.list.push(patch);
        let point = this.list.length - 1;
        let coord = this.coordinates(point);
        patch.xPos = coord.x;
        patch.yPos = coord.y;
        // console.log(patch.x);
    }

    xBounds(x) {
        if (x < 0) {
            return this.xMax + x;
        }
        if (x >= this.xMax) {
            return x - this.xMax;
        }
        return x;
    }

    yBounds(y) {
        if (y < 0) {
            return this.yMax + y;
        }
        if (y >= this.yMax) {
            return y - this.yMax;
        }
        return y;
    }

    position(x, y) {
        return y * this.yMax + x;
    }

    getPatch(x, y) {
        var p = this.position(x, y)
        //console.log(p);
        return this.list[p]
    }

    setNeighbors() {
        for (i = 0; i < this.list.length; i++) {
            let neighbors = new Array();
            let patch = this.list[i];
            let coord = this.coordinates(i);
            for (let x = coord.x - 1; x <= coord.x + 1; x++) {
                let xx = this.xBounds(x);
                for (let y = coord.y - 1; y <= coord.y + 1; y++) {
                    let yy = this.yBounds(y);
                    let pos = this.position(xx, yy)
                    if (patch !== this.list[pos]) {
                        patch.neighbors.push(this.list[pos])
                    }
                }
            }
        }
    }
}



class Patch {
    constructor() {
        this.xPos = 0;
        this.yPos = 0;
        this.neighbors = new Array();
        this.occupant = null
    }

    addAgent(agent) {
        this.occupant = agent;
        agent.home = this;
        // console.log(this,agent);
    }
}

class Agent {
    constructor() {
        this.home = null
        this.links = new Array();
    }

    addLink(anAgent) {
        this.links.push(anAgent);
    }
    xPos(){
        if (this.home != null) {    
            return this.home.xPos;
        }
        return 0
    }

    yPos(){
        if (this.home != null) {    
            return this.home.yPos;
        }
        return 0
    }

}


class Agents {
    constructor() {
        this.list = new Array();
    }
    addAgent(anAgent) {
        this.list.push(anAgent);
    }

    shuffle() {
        let currentIndex = this.list.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [this.list[currentIndex], this.list[randomIndex]] = [
            this.list[randomIndex], this.list[currentIndex]];
        }

      }
}