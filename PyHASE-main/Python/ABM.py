
import pgzrun
import pygame
import time
from pyabm import World, Cell, Agent


frame = 0.01


def go():
    pgzrun.go()

def draw(screen,world,state,value,discreet=False):
    pygame.display.set_caption('ABM')
    time.sleep(frame)
    width = screen.surface.get_width()
    ratio = width/world.size
    box_size = int(ratio-1)

    screen.fill((60, 60, 80))
    for cell in world.cells:
        x_pos = int(cell.x_pos*ratio)
        y_pos = int(cell.y_pos*ratio)
        box = pygame.Rect((x_pos,y_pos),(box_size,box_size))
        if discreet:
            if cell.isState(state,value):
                screen.draw.filled_rect(box,(60,200,60))
        else:
            amount = cell.getState(state)
            r = int(255*(amount/value))
            if r>255:
                r=255
            if r<0:
                r=0
            screen.draw.filled_rect(box,(r,0,0))
    for agent in world.agents:
        cell = agent.getHome()
        x_pos = int(cell.x_pos*ratio+(ratio/2))
        y_pos = int(cell.y_pos*ratio+(ratio/2))
        screen.draw.filled_circle((x_pos,y_pos),int(box_size/2),agent.color)

