import random
class Agent:
    def __init__(self,color):
        self.home = None
        self.color  = color
        self.point=0

    def right(self):
        self.point+=1
        if self.point>= self.home.number_neighbours:
            self.point=0
        self.move(self.home.neighbours[self.point])

    def left(self):
        self.point-=1
        if self.point<0:
            self.point=self.home.number_neighbours-1
        self.move(self.home.neighbours[self.point])
    
    def random(self):
        pos = random.randint(0,4)
        self.move(self.home.neighbours[pos])


    def move(self,cell):
        if self.home!= None:
            self.home.occupants[cell.t_next]=None
        cell.occupants[cell.t_next]=self
        self.home=cell

    def getHome(self):
        return self.home

    def moveRandom(self):
        cell = self.home.getRandom()
        self.move(cell)

    def moveBest(self,state):
        cell = self.home.search(state)
        self.move(cell)

    def getState(self,state):
        return self.home.getState(state)
    
    def setState(self,state,value):
        return self.home.setNState(state,value)



class Cell:
    t_now = 0
    t_next = 1

    @staticmethod
    def update():
        Cell.t_now, Cell.t_next = Cell.t_next, Cell.t_now

    def __init__(self,x_pos,y_pos,states,values):
        self.neighbours = []
        self.x_pos = x_pos
        self.y_pos = y_pos
        self.occupants = [None,None]
        self.number_neighbours =0
        self.states=[{},{}]
        for s in range(len(states)):
            if values[s]=="rnd":
                v = random.random()
                self.states[0][states[s]]= v
                self.states[1][states[s]]= v
            else:
                self.states[0][states[s]]=values[s]
                self.states[1][states[s]]=values[s]

    def search(self,state):
        found = self
        for cell in self.neighbours:
            if cell.occupants[Cell.t_next]== None:
                if cell.states[Cell.t_now][state]>found.states[Cell.t_now][state]:
                    found = cell
        return found

    def setAgent(self,agent):
        agent.move(self)
        self.occupants[Cell.t_next]=agent

    def getRandom(self):
        return random.choice(self.neighbours)

    def getAgent(self,agent):
        return self.occupants[Cell.t_now]

    def isOccupied(self):
        return self.occupants[Cell.t_next]!=None

    def setState(self,state,value):
        self.states[Cell.t_next][state]=value

    def setNState(self,state,value):
        self.states[Cell.t_now][state]=value



    def getState(self,state):
        return self.states[Cell.t_now][state]

    def isState(self,state,value):
        return self.states[Cell.t_now][state]==value


    def preDiffuse(self,state):
        self.states[Cell.t_next][state]=0

    def diffuse(self,state,fraction):
        amount = self.states[Cell.t_now][state]
        self.states[Cell.t_next][state]+= self.states[Cell.t_now][state]-amount
        t_amount = amount
        amount = amount/self.number_neighbours
        for cell in self.neighbours:
            cell.states[Cell.t_next][state]+=amount
            t_amount-=amount
        self.states[Cell.t_next][state]+=t_amount

    def addNeighbour(self,cell):
      self.neighbours.append(cell)
      self.number_neighbours+=1

    def addOccupant(self,occupant):
      self.occupants[Cell.t_now]=occupant
      self.occupants[Cell.t_next]=occupant

    def count(self,state,value):
        count = 0
        for cell in self.neighbours:
            if cell.states[Cell.t_now][state]==value:
                count+=1
        return count

class World:
    frame = 0.01
    def __init__(self,size,states,values,n_type=8):
        self.size = size
        self.cells=[]
        self.agents=[]
        for i in range(self.size*self.size):
            self.cells.append(Cell((i%self.size),int(i/self.size),states,values))
        if n_type == 8:    
            for cell in self.cells:
                for  y in range(cell.y_pos-1,cell.y_pos+2):
                    for  x in range(cell.x_pos-1,cell.x_pos+2):
                        x=self.bounds(x)
                        y=self.bounds(y)
                        if (cell.x_pos!=x) or (cell.y_pos!=y):
                            pos = y*self.size+x
                            cell.addNeighbour(self.cells[pos])
        else:
            for cell in self.cells:                
                x=self.bounds(cell.x_pos)
                y=self.bounds(cell.y_pos-1)
                pos = y*self.size+x
                cell.addNeighbour(self.cells[pos])
                x=self.bounds(cell.x_pos+1)
                y=self.bounds(cell.y_pos)
                pos = y*self.size+x
                cell.addNeighbour(self.cells[pos])
                x=self.bounds(cell.x_pos)
                y=self.bounds(cell.y_pos+1)
                pos = y*self.size+x
                cell.addNeighbour(self.cells[pos])
                x=self.bounds(cell.x_pos-1)
                y=self.bounds(cell.y_pos)
                pos = y*self.size+x
                cell.addNeighbour(self.cells[pos])
                

    def addAgent(self,x,y,color='blue'):
        pos = y*self.size+x
        agent = Agent(color)
        self.agents.append(agent)
        self.cells[pos].setAgent(agent)
        

    def setCell(self,x,y,state,value):
        pos = y*self.size+x
        self.cells[pos].setState(state,value)

    def setState(self,x,y,state,value):
        pos = y*self.size+x
        self.cells[pos].state(state,value)        

    def getCell(self,x,y):
        pos = y*self.size+x
        return self.cells[pos]

    def sumAll(self,state):
        count=0
        for cell in self.cells:
            count+=cell.getState(state)
        return count

    def countAll(self,state,value):
        count=0
        for cell in self.cells:
            if cell.isState(state,value):
                count+=1
        return count

    def diffuse(self,state,value):
        for cell in self.cells:
            cell.preDiffuse(state)
        for cell in self.cells:
            cell.diffuse(state,value)

    def update(self):
        Cell.update()

    def bounds(self,i):
        if i<0:
            return self.size + i
        if i>=self.size:
            return i-self.size
        return i