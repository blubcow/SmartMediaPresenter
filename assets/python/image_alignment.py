import argparse
from os.path import exists
import cv2
from image_alignment import mosaic

def show_image(title, image, width = 300):
	# resize the image to have a constant width, just to
	# make displaying the images take up less screen real
	# estate
	r = width / float(image.shape[1])
	dim = (width, int(image.shape[0] * r))
	resized = cv2.resize(image, dim, interpolation = cv2.INTER_AREA)

	# show the resized image
	cv2.imshow(title, resized)

# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-l", "--left", required = True, help = "Path to the left image")
ap.add_argument("-r", "--right", required = True, help = "Path to the right image")
ap.add_argument("-o", "--output", help = "Path to the output image (optional)")
args = vars(ap.parse_args())

# Check if files exist
if(not exists(args["left"]) or not exists(args["left"])):
	raise FileNotFoundError("The input files couldn't be read")

# load the images
leftImg = cv2.imread(args["left"])
rightImg = cv2.imread(args["right"])

# Align images
leftImg, rightImg = mosaic.alignImages(leftImg, rightImg)
combinedImg = mosaic.combineImages(leftImg, rightImg)

# Save or show image
if args["output"] is not None:
	cv2.imwrite(args["output"], combinedImg)
else:
	# show the images and wait for a key press
	show_image("Left", leftImg)
	show_image("Right", rightImg)
	show_image("Aligned", combinedImg)
	cv2.waitKey(0)