from typing import List
import cv2
import numpy as np
from .config import EXTRAPOLATE_BORDER_TOTAL, EXTRAPOLATE_IMG_HEIGHT, IMG_HEIGHT
from .types import CoordinateLimits, CorrelationTransforms, Transform
from .extrapolated_cutter import cutExtrapolatedImageSliceAtScale, cutExtrapolatedImageSlice
from .utils import blurHorizontal, plotCorrTransformedImages, plotCvtImg, plotRePosImages
from .align_images import align

def getCutoffFromCorrelation(corrTransforms:CorrelationTransforms) -> float:
    LY: CoordinateLimits; RY: CoordinateLimits
    LY, RY = getNormalizedCorrelationBorders(corrTransforms)

    topCutoff = (LY.start - RY.start) if (LY.start > RY.start) else (RY.start - LY.start)
    bottomCutoff = (LY.end - RY.end) if (LY.end > RY.end) else (RY.end - LY.end)

    #print(str(topCutoff)+' '+str(bottomCutoff))

    return topCutoff + bottomCutoff

def getNormalizedCorrelationBorders(corrTransforms:CorrelationTransforms) -> List[CoordinateLimits]:
    '''
    Returns [[leftImg y start, leftImg y end], [rightImg y start, rightImg y end]]
    None of these values are less then zero.
    The y values describe the top and bottom border of the image to make calculations and cuttings easier.
    '''
    leftY = corrTransforms.leftTransform.pos[0]
    rightY = corrTransforms.rightTransform.pos[0]

    #print(str(leftY)+' '+str(rightY))

    if (leftY < 0):
        #print('left smaller 0')
        rightY -= leftY
        leftY = 0
    
    elif (rightY < 0):
        #print('right smaller 0')
        leftY -= rightY
        rightY = 0
    
    leftYEnd = leftY + (IMG_HEIGHT * corrTransforms.leftTransform.scale)
    rightYEnd= rightY + (IMG_HEIGHT * corrTransforms.rightTransform.scale)

    return [CoordinateLimits(leftY, leftYEnd), CoordinateLimits(rightY, rightYEnd)]

def findBestCorrelation(leftImg:cv2.typing.MatLike, rightImg:cv2.typing.MatLike) -> CorrelationTransforms|None:

    # Set this to the maximum amount of translation. If nothing is found, None will be returned
    lowestCutoff = IMG_HEIGHT * 0.3 
    bestCorrTransforms:CorrelationTransforms = None

    # Fail safe - don't slice over the width of image
    maxSliceWidth = min(leftImg.shape[1], rightImg.shape[1]) - EXTRAPOLATE_BORDER_TOTAL
    maxSliceWidth = min(50+1, maxSliceWidth)

    for sliceWidth in range(10, maxSliceWidth, 10):
        # Scale up
        for i in range(0, 30+1, 2):
            i = i/100 if i > 0 else 0
            corrTransforms = findSliceCorrelationAtScale(leftImg, rightImg, (1.0 + i), sliceWidth)
            cutoff = getCutoffFromCorrelation(corrTransforms)
            if(cutoff < lowestCutoff):
                lowestCutoff = cutoff
                bestCorrTransforms = corrTransforms

        # Scale down
        for i in range(0, 30+1, 2):
            i = i/100 if i > 0 else 0
            corrTransforms = findSliceCorrelationAtScale(leftImg, rightImg, (1 / (1.0 + i)), sliceWidth)
            cutoff = getCutoffFromCorrelation(corrTransforms)
            if(cutoff < lowestCutoff):
                lowestCutoff = cutoff
                bestCorrTransforms = corrTransforms
    
    return bestCorrTransforms


def findSliceCorrelationAtScale(leftImg:cv2.typing.MatLike, rightImg:cv2.typing.MatLike, 
                                scale:np.float64, sliceWidth = 200) -> CorrelationTransforms:
    
    # slicing
    border = int(EXTRAPOLATE_BORDER_TOTAL)
    sliceWidth = sliceWidth
    sliceHeight = IMG_HEIGHT
    innerXPos = sliceWidth

    # Min scale
    minScale = 1 / (EXTRAPOLATE_IMG_HEIGHT / IMG_HEIGHT)

    # Max slice width
    maxSliceWidth = int((minScale * border) + innerXPos)
    assert(sliceWidth <= maxSliceWidth)
    
    # Cut slices and get correlation
    if scale == 1.0:
        leftSlice = cutExtrapolatedImageSlice(leftImg, 'right',
                border, sliceWidth, sliceHeight, innerXPos)
        rightSlice = cutExtrapolatedImageSlice(rightImg, 'left',
                border, sliceWidth, sliceHeight, innerXPos)
        
    elif scale > 1.0:
        assert((1/scale) >= minScale)
        leftSlice = cutExtrapolatedImageSlice(leftImg, 'right',
                border, sliceWidth, sliceHeight, innerXPos)
        rightSlice = cutExtrapolatedImageSliceAtScale(rightImg, 'left',
                border, sliceWidth, sliceHeight, innerXPos,
                scale = (1/scale))

    else: # scale < 1.0
        assert(scale >= minScale)
        leftSlice = cutExtrapolatedImageSliceAtScale(leftImg, 'right',
                border, sliceWidth, sliceHeight, innerXPos,
                scale = scale)
        rightSlice = cutExtrapolatedImageSlice(rightImg, 'left',
                border, sliceWidth, sliceHeight, innerXPos)
    
    grayLeftSlice = cv2.cvtColor(leftSlice, cv2.COLOR_BGR2GRAY)
    grayRightSlice = cv2.cvtColor(rightSlice, cv2.COLOR_BGR2GRAY)

    track = align.track(grayLeftSlice, grayRightSlice)

    #print(track)
    #plotRePosImages(leftSlice, rightSlice, track[0].astype(np.int32), 
    #                scale, reScale=False, flip=False, rePosW=False)

    pos = track[0].astype(np.float64)
    maxCorr = track[1]

    leftPos, rightPos = np.array([0, 0]).astype(np.float64), np.array([0, 0]).astype(np.float64)
    leftScale, rightScale = 1.0, 1.0

    if scale == 1.0:
        leftPos[0] = 0
        leftPos[1] = 0 
        rightPos[0] -= pos[0]
        rightPos[1] -= pos[1]

    elif scale > 1.0:
        rightPos[0] = IMG_HEIGHT * (1 - (1/scale)) / 2  # y
        rightPos[1] = sliceWidth - innerXPos # x

        rightPos[0] -= pos[0]
        rightPos[1] -= pos[1]

        rightScale = 1/scale

    else: # scale < 1.0
        leftPos[0] = IMG_HEIGHT * (1 - scale) / 2  # y
        leftPos[1] = sliceWidth - innerXPos # x

        leftPos[0] += pos[0]
        leftPos[1] += pos[1]

        leftScale = scale
    
    leftTransform = Transform(leftPos, leftScale)
    rightTransform = Transform(rightPos, rightScale)

    return CorrelationTransforms(leftTransform, rightTransform, maxCorr)



