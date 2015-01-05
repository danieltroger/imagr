imagr
=====

Is an image and move viewer written in HTML5.

Howto
-------

Upload your images with the upload script (the script must have write permission to write to the directory where imagr is) or place them in the "root directory" of image. Enjoy!

Preload
----------

The viewer now preloads all images (into the memory O.o) if the client supports WebWorkers.

Preloading is disabled on mobile clients. (Due to cellular data usage.)

Linking
---------
If you open an image if you automatically get a link to it in the location bar. Anyways, here's the documentation.

Possible options are: `/imagr/#![image=<filename.jpg>,][info=<boolean>,][preload=<boolean>,][rs=<width>[x<height>],][ts=<width>[x<height>]]`

`rs` stands for real size, the size of the loaded images (the preloaded are always fullsize).

`ts` stands for thumbnail size.

----------
Important new feature: the images are now being resized to the user's screen size before being sent which makes a much more floating user experience and uses much less bandwith (and more CPU server side....)


This has a bug at the moment:
the first picture is always at the screen's width (quite large),
then if you press next it is being resized to the computed width of the previous picture, that means if the previous picture's original is smaller than the next one or has another orientation it gets unnecessary small.
Close the large viewer and reopen to fix it.

(If the image is preloaded this wont happen.)

----------

TODO: video support
(and bug fixes).
