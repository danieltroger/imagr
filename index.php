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
<div id="bigpic" style="display:none"></div>
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
?>),grid=document.getElementById("grid"),meta=json_decode(file_get_contents("meta.json")),container=document.getElementById("bigpic");;
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
imgelem.addEventListener("click",openpic);
grid.appendChild(imgelem);
});
function openpic(e)
{
var img=document.createElement("img"),desc=document.createElement("span");
container.style.display="";
container.innerHTML="";
img.src=this.src;
img.classList.add("largepic");
container.appendChild(img);
if(this.dataset.description != undefined)
{
img.dataset.title=this.dataset.description+", by "+this.dataset.by;
}
}
</script>
<style>
.image
{
width:19%;
margin:20px;
min-width:200px;
box-shadow: 5px 5px 5px grey;
border:5px solid white;
transition-duration:0.5s;
transition-property:all;
-webkit-transition-duration:0.5s;
-webkit-transition-property:all;
}
.image:hover
{
border: 5px solid red;
cursor: pointer;
border-radius:5%;
}
body
{
background:black;
}
#bigpic
{
left: 0px;
top: 0px;
position: fixed;
bottom: 0px;
right: 0px;
z-index: 2;
background: rgba(200, 200, 200, 0.6);
}
.largepic
{
max-width:90%;
box-shadow: 10px 10px 20px;
max-height: 90%;
left: 50%;
top: 50%;
position: absolute;
transform: translateY(-50%) translateX(-50%);
}
</style>
</body>
</html>
