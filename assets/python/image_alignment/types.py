import numpy as np

class Transform():
    pos:np.array = np.array([0, 0]).astype(int)

    def __init__(self, pos:np.array, scale:float):
        self.pos = pos.astype(np.int32)
        self.scale = scale
    
    def __repr__(self):
        return f"<Transform pos: {self.pos} scale: {str(self.scale)}>"

class CorrelationTransforms():
    def __init__(self, leftTransform:Transform, rightTransform:Transform, maxCorr:float):
        self.leftTransform = leftTransform
        self.rightTransform = rightTransform
        self.maxCorr = maxCorr

    def __repr__(self):
        return ("<CorrelationTransforms \n"+
            f"\tleftTransform: {self.leftTransform} \n"+
            f"\trightTransform: {self.rightTransform} \n"+
            f"\tmaxCorr:{str(self.maxCorr)}>")

class CoordinateLimits():
    start:float
    end:float

    def __init__(self, start=0, end=0):
        self.start = start
        self.end = end
    
    def multiply(self, mul:float):
        self.start = self.start * mul
        self.end = self.end * mul
    
    def __repr__(self):
        return f"<CoordinateLimits start: {self.start} end: {self.end}>"