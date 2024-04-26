
----

TODO:

Commands that need to automated for bundling:

pyinstaller example.py --nowindowed --onefile


TODO:
Add requirements from image_alignment to requirements.txt



-----
TODO:
patchmatch is not working properly with pyinstaller.
What I did is:
- I moved the library into "image_alignment".
- Commented out code in "path_match.py" from line 147
- run `pyinstaller image_alignment.py --nowindowed --add-data=./image_alignment/patchmatch/libpatchmatch_windows_amd64.dll:image_alignment/patchmatch`
  This includes the WIN64 library of patchmatch that our python package needs

(add option -y to override existing dist)