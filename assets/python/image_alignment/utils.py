import cv2
import matplotlib.pyplot as plt
import numpy as np

from .types import CorrelationTransforms, Transform

# Rezising image by width or height proportionally
# taken from: https://stackoverflow.com/questions/44650888/resize-an-image-without-distortion-opencv
def resizeImage(image, width = None, height = None, inter = cv2.INTER_AREA):
    # initialize the dimensions of the image to be resized and
    # grab the image size
    dim = None
    (h, w) = image.shape[:2]

    # if both the width and height are None, then return the
    # original image
    if width is None and height is None:
        return image

    # check to see if the width is None
    if width is None:
        # calculate the ratio of the height and construct the
        # dimensions
        r = height / float(h)
        dim = (int(w * r), height)

    # otherwise, the height is None
    else:
        # calculate the ratio of the width and construct the
        # dimensions
        r = width / float(w)
        dim = (width, int(h * r))

    # resize the image
    resized = cv2.resize(image, dim, interpolation = inter)

    # return the resized image
    return resized

# ==============================================
# Helper for Jupyter Notebook
# ==============================================

def plotCvtImg(img, size=15):
    plt.figure(figsize=(size,size))
    plt.tick_params(left=False, bottom=False, labelbottom=False, labelleft=False) #remove ticks
    plt.box(False) #remove box
    plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    plt.show()

def plotRePosImages(img1, img2, rePos:tuple, scale=1.0, reScale=True, flip=True, rePosW=True):
    margin = 300
    #wSlice = 100
    #img1 = img1[:, -wSlice:]
    #img2 = img2[:, :wSlice]

    mask = np.ones((2000, 2000, 3), dtype=np.uint8) # 255 max value

    # Draw 1
    # Flip image
    if flip == True:
        img1 = np.flip(img1, axis=1)
    hOrig = img1.shape[0]
    if (scale >= 1) and reScale:
        img1 = cv2.resize(img1, None, fx=scale, fy=scale)
    h = img1.shape[0]
    w = img1.shape[1]
    hRePos = int(- (h - hOrig) / 2)
    wRePos = 0
    mask[margin + hRePos:margin + hRePos + h, margin + wRePos:margin + wRePos + w] = img1

    # Draw 2
    hOrig = img2.shape[0]
    if (scale < 1) and reScale:
        scale = 1/scale
        img2 = cv2.resize(img2, None, fx=scale, fy=scale)
    h = img2.shape[0]
    w = img2.shape[1]
    hRePos = int(- (h - hOrig) / 2) - rePos[0]
    if rePosW == True:
        wRePos = rePos[1] * (-1)
    else:
        wRePos = img1.shape[1]

    mask[margin + hRePos:margin + hRePos + h, margin + wRePos:margin + wRePos + w] = img2
    #for j in range(len(img2)):
    #    for i in range(len(img2[j])):
    #        jM = margin + hRePos + j
    #        iM = margin + wRePos + i
    #        if (mask[jM][iM] != 1).all():
    #            mask[jM, iM] = np.multiply(mask[jM, iM], 0.5) + np.multiply(img2[j, i], 0.5)
    #        else:
    #            mask[jM, iM] = img2[j, i]

    plotCvtImg(mask, 20)

def plotCorrTransformedImages(leftImg, rightImg, corrTransforms:CorrelationTransforms):
    margin = 500
    mask = np.ones((3000, 4000, 3), dtype=np.uint8) # 255 max value

    #print('render')
    #print(corrTransforms.leftTransform.pos)
    #print(corrTransforms.rightTransform.pos)

    scale = corrTransforms.leftTransform.scale
    if(scale != 1.0):
        leftImg = cv2.resize(leftImg, None, fx=scale, fy=scale)
    h = leftImg.shape[0]
    w = leftImg.shape[1]
    hRePos = corrTransforms.leftTransform.pos[0]
    wRePos = corrTransforms.leftTransform.pos[1]
    wRePos = 0
    mask[margin + hRePos:margin + hRePos + h, margin + wRePos:margin + wRePos + w] = leftImg

    scale = corrTransforms.rightTransform.scale
    if(scale != 1.0):
        rightImg = cv2.resize(rightImg, None, fx=scale, fy=scale)
    h = rightImg.shape[0]
    w = rightImg.shape[1]
    hRePos = corrTransforms.rightTransform.pos[0]
    wRePos = corrTransforms.rightTransform.pos[1]
    wRePos = leftImg.shape[1]
    mask[margin + hRePos:margin + hRePos + h, margin + wRePos:margin + wRePos + w] = rightImg

    
    plotCvtImg(mask, 30)


def blurHorizontal(img):
    for i in range(img.shape[0]):
        sum = img[i, :].sum(axis=0) / img.shape[1]
        #print(sum)
        img[i, :] = sum
    return img