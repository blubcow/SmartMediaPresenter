EXTRAPOLATE_BORDER = 10
EXTRAPOLATE_STEPS = 4
#EXTRAPOLATE_PATCH_SIZE = 1 # use this for patch_match
EXTRAPOLATE_PATCH_SIZE = 3

# Check the extrapolation algorithm output to see what the end border looks like
# It may differ with different IMG_HEIGHT because of interpolation etc.
IMG_HEIGHT = 500
EXTRAPOLATE_BORDER_TOTAL = 82 

# Settings for 1000px height
#IMG_HEIGHT = 1000
#EXTRAPOLATE_BORDER_TOTAL = 160

EXTRAPOLATE_IMG_HEIGHT = IMG_HEIGHT + (EXTRAPOLATE_BORDER_TOTAL * 2)

