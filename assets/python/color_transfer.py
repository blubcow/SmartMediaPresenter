# USAGE
# python example.py --source images/ocean_sunset.jpg --target images/ocean_day.jpg

# import the necessary packages
import sys
from tkinter import Image
from color_transfer_jrosebr1 import color_transfer as color_transfer_jrosebr1
from color_transfer_pengbo_learn import color_transfer as color_transfer_pengbo_learn
from color_transfer_pengbo_learn import color_transfer_pdf_regrain as color_transfer_pengbo_learn_pdf_regrain
from color_transfer_dstein64 import color_transfer_reinhard as color_transfer_dstein64_reinhard
#from color_transfer_anant-mishra1729 import color_transfer
import numpy as np
import argparse
import cv2
from os.path import exists
#from cv2.typing import MatLike

sys.stdout.write('color transfer running -------------\n')
sys.stdout.write(''.join(str(x) for x in sys.argv) + '\n')
sys.stdout.writelines(sys.argv)
sys.stdout.write('\n')

def show_image(title, image, width = 300):
	# resize the image to have a constant width, just to
	# make displaying the images take up less screen real
	# estate
	r = width / float(image.shape[1])
	dim = (width, int(image.shape[0] * r))
	resized = cv2.resize(image, dim, interpolation = cv2.INTER_AREA)

	# show the resized image
	cv2.imshow(title, resized)

def str2bool(v):
    if v.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif v.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    else:
        raise argparse.ArgumentTypeError('Boolean value expected.')

# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-s", "--source", required = True,
	help = "Path to the source image")
ap.add_argument("-t", "--target", required = True,
	help = "Path to the target image")
ap.add_argument("-o", "--output", help = "Path to the output image (optional)")
ap.add_argument("-m", "--method", required = False,
	help = "Method used, from 0 to ...")
args = vars(ap.parse_args())

# Check if files exist
if(not exists(args["source"]) or not exists(args["target"])):
	raise FileNotFoundError("The input files couldn't be read")

# load the images
source = cv2.imread(args["source"])
target = cv2.imread(args["target"])

# transfer the color distribution from the source image
# to the target image
method = args["method"] or "0"
match method:
	case "0":
		# Reinhard et al, CIE-LAB, reciprocal scale
		# Source: https://github.com/jrosebr1/color_transfer
		transfer = color_transfer_jrosebr1(source, target)
	case "1":
		# Reinhard et al, CIE-LAB
		# Source: https://github.com/pengbo-learn/python-color-transfer
		transfer = color_transfer_pengbo_learn(source, target)
	case "2":
		# Probability density function
		# Source: https://github.com/pengbo-learn/python-color-transfer
		transfer = color_transfer_pengbo_learn_pdf_regrain(source, target)
	case "3":
		# Reinhard et al, lambda-alpha-beta color space as proposed in paper
		# Source: https://github.com/dstein64/colortrans
		transfer = color_transfer_dstein64_reinhard(source, target)


# check to see if the output image should be saved
if args["output"] is not None:
	cv2.imwrite(args["output"], transfer)
else:
	# show the images and wait for a key press
	show_image("Source", source)
	show_image("Target", target)
	show_image("Transfer", transfer)
	cv2.waitKey(0)
