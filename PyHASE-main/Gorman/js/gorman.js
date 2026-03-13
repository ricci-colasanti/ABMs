console.log("gorman");
var size = 40;
population= 300
pubs = 0
var caCanvas = new CACanvas(size);
var probStart = 0.5
var probStop = 0.3

var area=[]
var people = []

var time=[]
var drinkers=[]
var suspectable=[]
var former=[]
var ticks = 0

document.getElementById("population").value = population;
document.getElementById("populationlable").innerHTML = population
document.getElementById("pubs").value =  pubs 
document.getElementById("pubslable").innerHTML = pubs
document.getElementById("quit").value = probStop * 100; 
document.getElementById("quitlable").innerHTML = probStop
document.getElementById("restart").value = probStart * 100
document.getElementById("restartlable").innerHTML = probStart


var setVals = function () {
    let val = Number(document.getElementById("population").value);
    document.getElementById("populationlable").innerHTML = val
    val = Number(document.getElementById("pubs").value);
    document.getElementById("pubslable").innerHTML = val
    val = Number(document.getElementById("quit").value);
    document.getElementById("quitlable").innerHTML = val/100.0
    val = Number(document.getElementById("restart").value);
    document.getElementById("restartlable").innerHTML = val/100.0
}


class Person extends Agent {
    constructor(sClass, preference, color) {
        super();
        this.color = color;
        this.drinkState = "suspectable"
    }
    infect(){
        let total = this.home.getNumberOfOccupants()
        if(this.drinkState=="suspectable"){
            let c = this.home.countTypesAt("current")
            if (Math.random()< c/total) {
                this.drinkState = "current"
            }
        }else if(this.drinkState=="current"){
            let f = this.home.countTypesAt("former")
            if (Math.random()< (f/total+probStop)) {
                this.drinkState = "former"
            }
        }else if(this.drinkState=="former"){
            let c = this.home.countTypesAt("current")
            if (Math.random()< (c/total+probStart)) {
                this.drinkState = "current"
            }
        }
    }
}


class Place extends Patch{
    constructor(){
        super()
        this.pub=false
        this.gradient=0.0
    }

    diffuse(amount){
        if(this.gradient>=amount){
            return
        }
        this.gradient = amount
        for (let i = 0; i < this.neighbors.length; i++) {
            this.neighbors[i].diffuse(amount/8);
        }
    }

    getMost(){
        let max = 0
        let target = null
        for (let i = 0; i < this.neighbors.length; i++) {
            if(this.neighbors[i]!=this){
                if(this.neighbors[i].gradient>max){
                    max = this.neighbors[i].gradient;
                    target = this.neighbors[i]
                }
            }
        }
        return target
    }

    countTypesAt(type){
        let count = 0
        for (let i = 0; i < this.occupants.length; i++) {
            if (this.occupants[i].drinkState==type){
                count ++
            };
        }
        return count
    }
}


var setup = function(){
    ticks = 0
    area=[]
    people = []

    time=[]
    drinkers=[]
    suspectable=[]
    former=[]


    population =  Number(document.getElementById("population").value)
    pubs =  Number(document.getElementById("pubs").value)
    probStart =  Number(document.getElementById("restart").value)/100.0
    probStop = Number(document.getElementById("quit").value)/100.0

    var patches = new Patches(size);
    for (i = 0; i < size * size; i++) {
        var place = new Place();
        patches.addPatch(place)
    }
    patches.setNeighbors()
    area = patches.list
    for (let i = 0; i < pubs; i++) {
        area[rndInt(size*size)].diffuse(1)    
    }
    for(let i = 0; i < population; i++ ){
        let person = new Person()
        person.drinkState="suspectable"
        people.push(person)
        area[rndInt(size*size)].addAgentTo(person)
    }
    let person = new Person()
    person.drinkState="current"
    people.push(person)
    area[rndInt(size*size)].addAgentTo(person)
}

var draw = function(){
    for (let i = 0; i < area.length; i++) {
        const place = area[i];
        const c = 255*place.gradient
        d = 220-c
        const color = "rgb("+220+","+d+","+220+")" 
        caCanvas.draw(place.xPos, place.yPos, color);
    }
    for (let i = 0; i < people.length; i++) {
        const person = people[i];
        var color = "green"
        if(person.drinkState ==  "current"){
            color = "red"
        }
        if(person.drinkState ==  "former"){
            color = "blue"
        }
        caCanvas.drawCircle(person.xPos(), person.yPos(),color, "black", 4, 1);
    }
    caCanvas.update("canvas");
}

var plot = function(iterations){

    var data = [{
        x: time,
        y: drinkers,
        name: "Current",
        mode: "lines",
        type: "scatter",
        line: {
        color:"red"
        }
      },{
        x: time,
        y: suspectable,
        name: "Suspectable",
        mode: "lines",
        type: "scatter",
        line: {
            color: "green"
        }},{
            x: time,
            y: former,
            name: "Former",
            mode: "lines",
            type: "scatter",
            line: {
                color: "blue"
            }
      }];
      
      // Define Layout
      var layout = {
        xaxis: {range: [0, ((Math.floor(iterations/100))+1)*100], title: "Time"},
        yaxis: {range: [0, population], title: "People"},
        title: "Drinking state"
      };
      
      // Display using Plotly
      Plotly.newPlot("myPlot", data, layout);
}

var update = function(iterations){
    var countC = 0
    var countS = 0
    var countF = 0
    
    
    for (let i = 0; i < people.length; i++) {
        const person = people[i];
        let home = person.home 
        if( person.drinkState == "current"){
            if((pubs>0)&&( Math.random()<0.5)){
                nhome = home.getMost();
            }else{
                nhome = home.getRandomNeighbor()
            }
        }else{
            nhome = home.getRandomNeighbor()
        }
        home.removeAgentFrom(person)
        nhome.addAgentTo(person)
        person.infect()
        if(person.drinkState == "current"){
            countC++
        }
        if(person.drinkState == "suspectable"){
            countS++
        }
        if(person.drinkState == "former"){
            countF++
        }
    }
    time.push(iterations)
    drinkers.push(countC)
    suspectable.push(countS)
    former.push(countF)
    iterations++;
    ticks = iterations;
    draw()
    plot(iterations)
    if ( running == true)   {
        setTimeout(function () {
            window.requestAnimationFrame(function(){update(iterations)});
        }, 200- document.getElementById("speed").value);
    }
}

setup()
draw()
var running = false;
var run = function(){
    if ( running){
        running = false
        let but = document.getElementById("running").innerHTML=" Run "
    }else{
        running = true
        let but = document.getElementById("running").innerHTML="Stop"
        update(ticks)
    }
} 
