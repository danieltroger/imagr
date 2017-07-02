#!/bin/bash
in="$1"
img="$RANDOM"
#echo "creating blur version (in bg)"
#convert "$in" -blur 128x16 -quality 70 -resize 1920 $img-blur.jpg &
echo "creating cropped version (fhd)"
convert "$in" -quality 70 -resize 1920 $img-fhd.jpg
#echo "creating cropped version (4k, 4096p)"
#convert "$in" -quality 70 -resize 4096 $img-4k.jpg
#echo "copying full-size"
#cp "$in" $img.jpg
echo "adding to imglist"
echo $img >> imgs.list
