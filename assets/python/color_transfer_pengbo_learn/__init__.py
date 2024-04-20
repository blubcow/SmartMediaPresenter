# Source: https://github.com/pengbo-learn/python-color-transfer

# -*- coding: utf-8 -*-
""" Implementation of color transfer in python.

Papers: 
    Color Transfer between Images. (2001)
    Automated colour grading using colour distribution transfer. (2007) 
Referenced Implementations:
    https://github.com/chia56028/Color-Transfer-between-Images
    https://github.com/frcs/colour-transfer
"""

import cv2
import numpy as np
from color_transfer_pengbo_learn.utils import Rotations
from color_transfer_pengbo_learn.regrain import Regrain

# Lab mean std transfer
# Reinhard method



def color_transfer(source, target):

	##img_arr_reg = PT.pdf_transfer(img_arr_in=img_arr_in, img_arr_ref=img_arr_ref, regrain=True)
	
	##img_arr_mt = PT.mean_std_transfer(img_arr_in=source, img_arr_ref=target)

	img_arr_lt = lab_transfer(img_arr_in=target, img_arr_ref=source)

	#transfer = np.concatenate((source, target, img_arr_mt, img_arr_lt, img_arr_reg), axis=1)
	return img_arr_lt


def lab_transfer(img_arr_in=None, img_arr_ref=None):
	"""Convert img from rgb space to lab space, apply mean std transfer,
	then convert back.
	Args:
			img_arr_in: bgr numpy array of input image.
			img_arr_ref: bgr numpy array of reference image.
	Returns:
			img_arr_out: transfered bgr numpy array of input image.
	"""
	lab_in = cv2.cvtColor(img_arr_in, cv2.COLOR_BGR2LAB)
	lab_ref = cv2.cvtColor(img_arr_ref, cv2.COLOR_BGR2LAB)
	lab_out = mean_std_transfer(img_arr_in=lab_in, img_arr_ref=lab_ref)
	img_arr_out = cv2.cvtColor(lab_out, cv2.COLOR_LAB2BGR)
	return img_arr_out

def mean_std_transfer(img_arr_in=None, img_arr_ref=None):
	"""Adapt img_arr_in's (mean, std) to img_arr_ref's (mean, std).

	img_o = (img_i - mean(img_i)) / std(img_i) * std(img_r) + mean(img_r).
	Args:
			img_arr_in: bgr numpy array of input image.
			img_arr_ref: bgr numpy array of reference image.
	Returns:
			img_arr_out: transfered bgr numpy array of input image.
	"""
	mean_in = np.mean(img_arr_in, axis=(0, 1), keepdims=True)
	mean_ref = np.mean(img_arr_ref, axis=(0, 1), keepdims=True)
	std_in = np.std(img_arr_in, axis=(0, 1), keepdims=True)
	std_ref = np.std(img_arr_ref, axis=(0, 1), keepdims=True)
	img_arr_out = (img_arr_in - mean_in) / std_in * std_ref + mean_ref
	img_arr_out[img_arr_out < 0] = 0
	img_arr_out[img_arr_out > 255] = 255
	return img_arr_out.astype("uint8")




eps = 1e-6
m = 6
c = 3
RG = None
rotation_matrices = None

def color_transfer_pdf_regrain(source, target):
	global RG, rotation_matrices
	RG = Regrain()

	if c == 3:
		rotation_matrices = Rotations.optimal_rotations()
	else:
		rotation_matrices = Rotations.random_rotations(m, c=c)

	img_arr_reg = pdf_transfer(img_arr_in=target, img_arr_ref=source, regrain=True)
	return img_arr_reg


def pdf_transfer(img_arr_in=None, img_arr_ref=None, regrain=False):
	"""Apply probability density function transfer.

	img_o = t(img_i) so that f_{t(img_i)}(r, g, b) = f_{img_r}(r, g, b),
	where f_{img}(r, g, b) is the probability density function of img's rgb values.
	Args:
			img_arr_in: bgr numpy array of input image.
			img_arr_ref: bgr numpy array of reference image.
	Returns:
			img_arr_out: transfered bgr numpy array of input image.
	"""

	# reshape (h, w, c) to (c, h*w)
	[h, w, c] = img_arr_in.shape
	reshape_arr_in = img_arr_in.reshape(-1, c).transpose() / 255.0
	reshape_arr_ref = img_arr_ref.reshape(-1, c).transpose() / 255.0
	# pdf transfer
	reshape_arr_out = pdf_transfer_nd(arr_in=reshape_arr_in, arr_ref=reshape_arr_ref)
	# reshape (c, h*w) to (h, w, c)
	reshape_arr_out[reshape_arr_out < 0] = 0
	reshape_arr_out[reshape_arr_out > 1] = 1
	reshape_arr_out = (255.0 * reshape_arr_out).astype("uint8")
	img_arr_out = reshape_arr_out.transpose().reshape(h, w, c)
	if regrain:
			img_arr_out = RG.regrain(img_arr_in=img_arr_in,
																		img_arr_col=img_arr_out)
	return img_arr_out

def pdf_transfer_nd(arr_in=None, arr_ref=None, step_size=1):
	"""Apply n-dim probability density function transfer.

	Args:
			arr_in: shape=(n, x).
			arr_ref: shape=(n, x).
			step_size: arr = arr + step_size * delta_arr.
	Returns:
			arr_out: shape=(n, x).
	"""
	# n times of 1d-pdf-transfer
	arr_out = np.array(arr_in)
	for rotation_matrix in rotation_matrices:
			rot_arr_in = np.matmul(rotation_matrix, arr_out)
			rot_arr_ref = np.matmul(rotation_matrix, arr_ref)
			rot_arr_out = np.zeros(rot_arr_in.shape)
			for i in range(rot_arr_out.shape[0]):
					rot_arr_out[i] = _pdf_transfer_1d(rot_arr_in[i],
																									rot_arr_ref[i])
			# func = lambda x, n : _pdf_transfer_1d(x[:n], x[n:])
			# rot_arr = np.concatenate((rot_arr_in, rot_arr_ref), axis=1)
			# rot_arr_out = np.apply_along_axis(func, 1, rot_arr, rot_arr_in.shape[1])
			rot_delta_arr = rot_arr_out - rot_arr_in
			delta_arr = np.matmul(
					rotation_matrix.transpose(), rot_delta_arr
			)  # np.linalg.solve(rotation_matrix, rot_delta_arr)
			arr_out = step_size * delta_arr + arr_out
	return arr_out

def _pdf_transfer_1d(arr_in=None, arr_ref=None, n=300):
	"""Apply 1-dim probability density function transfer.

	Args:
			arr_in: 1d numpy input array.
			arr_ref: 1d numpy reference array.
			n: discretization num of distribution of image's pixels.
	Returns:
			arr_out: transfered input array.
	"""

	arr = np.concatenate((arr_in, arr_ref))
	# discretization as histogram
	min_v = arr.min() - eps
	max_v = arr.max() + eps
	xs = np.array(
			[min_v + (max_v - min_v) * i / n for i in range(n + 1)])
	hist_in, _ = np.histogram(arr_in, xs)
	hist_ref, _ = np.histogram(arr_ref, xs)
	xs = xs[:-1]
	# compute probability distribution
	cum_in = np.cumsum(hist_in)
	cum_ref = np.cumsum(hist_ref)
	d_in = cum_in / cum_in[-1]
	d_ref = cum_ref / cum_ref[-1]
	# transfer
	t_d_in = np.interp(d_in, d_ref, xs)
	t_d_in[d_in <= d_ref[0]] = min_v
	t_d_in[d_in >= d_ref[-1]] = max_v
	arr_out = np.interp(arr_in, xs, t_d_in)
	return arr_out

