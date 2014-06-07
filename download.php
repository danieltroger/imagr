<?php
$paths = explode("/",substr($_SERVER["PATH_INFO"],1));
if($paths[0] == "resize")
{
$size = explode("x",strtolower($paths[1]));
$file = $paths[2];
}
else
{
$file = $paths[0];
}
if(strlen($file) < 1)
{
die("Please specify a file");
}
if(!file_exists($file))
{
die("File doesn't exist");
}
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$cont = finfo_file($finfo,$file);
if(strpos(strtolower($cont),"image/") !== false)
{
header("Content-type: {$cont}-download");
}
else
{
echo "Not an image (mime-type: {$cont} file: {$file})";
}
finfo_close($finfo);
if(!isset($size))
{
echo file_get_contents($file);
}
else
{
require "thumbs.php";
$ext = getextension($file,true);
$oname = "thumbs.dir"  . DIRECTORY_SEPARATOR . $ext[1] . "-" .  $paths[1] . "." .  $ext[0];
thumb($file,$oname,$size[0],$size[1]);
echo file_get_contents($oname);
}
