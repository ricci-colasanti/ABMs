# Loads the ABM library
import ABM

#Sets the size of the window
WIDTH = 600
HEIGHT = 600

# Create a new simulation of grid size 60 X 60 cells
# Set the variable in each cell of as "live"
world = ABM.World(60, ["live"],[0])

# Set the live variable of an individual cell at the grid cordinate of 35 34  to 1
world.setCell(25, 24, "live", 1)
world.setCell(25, 25, "live", 1)
world.setCell(25, 26, "live", 1)
world.setCell(24, 25, "live", 1)
world.setCell(26, 26, "live", 1)
#Update the world
world.update()

# This function "update" is run every iter action by the ABM simulation
def update():
    #sleep
    ABM.frame = 0.05

    # For every cell in the simulation grid
    for cell in world.cells:
        # Count the number of immediate neighbours that have their "live" variable set to 1
        count = cell.count("live", 1)

        # The game of life rules
        if cell.isState("live", 1):
            if count == 2 or count == 3:
                cell.setState("live", 1)
            else:
                cell.setState("live", 0)
        else:
            if count == 3:
                cell.setState("live", 1)
            else:
                cell.setState("live", 0)
    #Update the world
    world.update()
    #Draw the world with squares that have their "live" variable set to 1
    ABM.draw(screen, world, "live", 1,discreet=True)

    # Uncomment the line below to output number of live cells
    #print((world.countAll("live",1),0))

#Start the simulation
ABM.go()