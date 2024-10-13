
# TODO: Automatization
- Automate scripts in build process: `pyinstaller example.py --nowindowed`
- Think of reinserting one-file process: `pyinstaller example.py --nowindowed --onefile` - currently not implemented

# TODO: PatchMatch Algorithm not working properly with packaged python script
patchmatch is not working properly with pyinstaller.  
What I did for it to work:
- I moved the library into "image_alignment".
- Commented out code in "path_match.py" from line 147
- run `pyinstaller image_alignment.py --nowindowed --add-data=./image_alignment/patchmatch/libpatchmatch_windows_amd64.dll:image_alignment/patchmatch`
  This includes the WIN64 library of patchmatch that our python package needs
- TODO: Attention! This only works if the python library is also installed and ran correctly (downloading all the files)

> add option -y to override existing dist