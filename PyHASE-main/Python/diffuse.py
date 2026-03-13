# Loads the ABM library
import ABM

#Sets the size of the window
WIDTH = 600
HEIGHT = 600

# Create a new simulation of grid size 30 X 30 cells
# Set the variable in each cell of as "resource" and set value to 0
world = ABM.World(30, ["resource"],[0])
#set center cell resource to 500
world.setCell(15, 15, "resource", 500)
world.update()



# This function "update" is run every iter action by the ABM simulation
def update():
    #sleep
    ABM.frame = 0.1
    
    # diffuse resource by 0.5
    world.diffuse("resource",0.5)
    world.update()
    #Draw the world with squares that have their "live" variable set to 1
    ABM.draw(screen, world, "resource", 1,discreet=False)


    # Uncomment the line below to output total resource
    #print((world.sumAll("resource"),0))

#Start the simulation
ABM.go()