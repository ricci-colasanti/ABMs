var size = 80;
var caCanvas = new CACanvas(size);
var count = 0
var population
var place
var likeness = 0.4
var density = 1.00
var rNumber = 0.6
var sickDays = 7
var immuneDays = 30
var links =0.0
var speed = 100

var infected=[]
var recovered=[]
var suspectable=[]
var time=[]
    

var setVals = function () {
    rNumber = Number(document.getElementById("R").value)/100;
    links = Number(document.getElementById("links").value)/1000;
   // sickDays = Number(document.getElementById("sick").value);
   // immuneDays = Number(document.getElementById("immune").value);
  //  density = Number(document.getElementById("pop").value);
  //  size = Number(document.getElementById("size").value);
   

    //document.getElementById("sizelable").innerHTML = parseFloat(size).toFixed(0).toLocaleString()
    document.getElementById("Rlable").innerHTML = parseFloat(rNumber).toFixed(1).toLocaleString()
    document.getElementById("linkslable").innerHTML = parseFloat(links).toFixed(3).toLocaleString()
    //document.getElementById("sicklable").innerHTML = parseFloat(sickDays).toFixed(0).toLocaleString()
    //document.getElementById("immunelable").innerHTML = parseFloat(immuneDays).toFixed(0).toLocaleString()
    //document.getElementById("poplable").innerHTML = parseFloat(density).toFixed(1).toLocaleString()
    //density = density / 100
}

var reset = function () {
    count = 0
    setVals()
    setup()
    update()

}

class Home extends Patch {
    makeNewLinks(population) {
        let oldLink = rndInt(this.numberOfNeighbors)
        let newLink = rndInt(population.size)
        this.neighbors[oldLink] = population.list[newLink]
        return population.list[newLink]
    }
    rndOccupant() {
        return this.neighbors[rndInt(this.numberOfNeighbors)].occupant
    }
    getNeighborOccupant(i) {
        return this.neighbors[i].occupant
    }
    numberOfNeighbours(){
        return this.neighbors.length;
    }
}

class Person extends Agent {
    constructor(state) {
        super();
        this.state = state;
        this.daysIll = 0
        this.daysRecovered = 0
        this.watt = null;
    }
    makeNewLinks(population) {
        this.watt = this.home.makeNewLinks(population)
    }
    infect() {
        this.state = 1
        this.daysIll = sickDays
    }
    recover() {
        this.state = 2;
        this.daysRecovered = immuneDays
    }
    susceptible() {
        this.state = 0;
    }


    pathology(rNumber) {
        if (this.state == 1) {
            if (Math.random() < rNumber) {
                let contact = this.home.rndOccupant();
                if ((contact != null) && (contact.state == 0)) {
                    contact.infect()
                }
            }
            this.daysIll--;
            if (this.daysIll == 0) {
                this.recover()
            }
        }
        if (this.state == 2) {
            this.daysRecovered--;
            if (this.daysRecovered == 0) {
                this.susceptible()
            }
        }
    }

}


var setup = function () {
    infected=[1]
    recovered=[0]
    suspectable=[6000]
    time=[0]
    
    caCanvas = new CACanvas(size);
    population = new Agents();
    place = new Patches(size);
    for (i = 0; i < size * size; i++) {
        var patch = new Home();
        if (Math.random() < density) {
            var agent = new Person(0);
            patch.addAgent(agent);
            population.addAgent(agent);
        }
        place.addPatch(patch)
    }
    place.setNeighbors();
    
    for (let i = 0; i < population.size; i++) {
        if(Math.random()<links){
            console.log("links");
            population.list[i].makeNewLinks(place);
        }
    }
    
    var person = null
    while(person == null){
        person = place.list[rndInt(place.size)].occupant
    }
    person.infect()
    plot(100)
}


var plot = function(iterations){

    var data = [{
        x: time,
        y: suspectable,
        name: "Suspectable",
        mode: "lines",
        type: "scatter",
        line: {
            color: "green"
        }},{
            x: time,
            y: infected,
            name: "Infected",
            mode: "lines",
            type: "scatter",
            line: {
            color:"red"
            }
          },{
            x: time,
            y: recovered,
            name: "Recovered",
            mode: "lines",
            type: "scatter",
            line: {
                color: "#b1b1ff"
            }
      }];
      
      // Define Layout
      var layout = {
        xaxis: {range: [0, Math.max(((Math.floor(iterations/100)+1)*100),100)], title: "Time"},
        yaxis: {range: [0, size*size], title: "People"},
        title: "Infections"
      };
      
      // Display using Plotly
      Plotly.newPlot("myPlot", data, layout);
}


var draw = function () {
    var bCol = "##000000";
    place.list.forEach(function (patch, index) {
        var person = patch.occupant;
        var col;
        if (person != null) {
            col = col = "#ff0000";
            if (person.state == 0) {
                col = "#00ff00";
            }
            if (person.state == 1) {
                col = "#ff0000";
            }
            if (person.state == 2) {
                col = "#b1b1ff";
            }
            caCanvas.draw(patch.xPos, patch.yPos,bCol,true, col);
            if(person.watt!=null){
                caCanvas.drawLine(patch.xPos, patch.yPos,person.watt.xPos,person.watt.yPos,"#6666dd",3)
            }
        }


    });
    caCanvas.update("canvas");

};



var update = function (iteration) {
    //population.shuffle()
    caCanvas.clear()
    let countS=0
    let countI=0
    let countR=0
    //console.log("update",population.list.length);
    for (let i = 0; i < population.list.length; i++) {
        var person = population.list[i]
        person.pathology(rNumber)

        if(person.state==0){
            countS++
        }
        if(person.state==1){
            countI++
        }
        if(person.state==2){
            countR++
        }
       
    }
    suspectable.push(countS)
    infected.push(countI)
    recovered.push(countR)
    time.push(iteration)
    draw();
    plot(iteration)
    iteration++
    if ( running == true) {
        setTimeout(function () {
            window.requestAnimationFrame(function(){update(iteration)});
        },0);
        count++
    }
};

var running = false;
var run = function(){
    if ( running){
        running = false
        let but = document.getElementById("running").innerHTML=" Run "
    }else{
        running = true
        let but = document.getElementById("running").innerHTML="Stop"
        update(1)
    }
} 

setup()
draw()