/*
 * utils 
 */


function rnd(multi=1){
	return Math.random() * multi;
}

function rndInt(max){
	return Math.floor(rnd(max+1));
}

function log(line){
	console.log(line);
}

function shuffleArray(array) {
  	let l  = array.length;
	while ( l !==0) {
    		let r = rndInt(l-1);
    		l -= 1;
    		let tmp = array[l];
    		array[l] = array[r];
    		array[r] = tmp;
  	}
  	return array;
}

function bounds(v,size){
	if(v<0){
		return size+v
	}
	if(v>size){
		return v-size
	}
	return v
}



/* 
 * data types
 */


function Agent(home,color){
	this.home = home;
	this.color = color;
};

function Patch(xPos,yPos){
	this.xPos = xPos;
	this.yPos = yPos;
	this.occupant = null;
}



/*
 * model functions
 */ 

function setGrid(density,size,grid,population){
	let x,y;
	for(x=0;x<=size;x++){
		grid.push([]);
		for(y=0;y<=size;y++){
			let p = new Patch(x,y);
			grid[x].push(p);
			if(rnd()<density){
				let a = new Agent(p,rndInt(1));
				p.occupant = a;
				population.push(a)
			}
		}
	}
}


function output(size,grid){
	let x,y;
	for(x in grid){
		let line=""
		for(y in grid[x]){
			let a = grid[x][y].occupant;
			if (a==null){
				line+=" * "
			}else{
				line+=" "+a.color+" "
			}
		}
		log(line)
	}
}



function iterate(happy,size,grid,population){
	function getEmpty(){
		let x,y;
		do{
			x = rndInt(size);
			y = rndInt(size);
		}while(grid[x][y].occupant!=null)
		return grid[x][y];
	}

	function sameAs(agent){
		let x = agent.home.xPos;
		let y = agent.home.yPos;
		let c= agent.color;
		let xx,yy;
		let count=0
		for(xx=x-1;xx<=x+1;xx++){
			for(yy=y-1;yy<y+1;yy++){
				let xn=bounds(xx,size)
				let yn=bounds(yy,size)
				let o = grid[xn][yn].occupant
				if(o!=null){
					if(o.color == agent.color){
						count++;
					}
				}
			}
		}
		return count/8;
	}

	population = shuffleArray(population)
	let p;
	for( p in population){
		let a = population[p];
		let s = sameAs(a); 
		if( s<happy){
			let h =  getEmpty()
			a.home.occupant = null;
			h.occupant = a;
			a.home = h;
		}
	}
}

function test(population){
	let p
	let c = [0,0]
	for(p in population){
		let a = population[p]
		if(a!=null){
			c[a.color]++
		}
	}
	log(c)
}

/*
 * run
 */

let grid = [];
let population = [];
let size = 19;
let happy = 0.5
let density = 0.9
let iterations = 2
let t=0

setGrid(density,size,grid,population);
output(size,grid);
test(population)
while (t<iterations){
	log("");
	iterate(happy,size,grid,population);
	output(size,grid);
	test(population)
	t++;
}

