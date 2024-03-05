# import the necessary packages
import numpy as np
import cv2

def color_transfer_reinhard(source, target):

  reference = source
  content = target

  """Transfers colors from a reference image to a content image using the
  technique from Reinhard et al.

  content: NumPy array (HxWxC)
  reference: NumPy array (HxWxC)
  """
  # Convert HxWxC image to a (H*W)xC matrix.
  shape = content.shape
  assert len(shape) == 3
  content = content.reshape(-1, shape[-1]).astype(np.float32)
  reference = reference.reshape(-1, shape[-1]).astype(np.float32)

  m1 = np.array([
      [0.3811, 0.1967, 0.0241],
      [0.5783, 0.7244, 0.1288],
      [0.0402, 0.0782, 0.8444],
  ])

  m2 = np.array([
      [0.5774, 0.4082, 0.7071],
      [0.5774, 0.4082, -0.7071],
      [0.5774, -0.8165, 0.0000],
  ])

  m3 = np.array([
      [0.5774, 0.5774, 0.5774],
      [0.4082, 0.4082, -0.8165],
      [0.7071, -0.7071, 0.0000],
  ])

  m4 = np.array([
      [4.4679, -1.2186, 0.0497],
      [-3.5873, 2.3809, -0.2439],
      [0.1193, -0.1624, 1.2045],
  ])

  # Avoid log of 0. Clipping is used instead of adding epsilon, to avoid
  # taking a log of a small number whose very low output distorts the results.
  # WARN: This differs from the Reinhard paper, where no adjustment is made.
  lab_content = np.log10(np.maximum(1.0, content.dot(m1))).dot(m2)
  lab_reference = np.log10(np.maximum(1.0, reference.dot(m1))).dot(m2)

  mu_content = lab_content.mean(axis=0)
  mu_reference = lab_reference.mean(axis=0)

  std_source = np.std(content, axis=0)
  std_target = np.std(reference, axis=0)

  result = lab_content - mu_content
  result *= std_target
  result /= std_source
  result += mu_reference
  result = (10 ** result.dot(m3)).dot(m4)
  # Restore image dimensions.
  result = result.reshape(shape).clip(0, 255).round().astype(np.uint8)

  return result