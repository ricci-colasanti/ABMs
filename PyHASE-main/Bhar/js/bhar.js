var size = 40;
var caCanvas = new CACanvas(size);
var flag = false;
var nextTime = 0;
var delay = 1000;
var healthy = document.getElementById("healthy");
var over = document.getElementById("over");
var obese = document.getElementById("obese");
var speed = document.getElementById("speed");
var rlinks = document.getElementById("rlinks");
var time = []
var healthyC = []
var overweightC = []
var obeseC = []

class Person extends Agent {
    constructor(state) {
        super();
        this.state = state;
        this.locked = false;
    }

    update() {
        var count = [0, 0, 0];
        var select = [];
        var c = 0;
        this.links.forEach(function (link, index) {
            count[link.state] += 1;
        });
        var max = Math.max.apply(Math, count);
        if (max == count[0]) {
            select.push(0);
        }
        if (max == count[1]) {
            select.push(1);
        }
        if (max == count[2]) {
            select.push(2);
        }

        var nstate = this.state;
        this.state = select[rndInt(select.length)];
        return nstate != this.state;
    }
}

setup = function () {
    healthyC = []
    overweightC = []
    obeseC = []
    population = new Agents();
    var h = Number(healthy.value);
    var o = Number(over.value);
    var b = Number(obese.value);
    var atype = 2;
    var t = h + o + b;
    place = new Patches(size);
    for (i = 0; i < size * size; i++) {
        var patch = new Patch();
        var choice = rndInt(t);
        if (choice <= h) {
            atype = 0;
        }
        if (choice > h && choice <= h + o) {
            atype = 1;
        }
        if (choice > h + o) {
            atype = 2;
        }
        var agent = new Person(atype);
        patch.addAgent(agent);
        population.addAgent(agent);
        place.addPatch(patch);
    }
    const checked = document.querySelector("#check1:checked") !== null;
    if (checked == true) {
        var l = population.list.length;
        var lock = 50;
        while (lock > 0) {
            var person = population.list[rndInt(population.list.length - 1)];
            if (person.state == 0 && person.locked == false) {
                person.locked = true;
                lock--;
            }
        }
    }
    place.setNeighbors();
    place.list.forEach(function (patch, index) {
        var aperson = patch.occupant;
        if (aperson != null) {
            aperson.home.neighbors.forEach(function (npatch, i) {
                if (npatch.occupant != null) {
                    aperson.addLink(npatch.occupant);
                }
            });
        }
    });
    for (var i = 0; i < rlinks.value; i++) {
        var t = population.list[rndInt(40 * 40)];
        var f = population.list[rndInt(40 * 40)];
        t.addLink(f);
        f.addLink(t);
    }
    draw();
};

draw = function () {
    place.list.forEach(function (patch, index) {
        var person = patch.occupant;
        var col;
        if (person.links.length > 0) {
            switch (person.state) {
                case 0:
                    col = "#00ff00";
                    break;
                case 1:
                    col = "DodgerBlue";
                    break;
                case 2:
                    col = "#ff0000";
                    break;

                default:
                    col = "#000000";
            }
            var bCol = "#000000";
            if (person.locked) {
                bCol = "#FFA500";
            }
            caCanvas.draw(patch.xPos, patch.yPos, bCol, true, col);
        }
    });
    caCanvas.update("canvas");
    console.log("draw");
};

var plot = function(iterations){
    var data = [{
        x: time,
        y: healthyC,
        name: "Healthy",
        mode: "lines",
        type: "scatter",
        line: {
        color:"green"
        }
      },{
        x: time,
        y: overweightC,
        name: "Overweight",
        mode: "lines",
        type: "scatter",
        line: {
            color: "blue"
        }},{
            x: time,
            y: obeseC,
            name: "Obese",
            mode: "lines",
            type: "scatter",
            line: {
                color: "red"
            }
      }];
      
      // Define Layout
      var layout = {
        xaxis: {range: [0, ((Math.floor(iterations/100))+1)*100], title: "Time"},
        yaxis: {range: [0, size*size], title: "People"},
        title: "Weight"
      };

      Plotly.newPlot("myPlot", data, layout);
}

update = function (iteration) {
    var changes = 0;
   
    population.shuffle();
    var h = 0;
    var o = 0;
    var b = 0;
    population.list.forEach(function (person, index) {
        if (person.locked == false) {
            if (person.update()) {
                changes++;
            }
            if (person.state == 0) {
                h++;
            }
            if (person.state == 1) {
                o++;
            }
            if (person.state == 2) {
                b++;
            }
        }
    });
    time.push(iteration)
    healthyC.push(h)
    overweightC.push(o)
    obeseC.push(b)
    plot(iteration)
    draw();
    iteration++
    if (flag == true) {
        setTimeout(function () {
            window.requestAnimationFrame(function(){update(iteration)});
        }, 1000 / Number(speed.value));
    } else {
        console.log("DONE");
    }
};

stop = function () {
    flag = false;
    console.log(flag);
};
go = function () {
    flag = true;
    update(1);
};

setup();
draw();
test = function () {
    console.log("test");
};
var runBtn = document.getElementById("run");
runBtn.addEventListener("click", go);
var setupBtn = document.getElementById("setup");
setupBtn.addEventListener("click", setup);
var stopBtn = document.getElementById("stop");
stopBtn.addEventListener("click", stop);

