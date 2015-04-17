#!/bin/bash
if [ ! -f yui.jar ]
  then
  wget --no-check-certificate -c https://github.com/yui/yuicompressor/releases/download/v2.4.8/yuicompressor-2.4.8.jar -O yui.jar
fi
echo "Removing old compressed files"
rm -rvf *.min.*
echo "Compressing files..."
for f in *.css *.js
do
  extension="${f##*.}"
  filename="${f%.*}"
  outname="$filename.min.$extension"
  echo "$f -> $outname"
  rm -fr $outname
  java -jar yui.jar $f -o $outname
done
