<?php
error_reporting(E_ALL);
?><!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width" />
<script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/json/json_decode.js"></script>
<script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/filesystem/file_get_contents.js"></script>
<!--<script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/array/in_array.js"></script>
<script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/var/isset.js"></script>-->
<body>
<div id="grid">
</div>
<script>
var imgs=Array(<?php
$imgs = glob("*");
$imglen = sizeof($imgs)-1;
$invalid_files_length = 0;
$invalid_extensions=Array("php","html","html~","php~","json","json~","log");
foreach($imgs as $key => $img)
{
$extension = getextension($img);
if(in_array($extension,$invalid_extensions))
{
$invalid_files_length++;
}
}
echo "/*imglength = {$imglen}, invalid_files_length = {$invalid_files_length}*/\n";
foreach($imgs as $key => $img)
{
$extension = getextension($img);
if(!in_array($extension,$invalid_extensions))
{
echo "\"{$img}\"";
if($key != $imglen-$invalid_files_length)
{
echo ",";
}
}
echo " /* file = {$img}, extension = {$extension}, key = {$key}*/\n";
}
function getextension($file)
{
$extension = explode(".",$file);
return strtolower($extension[sizeof($extension)-1]);
}
?>),grid=document.getElementById("grid"),meta=json_decode(file_get_contents("meta.json"));
imgs.forEach(
function (image) {
var imgelem=document.createElement("img");
imgelem.src=image;
imgelem.classList.add("image");
if(meta[image]!=undefined)
{
imgelem.dataset.name=meta[image].name;
imgelem.dataset.by=meta[image].by;
imgelem.dataset.description=meta[image].description;
}
grid.appendChild(imgelem);
});
</script>
<style>
.image
{
width:20%;
margin:20px;
min-width:200px;
border:7px solid white;
transition-duration:2s;
transition-property:all;
-webkit-transition-duration:2s;
-webkit-transition-property:all;
}
.image:hover
{
width:40%;
box-shadow: 5px 5px 5px grey;
}
body
{
background:black;
}
</style>
</body>
</html>
