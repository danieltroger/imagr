imagr
=====

Is an image and move viewer written in HTML5.

## Howto

Upload your images with the upload script (the script must have write permission to write to the directory where imagr is) or place them in the "root directory" of image. Enjoy!

----------

### Preload

The viewer now preloads all images (into the memory O.o) if the client supports WebWorkers.

Preloading is disabled on mobile clients. (Due to cellular data usage.)

### Linking

If you open an image if you automatically get a link to it in the location bar. Anyways, here's the documentation.

Possible options are: `/imagr/#![image=<filename.jpg>,][info=<boolean>,][preload=<boolean>,][rs=<width>[x<height>],][ts=<width>[x<height>]]`

`rs` stands for real size, the size of the loaded images (the preloaded are always fullsize).

`ts` stands for thumbnail size.

### Downloading

On the info page of each image, there's a download button.

Additionally, there now is the ability to download all images.

What you need:
- A working internet connection
- A terminal with a shell that supports Process substitution
- wget installed (Use for example [homebrew](http://brew.sh) on mac osx to then execute `brew install wget`, on ubuntu, try `sudo apt-get install wget`)
- Free disk space

Then execute this:
```
cd /target/directory/
wget -ci <(wget -qO - http://yoursite.tld/imagr/wget.php)
```

For example,
```
cd /home/daniel/Pictures/shared
wget -ci <(wget -qO - http://natur-kultur.eu/shared/wget.php)
```
----------
