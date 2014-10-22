imagr
=====

image and move viewer and uploader in html5
how to use: upload your images with the upload script  (the scripts must have write permission to the folder containing it ) or place them in the "root directory", and enjoy! 

----------
Important new feature: the images are now being resized to the user's screen size before being sent which makes a much more floating user experience and uses much less bandwith (and more CPU server side....)


This has a bug at the moment:
the first picture is always at the screen's width (quite large),
then if you press next it is being resized to the computed with of the previous picture, that means if the previous picture's original is smaller than the next one or has another orientation it gets unnecessary small.
Close the large viewer and reopen to fix it.

----------

TODO: video support
(and bug fixes)
