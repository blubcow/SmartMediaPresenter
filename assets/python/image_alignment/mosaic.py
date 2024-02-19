from typing import List
import cv2
import numpy as np
from types import CoordinateLimits
from correlate import findBestCorrelation, getNormalizedCorrelationBorders
from extrapolate import extrapolateRecursively
from config import IMG_HEIGHT
from utils import plotCorrTransformedImages, plotCvtImg, resizeImage

def alignImages(leftImg:cv2.typing.MatLike, rightImg:cv2.typing.MatLike) -> List[cv2.typing.MatLike]:
    
    # Downsize images
    resizedLeftImg = resizeImage(leftImg, height=IMG_HEIGHT, inter=cv2.INTER_LINEAR)
    resizedRightImg = resizeImage(rightImg, height=IMG_HEIGHT, inter=cv2.INTER_LINEAR)

    # Extrapolate images
    extrapleftImg = extrapolateRecursively(resizedLeftImg)
    extrapRightImg = extrapolateRecursively(resizedRightImg)
    #plotCvtImg(extrapleftImg)
    #plotCvtImg(extrapRightImg)
    #extrapleftImg = cv2.imread('../images/schottland_extended_1320.jpg', 1)
    #extrapRightImg = cv2.imread('../images/strand_extended_1320.jpg', 1)

    # Find best transformation from correlation
    corrTransforms = findBestCorrelation(extrapleftImg, extrapRightImg)
    if(corrTransforms == None):
        raise Exception("Could not find correlation")
    #print(corrTransforms)
    #plotCorrTransformedImages(resizedLeftImg, resizedRightImg, corrTransforms)

    # Create highres images with common height
    newHeight = 1200

    leftImg = resizeImage(leftImg, height=newHeight, inter=cv2.INTER_LINEAR)
    leftScale = corrTransforms.leftTransform.scale
    if(leftScale != 1.0):
        leftImg = cv2.resize(leftImg, None, fx=leftScale, fy=leftScale)

    rightImg = resizeImage(rightImg, height=newHeight, inter=cv2.INTER_LINEAR)
    rightScale = corrTransforms.rightTransform.scale
    if(rightScale != 1.0):
        rightImg = cv2.resize(rightImg, None, fx=rightScale, fy=rightScale)
    
    # Clip highres images
    LY: CoordinateLimits; RY: CoordinateLimits
    LY, RY = getNormalizedCorrelationBorders(corrTransforms) 
    clipLY, clipRY = CoordinateLimits(), CoordinateLimits()

    if(RY.start > LY.start):
        clipLY.start = RY.start
    elif(LY.start > RY.start):
        clipRY.start = LY.start
    
    if(RY.end < LY.end):
        clipLY.end = RY.end - LY.start
        clipRY.end = RY.end - RY.start
    elif(LY.end < RY.end):
        clipLY.end = LY.end - LY.start
        clipRY.end = LY.end - RY.start
    else:
        clipLY.end = LY.end - LY.start
        clipRY.end = RY.end - RY.start

    clipLY.multiply(newHeight / IMG_HEIGHT)
    clipRY.multiply(newHeight / IMG_HEIGHT)

    leftImg = leftImg[int(clipLY.start):int(clipLY.end), :]
    rightImg = rightImg[int(clipRY.start):int(clipRY.end), :]

    return [leftImg, rightImg]

def combineImages(leftImg:cv2.typing.MatLike, rightImg:cv2.typing.MatLike) -> cv2.typing.MatLike:
    h = min(leftImg.shape[0], rightImg.shape[0])
    w = leftImg.shape[1] + rightImg.shape[1]
    mask = np.zeros((h, w, 3), dtype=np.uint8) # 255 max value

    mask[:h, :leftImg.shape[1]] = leftImg[:h, :]
    mask[:h, leftImg.shape[1]:leftImg.shape[1]+rightImg.shape[1]] = rightImg[:h, :]

    return mask