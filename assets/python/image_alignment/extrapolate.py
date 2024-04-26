from .patchmatch import patch_match
import cv2
import numpy as np

from .config import EXTRAPOLATE_BORDER, EXTRAPOLATE_PATCH_SIZE, EXTRAPOLATE_STEPS

def extrapolateRecursively(img, level=0):
    '''
    Outpaint image as seen in https://ieeexplore.ieee.org/document/6215214
    Iterative multiscale extrapolation using a multiscale pyramid
    '''
    scale = 0.5 # Use this if you are not happy with 0.5 scale down
    addBorder = EXTRAPOLATE_BORDER
    patchSize = EXTRAPOLATE_PATCH_SIZE
    maxLevels = EXTRAPOLATE_STEPS
    
    #print(str(level) + ', source HxW: ' + str(img.shape[0]) + ' ' + str(img.shape[1]))

    # extrapolate this
    extrImg = extrapolate(img, addBorder, patchSize)

    #border = 4 * (level + 1)
    h = extrImg.shape[0]
    w = extrImg.shape[1]
    #plotCvtImg( extrImg )

    if level < (maxLevels - 1):
        # extrapolate pyr down
        downImg = cv2.pyrDown(img)
        #downImg = cv2.resize(img, None, fx=scale, fy=scale)
        extrDownImg = extrapolateRecursively(downImg, level+1)
        extrDownImg = cv2.pyrUp(extrDownImg, None)
        #extrDownImg = resizeImage(extrDownImg, height = extrDownImg.shape[0] + (addBorder*2))
        #extrDownImg = cv2.resize(extrDownImg, (extrDownImg.shape[0] + (addBorder*2), extrDownImg.shape[1] + (addBorder*2)))
        #extrDownImg = cv2.resize(extrDownImg, None, fx=1/scale, fy=1/scale)

        #print(extrDownImg.shape)

        hBorder = int((extrDownImg.shape[0] - extrImg.shape[0]) / 2)
        wBorder = int((extrDownImg.shape[1] - extrImg.shape[1]) / 2)
        #print(str(hBorder)+' '+str(wBorder))
        #extrDownImg[hBorder:hBorder + h, wBorder:wBorder + w] = extrImg
        
        # FEATHER
        mask = createFeatherMask(w, h, addBorder)
        invMask = 1 - mask
        
        # Blend in extrapolated image with feather mask
        origImg = extrDownImg[hBorder:hBorder + h, wBorder:wBorder + w].astype(np.float32)
        extrDownImg[hBorder:hBorder + h, wBorder:wBorder + w] = np.multiply(extrImg, mask) + np.multiply(origImg, invMask)
        #plotCvtImg(extrDownImg)

        return extrDownImg
    else:
        return extrImg

def extrapolate(img, borderSize, patchSize=3):
    '''
    Outpaint image by using a Patch Match algorithm
    '''
    h = img.shape[0]
    w = img.shape[1]

    extendedImg = np.zeros((h + (2 * borderSize), w + (2 * borderSize), 3), dtype=np.uint8)
    extendedImg[borderSize:borderSize + h, borderSize:borderSize + w] = img

    mask = np.ones_like(extendedImg[..., 0])
    mask[borderSize:-borderSize, borderSize:-borderSize] = 0

    return patch_match.inpaint(extendedImg, mask, patch_size=patchSize)

def createFeatherMask(width, height, border:int):
    '''
    Creates a feather mask from 0 to 1 where 0 is the outside feathering to 1 in the width of "border".
    The feather mask has the structure of an cv2 image.
    '''
    mask = np.ones((height, width, 3), dtype=np.float32)
    for i in range(border):
        alpha = 1 / (border+1) * (i+1)
        alpha = 1 - ((1-alpha) ** 2) # feather exponentially (fade outside more then inside)
        if i == 0:
            mask[0, :] = alpha
            mask[-1, :] = alpha
            mask[:, 0] = alpha
            mask[:, -1] = alpha
        else:
            mask[i, i:-i] = alpha
            mask[-i-1, i:-i] = alpha
            mask[i:-i, i] = alpha
            mask[i:-i, -i-1] = alpha
    return mask