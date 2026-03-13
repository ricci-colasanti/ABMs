from IPython.display import display, HTML,clear_output
class SVGCanvas:
    def __init__(self,width,height,size):
        self.width = width
        self.height = height
        self.size = size
        self.html_s =""
    
    def clear(self):
        self.html_s = '<svg width="'+str(self.width)+'" height="'+str(self.height)+'"style="border:1px solid black">'

    def addCircle(self,x_pos,y_pos,color):
        x_pos = x_pos/self.size
        y_pos = y_pos/self.size
        r = 1/(self.size*2)
        str_int_x = str(int((x_pos*self.width)+(r*self.width)))
        str_int_y = str(int((y_pos*self.height)+(r*self.width)))
        str_int_r = str(int(r*self.width))
        self.html_s +='<circle cx="'+str_int_x+'" cy="'+str_int_y+'" r="'+str_int_r+'" fill="'+color+'"/>'

    def addRect(self,x_pos,y_pos,color):
        x_pos = x_pos/self.size
        y_pos = y_pos/self.size
        height = 1/self.size
        width = 1/self.size
        str_int_x = str(int(x_pos*self.width))
        str_int_y = str(int(y_pos*self.height))
        str_int_width = str(int(width*self.width))
        str_int_height = str(int(height*self.height))
        self.html_s +='<rect x="'+str_int_x+'" y="'+str_int_y+'" width="'+str_int_width+'" height="'+str_int_height+'" fill="'+color+'"/>'

    def getCanvas(self):
        self.html_s += "</svg>"
        return HTML(self.html_s)
