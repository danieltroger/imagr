<?php
error_reporting(E_ALL);
require "thumbs.php"
?><!DOCTYPE html>
<html>
<head>
<title>Fotos von der Klassenfahrt nach Granzow</title>
<meta name="viewport" content="width=device-width" />
<!--<script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/json/json_decode.js"></script>
<script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/filesystem/file_get_contents.js"></script>
<script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/array/in_array.js"></script>
<script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/var/isset.js"></script>-->
<script>function json_decode(str_json){var json=this.window.JSON;if(typeof json==="object"&&typeof json.parse==="function"){try{return json.parse(str_json)}catch(err){if(!(err instanceof SyntaxError)){throw new Error("Unexpected error type in json_decode()")}this.php_js=this.php_js||{};this.php_js.last_error_json=4;return null}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;var j;var text=str_json;cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if((/^[\],:{}\s]*$/).test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return j}this.php_js=this.php_js||{};this.php_js.last_error_json=4;return null};function file_get_contents(l,s,f,p,j){var J,c=[],z=[],A=0,B=0,C="",q=-1,d=0,y=null,F=false;var o=function(e){return e.substring(1)!==""};this.php_js=this.php_js||{};this.php_js.ini=this.php_js.ini||{};var r=this.php_js.ini;f=f||this.php_js.default_streams_context||null;if(!s){s=0}var I={FILE_USE_INCLUDE_PATH:1,FILE_TEXT:32,FILE_BINARY:64};if(typeof s==="number"){d=s}else{s=[].concat(s);for(B=0;B<s.length;B++){if(I[s[B]]){d=d|I[s[B]]}}}if(d&I.FILE_BINARY&&(d&I.FILE_TEXT)){throw"You cannot pass both FILE_BINARY and FILE_TEXT to file_get_contents()"}if((d&I.FILE_USE_INCLUDE_PATH)&&r.include_path&&r.include_path.local_value){var x=r.include_path.local_value.indexOf("/")!==-1?"/":"\\";l=r.include_path.local_value+x+l}else{if(!/^(https?|file):/.test(l)){C=this.window.location.href;q=l.indexOf("/")===0?C.indexOf("/",8)-1:C.lastIndexOf("/");l=C.slice(0,q+1)+l}}var w;if(f){w=f.stream_options&&f.stream_options.http;F=!!w}if(!f||!f.stream_options||F){var b=this.window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest();if(!b){throw new Error("XMLHttpRequest not supported")}var g=F?w.method:"GET";var n=!!(f&&f.stream_params&&f.stream_params["phpjs.async"]);if(r["phpjs.ajaxBypassCache"]&&r["phpjs.ajaxBypassCache"].local_value){l+=(l.match(/\?/)==null?"?":"&")+(new Date()).getTime()}b.open(g,l,n);if(n){var a=f.stream_params.notification;if(typeof a==="function"){if(0&&b.addEventListener){}else{b.onreadystatechange=function(e){var i={responseText:b.responseText,responseXML:b.responseXML,status:b.status,statusText:b.statusText,readyState:b.readyState,evt:e};var k;switch(b.readyState){case 0:a.call(i,0,0,"",0,0,0);break;case 1:a.call(i,0,0,"",0,0,0);break;case 2:a.call(i,0,0,"",0,0,0);break;case 3:k=b.responseText.length*2;a.call(i,7,0,"",0,k,0);break;case 4:if(b.status>=200&&b.status<400){k=b.responseText.length*2;a.call(i,8,0,"",b.status,k,0)}else{if(b.status===403){a.call(i,10,2,"",b.status,0,0)}else{a.call(i,9,2,"",b.status,0,0)}}break;default:throw"Unrecognized ready state for file_get_contents()"}}}}}if(F){var H=(w.header&&w.header.split(/\r?\n/))||[];var v=false;for(B=0;B<H.length;B++){var E=H[B];var D=E.search(/:\s*/);var m=E.substring(0,D);b.setRequestHeader(m,E.substring(D+1));if(m==="User-Agent"){v=true}}if(!v){var t=w.user_agent||(r.user_agent&&r.user_agent.local_value);if(t){b.setRequestHeader("User-Agent",t)}}y=w.content||null}if(d&I.FILE_TEXT){var u="text/html";if(w&&w["phpjs.override"]){u=w["phpjs.override"]}else{var h=(r["unicode.stream_encoding"]&&r["unicode.stream_encoding"].local_value)||"UTF-8";if(w&&w.header&&(/^content-type:/im).test(w.header)){u=w.header.match(/^content-type:\s*(.*)$/im)[1]}if(!(/;\s*charset=/).test(u)){u+="; charset="+h}}b.overrideMimeType(u)}else{if(d&I.FILE_BINARY){b.overrideMimeType("text/plain; charset=x-user-defined")}}try{if(w&&w["phpjs.sendAsBinary"]){b.sendAsBinary(y)}else{b.send(y)}}catch(G){return false}J=b.getAllResponseHeaders();if(J){J=J.split("\n");for(A=0;A<J.length;A++){if(o(J[A])){z.push(J[A])}}J=z;for(B=0;B<J.length;B++){c[B]=J[B]}this.$http_response_header=c}if(p||j){if(j){return b.responseText.substr(p||0,j)}return b.responseText.substr(p)}return b.responseText}return false};function basename(e,d){var a=e;var c=a.charAt(a.length-1);if(c==="/"||c==="\\"){a=a.slice(0,-1)}a=a.replace(/^.*[\/\\]/g,"");if(typeof d==="string"&&a.substr(a.length-d.length)==d){a=a.substr(0,a.length-d.length)}return a};/*copypasta*/</script>
<body>
<div id="grid">
</div>
<div id="bigpic" style="cursor:pointer;display:none"></div>
<script>
  var imgs=Array(<?php
    $imgs = glob("*");
    $imglen = sizeof($imgs)-1;
    $invalid_files_length = 0;
    $rkey = 0;
    $invalid_extensions=Array("php","html","html~","php~","json","json~","log","svg","mov","svg~","license","dir","zip","meta");
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
        echo "\"" . thumb($img) . "\"";
        if($rkey != $imglen-$invalid_files_length)
        {
          echo ",";
        }
      $rkey++;
      }
      echo " /* file = {$img}, extension = {$extension}, key = {$key}, rkey = {$rkey}*/\n";
    }
    ?>),
    grid=document.getElementById("grid"),
    meta=json_decode(file_get_contents("meta")),
    container=document.getElementById("bigpic"),
    isMobile=false,
    desc=document.createElement("span"),
    prevb=document.createElement("img"),
    nextb=document.createElement("img"),
    img=document.createElement("img");
    bigpic.onclick=function (e)
    {
  if(e.target.id == this.id)
  {
  this.style.display="none";
  }
  }
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
  {
    isMobile=true;
  }
  prevb.src="prev.svg";
  prevb.classList.add("prev");
  prevb.classList.add("symbol");
  prevb.classList.add("vertcent");
  prevb.style.width="10%";
  prevb.addEventListener("click",prev);
  container.appendChild(prevb);
  nextb.src="next.svg";
  nextb.classList.add("next");
  nextb.classList.add("symbol");
  nextb.classList.add("vertcent");
  nextb.style.width="10%";
  nextb.addEventListener("click",next);
  container.appendChild(nextb);
  img.classList.add("largepic");
  img.classList.add("cent");
  container.appendChild(img);
  var infobut=document.createElement("img")
  infobut.src="info.svg"
  infobut.classList.add("symbol");
  infobut.style.width="7%";
  infobut.style.bottom="2%";
  infobut.addEventListener("click",infooverlay);
  infobut.classList.add("horcent");
  container.appendChild(infobut);
  var infolay=document.createElement("div");
  infolay.classList.add("infolay");
  infolay.classList.add("horcent");
  infolay.classList.add("closed");
  container.appendChild(infolay);
  imgs.forEach(
    function (image) {
      var imgelem=document.createElement("img");
      imgelem.src="thumbs.dir/"+image+".jpg";
      imgelem.dataset.original=image;
      imgelem.width=50;
      imgelem.classList.add("image");
      if(isMobile){imgelem.classList.add("mobile");}
      if(meta[image]!=undefined)
      {
        imgelem.dataset.by=meta[image].by;
        imgelem.dataset.description=meta[image].description;
      }
      imgelem.addEventListener("click",openpic);
      grid.appendChild(imgelem);
    });
    function openpic(srcthumb)
    {
if(this.tagName == "IMG")
{
srcthumb = this;
}
      img.src=srcthumb.dataset.original;
      container.style.display="";
      if(srcthumb.dataset.by != undefined)
      {
        infobut.style.display="";
var exif = json_decode(file_get_contents("download.php/exif/"+basename(img.src))),basic=srcthumb.dataset.description+", hochgeladen von "+srcthumb.dataset.by;
if(srcthumb.dataset.description == "undefined")
{
var basic="Hochgeladen von "+srcthumb.dataset.by;
}
console.log(basic);
if(exif != false)
{
if(exif['Make'] != undefined)
{
        infolay.innerHTML=basic+",<br />fotografiert am "+exif['DateTime']+", mit einer " +exif['Make'] + " "+ exif['Model'];
}
else
{
 infolay.innerHTML=basic+", fotografiert am "+exif['DateTime'];
}
}
else
{
 infolay.innerHTML=basic;
}
infolay.innerHTML += "<br /><a style=\"color:white;\" href=\"download.php/"+basename(img.src)+"\">Download</a>";
      }
      else
      {
infobut.style.display="none";
infolay.classList.add("closed");
  }
  }
  function infooverlay(e)
  {
   infolay.classList.toggle("closed");
  }

function findthumb(realsource)
{
var thumbs = document.getElementsByClassName("image");
for(i = 0;i<thumbs.length;i++)
{
if(thumbs[i].dataset.original == realsource)
{
return thumbs[i];
}
}
}
  function next(e)
  {
  var nextindex=(findimg(basename(img.src))+1);
  if(nextindex == imgs.length)
   {
     nextindex = 0;
   }
  openpic(findthumb(imgs[nextindex]));
  }
  function prev(e)
  {
    var previndex=findimg(basename(img.src))-1;
    if(previndex < 0)
     {
       previndex=(imgs.length-1);
     }
   openpic(findthumb(imgs[previndex]));
  }
  function findimg(imgurl)
  {
    for(i=0;i<=imgs.length;i++)
  {
  if(imgs[i] == imgurl)
  {
  return i;
  }
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
.image.mobile
{
width:90%;
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
z-index:3;
cursor:default;
position: absolute;
}
.prev
{
left:2%;
}
.symbol
{
background: rgba(0, 0, 0, 0.5);
border-radius: 50%;
position: absolute;
z-index:5;
}
.vertcent
{
top: 50%;
transform: translateY(-50%);
-webkit-transform: translateY(-50%);
}
.horcent
{
left: 50%;
transform: translateX(-50%);
-webkit-transform: translateX(-50%);
}
.cent
{
transform: translateX(-50%) translateY(-50%);
-webkit-transform: translateX(-50%) translateY(-50%);
}
.next
{
right:2%;
}
.infolay
{
    background: none repeat scroll 0 0 rgba(0, 0, 0, 0.5);
    color: #FFFFFF;
    cursor: default;
    font-family: helvetica;
    min-height: 5%;
    overflow: auto;
    padding: 10px;
    position: fixed;
    text-align: center;
    top: 3%;
    transition-duration: 3s;
    transition-property: all;
    width: 90%;
    z-index: 5;
}
.closed
{
opacity:0;
width:0;
height:0;
}

</style>
</body>
</html>

