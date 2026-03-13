var size = 40;
let visible_canvas = document.getElementById("canvas");
var caCanvas = new CACanvas(size);
var numberOfShops = 8
var population = []
var shops = []
var segregation = false


var setVals = function () {
    numberOfShops = Number(document.getElementById("numberOfShops").value*2);
    document.getElementById("numberOfShopsLab").innerHTML = numberOfShops
    segregation = document.getElementById("segregation").checked
}

class Home extends Patch {
    constructor(color) {
        super();
        this.color = color;
    }
}

class Person extends Agent {
    constructor(sClass, preference, color) {
        super();
        this.color = color;
        this.preference = preference
        this.sClass = sClass;
        this.shop = null
        this.shops = []
        this.id="person"
        this.shopsScore = []
    }

    distance(){
        let nearest =10000
        let shopN = null
        for (let j = 0; j < shops.length; j++) {
            let shop = shops[j]
            let xdif = Math.abs(this.xPos() - shop.xPos())
            let ydif = Math.abs(this.yPos() - shop.yPos())
            let distance = Math.sqrt(Math.abs(xdif * xdif + ydif * ydif))
            if( distance< nearest){
                shopN = shop
                nearest = distance
            }
        }
        return shopN
    }
    chooseShop(){
        this.shop = this.distance()
    }
}
class Shop extends Agent {
    constructor(sClass, price, id) {
        super();
        this.customers = 0
        this.sClass = sClass;
        this.price = price;
        this.id = "shop"
        this.color = "blue"
    }

}


var setup = function () {
    population = []
    shops = []
    var agent
    place = new Patches(size);
    for (i = 0; i < (size * size) - numberOfShops; i++) {
        var home = new Home();
        home.color = "#dddddd"
        var sclass = 0
        if(segregation==true){
            if (i< size*size / 2){
                home.color = "#aaaaaa"
                sclass = 1
            }
            console.log(segregation);
        }else{
            if (rndInt(2) == 0) {
                home.color = "#aaaaaa"
                sclass = 1
            }
        }
        agent = new Person(sclass, 0, "red");
        population.push(agent)
        agent.color = "rgb(" + rndInt(255) + "," + rndInt(255) + "," + rndInt(255) + ")"
        home.addAgent(agent)
        place.addPatch(home)
    }
    for (let i = 0; i < numberOfShops; i++) {
        let sClass=0
        var home = new Home();
        if(i<numberOfShops/2){
            sClass = 1
        }agent = new Shop(sClass, 0, i);
        agent.color = "rgb(" + rndInt(255) + "," + rndInt(255) + "," + rndInt(255) + ")"
        shops.push(agent)
        home.addAgent(agent)
        place.addPatch(home)
    }
    for (let i = 0; i < shops.length; i++) {
        const shop = shops[i];
        do{
            newPos = place.getRandomPatch()
        }while(newPos.occupant.id == "shop")
        p = newPos.occupant
        n = shop.home
        p.home = shop.home
        p.home.occupant = p
        shop.home = newPos
        newPos.occupant = shop      
    }
}

var draw = function () {
    place.list.forEach(function (home, index) {
        caCanvas.draw(home.xPos, home.yPos, home.color);
    });
    for (let i = 0; i < population.length; i++) {
        const person = population[i];
        caCanvas.drawCircle(person.xPos(), person.yPos(), person.shop.color, "black", 4, 1);
    }
    for (let i = 0; i < shops.length; i++) {
        const shop = shops[i];
        color = "darkred"
        if (shop.sClass == 1) {
            color = "darkblue"
        }
        caCanvas.drawCircle(shop.xPos(), shop.yPos(), shop.color, color, -8, 24);
    }
    caCanvas.update("canvas");
}

var chooseShop =  function(){
    for (let i = 0; i < shops.length; i++) {
        const shop = shops[i];
        shop.customers=0
    }
    for (let i = 0; i < population.length; i++) {
        const person = population[i];
        person.chooseShop()
        if(person.sClass==1){
            if (person.shop.sClass==1){
                person.shop.customers++
                person.shop.customers++
            }else{
                person.shop.customers++
            }
        }else{
            if (person.shop.sClass==0){
                person.shop.customers++
            }else{
                person.shop.customers+=0.5
            }
        }
    }
}

var relocate = function(){
    let min = 100000
    let shopL = null
    for (let i = 0; i < shops.length; i++) {
        const shop = shops[i];
        if( shop.customers<min){
            shopL = shop
            min = shop.customers
        }
    }
    do{
        newPos = place.getRandomPatch()
    }while(newPos.occupant.id == "shop")
    p = newPos.occupant
    n = shopL.home
    p.home = shopL.home
    p.home.occupant = p
    shopL.home = newPos
    newPos.occupant = shopL
    shopL.sClass = rndInt(2)
}

var count = 0
var update = function () {
    draw()
    relocate()
    chooseShop()
    count++
    if(running){

    setTimeout(function () {
        window.requestAnimationFrame(update);
    }, 200);
}
    
};
var reset = function () {
    setup()
    chooseShop()
    draw()
}

var running = false;
var run = function(){
    if ( running){
        running = false
        let but = document.getElementById("running").innerHTML=" Run "
    }else{
        running = true
        let but = document.getElementById("running").innerHTML="Stop"
        update()
    }
} 
setup()
chooseShop()
draw()