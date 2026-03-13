# Loads the ABM library
import ABM

#Sets the size of the window
WIDTH = 600
HEIGHT = 600

# Create a new simulation of grid size 120 X 120 cells
# Set the variable in each cell of as "signal" and set value to 0
world = ABM.World(120, ["signal"],[0],n_type=4)
# add an agent
world.addAgent(60,60,color='red')

# This function "update" is run every iteration by the ABM simulation
def update():
    #sleep
    ABM.frame = 0.0001

    # loop through all agents
    for agent in world.agents:
        # what is the signle at the cell that agent occupies
        state = agent.getState("signal")
        if state == 1:
            agent.setState("signal",0)
            agent.right()
        else:
            agent.setState("signal",1)
            agent.left()
        #agent.moveRandom()

    #Draw the world with squares that have their "signle" variable set to 1
    ABM.draw(screen, world, "signal", 1,discreet=True)


#Start the simulation
ABM.go()
