console.log("Main");
var size = 50
var caCanvas = new CACanvas(size)
let population = []
let shops = []
let numberOfShops = 10;
var weightPrice = 0.2;
var weightDistance = 0.5;
var weightHabit = 0.1;
var weightPreferance = 0.2;
var random = 0.1;

function setVals() {
    weightPrice = Number(document.getElementById("price").value);
    weightDistance = Number(document.getElementById("distance").value);
    weightHabit = Number(document.getElementById("habit").value);
    weightPreferance = Number(document.getElementById("preferance").value);
    random = Number(document.getElementById("noise").value) / 100;
    total = weightPrice + weightDistance + weightHabit + weightPreferance;
    weightPrice = weightPrice / total
    weightDistance = weightDistance / total
    weightHabit = weightHabit / total
    weightPreferance = weightPreferance / total
    // console.log(weightPrice,weightDistance,weightHabit,weightPreferance);
}

const popMap = makeArray(50, 50, null)
const shopMap = makeArray(50, 50, null)

function makeArray(w, h, val) {
    var arr = [];
    for (let i = 0; i < h; i++) {
        arr[i] = [];
        for (let j = 0; j < w; j++) {
            arr[i][j] = val;
        }
    }
    return arr;
}
class FILOSet {
    constructor(size) {
        this.dataArray = [];
        this.size = size;
    }

    add(value) {
        // test if the set is full
        if (this.dataArray.length < this.size) {
            this.dataArray.unshift(value);
        } else {
            // if not get index of new element
            this.dataArray.pop();
            this.dataArray.unshift(value);
        }
    }
    lastVisit(value) {
        return this.dataArray.indexOf(value)
    }

    toString() {
        let s = "";
        for (let d in this.dataArray) {
            s += this.dataArray[d].toString() + " ";
        }
        return s;
    }
}



class Person {
    constructor(income, preferance, xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.homeXPos = xPos;
        this.homeYPos = yPos;
        this.income = income;
        this.previousVisits = new FILOSet(4)
        this.preferance = preferance
        this.choice = null
    }

    shop(shops, workings = false) {
        let length = shops.length;
        let best = 0
        let score = 0
        this.choice = null;
        for (let i = 0; i < length; i++) {
            const shop = shops[i]
            // distance weight 0.5
            const d = shop.distance(this) * weightDistance
            // food preferance
            const f = shop.preferance(this) * weightPreferance
            // price
            const w = shop.priceTest(this) * weightPrice
            // habit
            const lastVisit = this.previousVisits.lastVisit(shop)
            let h = 0
            if (lastVisit >= 0) {
                h += (5 - lastVisit) / 5 * weightHabit
            }

            // noise
            const r = Math.random() * random
            // select
            score = d + f + w + h + r
            if (workings) {
                console.log(shop.xPos, shop.yPos, d.toFixed(2), f.toFixed(2), w.toFixed(2), h.toFixed(2), r.toFixed(2), score.toFixed(2));
            }
            if (score > best) {
                best = score
                this.choice = shop
            }

        }
        if (workings) {
            console.log(this.choice.xPos, this.choice.yPos, best.toFixed(2));
        }


        this.previousVisits.add(this.choice)
    }
}


class Shop {
    constructor(xPos, yPos, type, price) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.type = type;
        this.price = price;
        this.visits = 0
    }

    distance(person) {
        let dx = Math.abs(this.xPos - person.xPos)
        let dy = Math.abs(this.yPos - person.yPos)
        if (dy > size / 2) {
            dy = size - dy
        }
        if (dx > size / 2) {
            dx = size - dx
        }
        const d = Math.sqrt((dx * dx) + (dy * dy))
        //console.log(d);
        if (d == 0) {
            return 1
        }
        if (person.income == 0) {
            return 1 - (d / 130)
        }
        return 1 - d / 30
    }

    preferance(person) {
        if (this.type == 1) {
            return person.preferance
        }
        return 1 - person.preferance
    }

    priceTest(person) {
        if (this.price == 0) {
            return weightPrice
        }
        if (person.income == 0) {
            return 0.1
        }
        return 0.8
    }
}



setup = function () {
    population = []
    shops = []
    // create shops random placement random type
    for (let i = 0; i < numberOfShops; i++) {
        const xPos = rndInt(size)
        const yPos = rndInt(size)
        const shopType = rndInt(2)
        const price = rndInt(2)
        const shop = new Shop(xPos, yPos, shopType, price)
        shops.push(shop)
        shopMap[xPos][yPos] = shop
    }
    // create households grid placment random type
    for (let x = 0; x < 50; x++) {
        for (let y = 0; y < 50; y++) {
            const income = rndInt(2)
            let person = null
            if (income == 0) {
                const pref = Math.random() * 0.6
                person = new Person(0, pref, x, y)
            } else {
                const pref = Math.random() * 0.6 + 0.4
                person = new Person(1, pref, x, y)
            }
            popMap[x][y] = person
            population.push(person)
        }
    }
    draw();
}




draw = function (show = false, p = 0) {
    caCanvas.clear("lightgrey")
    let length = population.length;
    for (let i = 0; i < length; i++) {
        let person = population[i]
        let col = "red"
        if (person.income == 0) {
            col = "rgb(255," + person.preferance * 255 + "," + person.preferance * 255 + ")"
        } else {
            col = "rgb(" + person.preferance * 255 + "," + person.preferance * 255 + ",255)"
        }
        caCanvas.drawCircle(person.xPos, person.yPos, col, 2);
    }
    if (show == true) {
        let person = population[p]
        console.log(person.xPos, person.yPos, person.choice.xPos, person.choice.yPos)
        caCanvas.drawLine(person.xPos, person.yPos, person.choice.xPos, person.choice.yPos, "#000000");
    }
    length = shops.length;
    for (let i = 0; i < length; i++) {
        let shop = shops[i]
        var col = "orange"
        if (shop.type == 1) { col = "green" }
        caCanvas.drawSquare(shop.xPos, shop.yPos, col)
    }

    caCanvas.update("canvas");
}



update = function () {
    let length = population.length;
    for (let i = 0; i < length; i++) {
        let person = population[i]
        person.shop(shops);//,i==25*25)
    }
    draw(show = true, 25 * 25);
}

stop = function () {
    flag = false;
    console.log(flag);
}
go = function () {
    flag = true;
    update()
}

function getCursorPosition(canvas, event) {
    setVals()
    update()
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left) / 10)
    const y = Math.floor((event.clientY - rect.top) / 10)
    const person = popMap[x][y]
    console.log(popMap[x][y])
    person.shop(shops, true)
    if (shopMap[x][y] != null) {
        draw();
        const shop = shopMap[x][y]
        const length = population.length
        for (let i = 0; i < length; i++) {
            const p2 = population[i]
            if (p2.choice == shop) {
                caCanvas.drawLine(p2.xPos, p2.yPos, p2.choice.xPos, p2.choice.yPos, "#000000");
                console.log("*");
            }
        }
        caCanvas.update("canvas");
    } else {
        draw(true, x * 50 + y)
    }
}


const canvas = document.querySelector('canvas')
canvas.addEventListener('mousedown', function (e) {
    getCursorPosition(canvas, e)
})

setup();
update();
