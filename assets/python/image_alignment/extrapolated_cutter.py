import cv2

from .config import IMG_HEIGHT

def cutExtrapolatedImageSliceAtScale(img:cv2.typing.MatLike, pos='left', 
                                     border:int=0, sliceWidth:int=100, sliceHeight:int=IMG_HEIGHT, innerXPos:int=100,
                                     scale:float=1.0):
    '''
    scale = Scale the image before slicing (Up and down possible)
        We don't check possible sizes if you scale down. It will fail if outside of slice bounds.
    See "cutExtrapolatedImageSlice" for further parameter descriptions
    '''
    if(scale == 1.0):
        scaledImg = img
    else:
        scaledImg = cv2.resize(img, None, fx=scale, fy=scale)
        # The border is recalculated, since we need to slice from an inner position
        border = int(border * scale)

    return cutExtrapolatedImageSlice(scaledImg, pos, border, sliceWidth, sliceHeight, innerXPos)


def cutExtrapolatedImageSlice(img:cv2.typing.MatLike, pos='left',
                              border:int=0, sliceWidth:int=100, sliceHeight:int=IMG_HEIGHT, innerXPos:int=100):
    '''
    width = Final width of the slice (Height will be calculated automatically)
    pos = 'left' | 'right'
    border = size of extrapolated border
    sliceWidth = Width of final slice
    sliceHeight = Height of final slice
    innerXPos = The inner border to cut to the side of "pos" from
        If pos=='left', we will cut from this position (+ border)
    '''
    sliceXEnd = innerXPos + border
    sliceXStart = sliceXEnd - sliceWidth
    assert(sliceXStart >= 0)

    sliceYStart = int((img.shape[0] - sliceHeight) / 2)
    sliceYEnd = sliceYStart + sliceHeight

    if pos == 'left':
        sliceImg = img[sliceYStart:sliceYEnd, sliceXStart:sliceXEnd]

    elif pos == 'right':
        if sliceXStart == 0:
            sliceImg = img[sliceYStart:sliceYEnd, -sliceXEnd:]
        else:
            sliceImg = img[sliceYStart:sliceYEnd, -sliceXEnd:-sliceXStart]

    else:
        raise ValueError("Parameter 'pos' should be either 'left' or 'right'")
    
    return sliceImg