imagr
=====

Is an image viewer written in HTML5.


## Howto

Get the [newest release](https://github.com/danieltroger/imagr/releases/latest) (you probaly just got), extract it and place it on your webserver, ensure that we can write there, edit `config.php` to fit your needs, place your images in the root folder of this script or just simply drag and drop them into the page. Enjoy!

PS: If you are planning to use imagr in the root directory of your website, the automatic `.htaccess` creation won't work.

** ONLY IF ABOVE APPLIES TO YOU (you want to be able to reach imagr at yoursite.tld/ instead of (for example) yoursite.tld/imagr/) ** Put the following into it (the `.htaccess` file in the root directory of imagr):
```
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^download\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /download.php [L]
</IfModule>
```

----------

### The viewer GUI

When the page loads, thumbnails will be loaded onto the page (if there are any images, otherwise you will be able to upload some per drag 'n drop,) then, if you click an image, a large view will be opened, which is being closed when you click in the grey area around it.

If you double click on the large image, fullscreen will be toggled if you permit it. (Your browser will probaly ask, I've only tested this feature on Chromium (Google Chrome) and Firefox (Developer edition) so far.)

If you hit the Info button (i) you'll get some information about the image, if made available through EXIF, as an Title, uploaded by and a description (stored in mysql).

If you want to rename an image click into the Title / Description / By field and enter a new value.

When you upload images per drag 'n drop, a little orange progress bar will appear at the top of the page, displaying the total data uploaded.

### Feature enabling and disabling

You can enable and / or disable features in the ~~`features`~~ `config.php` file as you need to configure MySQL / MariaDB there.
~~The features file is in json format and you can toggle the upload and deletion features there.~~
The config file sets some variables and globals in the **PHP format**

~~**Examples**~~

We had some here but since you aren't dumb you'll make it without.

### Migrating from older `meta` files to MySQL

Check that we've got writing permission and that MySQL is setup in `config.php` (and works) and just execute `migrate.php`.

You're done.

### Building / Compressing the files

Just execute `./build.sh` within imagr's working directory in a bash-shell, you'll basically need `java` and `wget` installed.

### Preload

The viewer now preloads all images and it's metadata (into the memory O.o) if the client supports WebWorkers.

Preloading is disabled on mobile clients. (Due to cellular data usage.)

### Linking

If you open an imagr, you'll automatically get a link to it in the location bar. Anyways, here's the documentation.

Possible options are: `/imagr/#![image=<filename.jpg>,][info=<boolean>,][preload=<boolean>,][rs=<width>[x<height>],][ts=<width>[x<height>]]`

`rs` stands for real size, the size of the loaded images (the preloaded are always fullsize).

If `rs` is equal to zero (`#!rs=0`) the full image will be loaded.

If `rs` is equal to (`rs=dyn`) the image size will be adjusted depending on the window size. This is the default option.

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

### Uploading

Use drag 'n drop.
If you really want to upload images with the command line, see that you've `php` and `curl` installed and try as follows:

```
f=myimage.jpg
php -r 'echo "data:image/jpg;base64," . base64_encode(file_get_contents("'$f'"));' | curl  yoursite.tld/imagr/upload.php?name=$f\&date=$(php -r 'echo filemtime("'$f'") . "000";') -d @-
```
----------

## :/TODO/:

* ~~Movie uploading~~ This is an *image* viewer, didn't you read?
* ~~Optimizations for mobile devices~~
* Fix the "uploading image" text on the blurred canvas to be exactly centered
* ~~Themes / more design options~~ Seriously...
* Categories
* ~~Better user interface [?]~~ Look at some flowers (in real world) if you don't want to look at this crap
* ~~Somehow get more users and more people sharing their opinion about what's next ;)~~ Users may  cause problems...
* ~~Fix some more beautiful/faster generation of the info overlay~~
* ~~MySQL database support instead of JSON files~~
* ~~Renaming feature~~
