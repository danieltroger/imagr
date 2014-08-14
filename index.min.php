<?php
    error_reporting(E_ALL);
    header("Expires: on, 01 Jan 1970 00:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    require "thumbs.php";
    ?><!DOCTYPE html>
    <html>
    <head>
      <title>Imagr</title>
      <meta name="viewport" content="width=device-width" />
      <script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/json/json_decode.js"></script>
      <script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/filesystem/file_get_contents.js"></script>
      <script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/array/in_array.js"></script>
      <script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/var/isset.js"></script>
      <script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/math/rand.js"></script>
      <script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/filesystem/basename.js"></script>
      <script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/strings/substr.js"></script>
      <script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/strings/explode.js"></script>
      <script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/url/urldecode.js"></script>
      <script src="ie.js"></script>
    <body>
    <div id="grid">
    </div>
    <div id="bigpic" style="cursor:pointer;display:none"></div>
      <script>
      var thumbsize=0,realsize,hash=location.hash,argr,args,mobile=false;if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){mobile=true}if(mobile){realsize=screen.width*2}else{realsize=screen.width+(screen.width/10)}if(hash[1]=="!"){console.info("Parsing URL paramenters...");if(hash.length<=2){console.warn("No arguments provided but #!. Stopping.")}else{argr=substr(hash,2);args=explode("|",argr);for(var i=0;i<args.length;i++){var arg=explode("=",args[i]),key=arg[0],value=arg[1];if(value==undefined){console.warn("No value given")}if(arg.length>2){console.warn("Multiple values specified, using first one")}console.log("Key: "+key+" value: "+value);if(key=="ts"){if(value!=""){thumbsize=value}}if(key=="rs"){if(value!=""){realsize=value}}}}}var imgs=Array(<?php
        $imgs = glob("*");
        $imglen = sizeof($imgs)-1;
        $invalid_files_length = 0;
        $rkey = 0;
        $invalid_extensions=Array("php","zip","html","html~","php~","json","json~","log","svg","mov","svg~","license","dir","zip","meta","js","md");
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
      ?>),grid=document.getElementById("grid"),meta=json_decode(file_get_contents("meta?"+rand(1,200))),container=document.getElementById("bigpic"),isMobile=false,desc=document.createElement("span"),prevb=document.createElement("img"),nextb=document.createElement("img"),img=document.createElement("img");bigpic.onclick=function(a){if(a.target.id==this.id){this.style.display="none"}};prevb.src="prev.svg";prevb.classList.add("prev");prevb.classList.add("symbol");prevb.classList.add("vertcent");prevb.style.width="10%";prevb.addEventListener("click",prev);container.appendChild(prevb);nextb.src="next.svg";nextb.classList.add("next");nextb.classList.add("symbol");nextb.classList.add("vertcent");nextb.style.width="10%";nextb.addEventListener("click",next);container.appendChild(nextb);img.classList.add("largepic");img.classList.add("cent");container.appendChild(img);var infobut=document.createElement("img");infobut.src="info.svg";infobut.classList.add("symbol");infobut.style.width="7%";infobut.style.bottom="2%";infobut.addEventListener("click",infooverlay);infobut.classList.add("horcent");container.appendChild(infobut);var infolay=document.createElement("div");infolay.classList.add("infolay");infolay.classList.add("horcent");infolay.classList.add("closed");container.appendChild(infolay);imgs.forEach(function(a){var b=document.createElement("img");if(thumbsize!=0){b.src="download.php/resize/"+(parseInt(thumbsize)+(parseInt(thumbsize)/10))+"/"+a;b.style.width=thumbsize+"px"}else{b.src="thumbs.dir/"+a+".jpg";b.style.width="19%";if(mobile){b.style.width="92%"}b.style.minWidth="200px"}b.setDataAttribute("original",a);b.classList.add("image");if(meta[a]!=undefined){b.setDataAttribute("by",meta[a].by);b.setDataAttribute("description",meta[a].description)}b.addEventListener("click",openpic);grid.appendChild(b)});function openpic(c){if(this.tagName=="IMG"){c=this}if(realsize==0){img.src=c.dataset.original}else{img.src="download.php/resize/"+realsize+"/"+c.dataset.original}container.style.display="";if(c.dataset.by!=undefined){infobut.style.display="";var b=json_decode(file_get_contents("download.php/exif/"+basename(img.src))),a=c.dataset.description+", hochgeladen von "+c.dataset.by;if(c.dataset.description=="undefined"){var a="Hochgeladen von "+c.dataset.by}if(b!=false){if(b.Make!=undefined){if(b.Make==b.Model){var d=b.Model}else{var d=b.Make+" "+b.Model}infolay.innerHTML=a+",<br />fotografiert am "+b.DateTime+", mit einer "+d+", Aufl&ouml;sung: "+b.ExifImageWidth+"x"+b.ExifImageLength}else{infolay.innerHTML=a+", fotografiert am "+b.DateTime}}else{infolay.innerHTML=a}infolay.innerHTML+='<br /><a style="color:white;" href="download.php/'+basename(img.src)+'">Download</a>'}else{infobut.style.display="none";infolay.classList.add("closed")}}function infooverlay(a){infolay.classList.toggle("closed")}function findthumb(b){var a=document.getElementsByClassName("image");for(i=0;i<a.length;i++){if(a[i].dataset.original==b){return a[i]}}}function next(b){var a=(findimg(basename(img.src))+1);if(a==imgs.length){a=0}openpic(findthumb(imgs[a]))}function prev(a){var b=findimg(basename(img.src))-1;if(b<0){b=(imgs.length-1)}openpic(findthumb(imgs[b]))}function findimg(a){for(i=0;i<=imgs.length;i++){if(imgs[i]==urldecode(a)){return i}}}document.onkeyup=function(b){var a=b.keyCode||b.which;if(a==39){next()}if(a==37){prev()}};
    </script>
    <style>
  .image{margin:20px;box-shadow:5px 5px 5px grey;border:5px solid white;transition-duration:.5s;transition-property:all;-webkit-transition-duration:.5s;-webkit-transition-property:all}.image:hover{border:5px solid red;cursor:pointer;border-radius:5%}body{background:black}#bigpic{left:0;top:0;position:fixed;bottom:0;right:0;z-index:2;background:rgba(200,200,200,0.6)}.largepic{max-width:90%;box-shadow:10px 10px 20px;max-height:90%;left:50%;top:50%;z-index:3;cursor:default;position:absolute}.prev{left:2%}.symbol{background:rgba(0,0,0,0.5);border-radius:50%;position:absolute;z-index:5}.vertcent{top:50%;transform:translateY(-50%);-webkit-transform:translateY(-50%)}.horcent{left:50%;transform:translateX(-50%);-webkit-transform:translateX(-50%)}.cent{transform:translateX(-50%) translateY(-50%);-webkit-transform:translateX(-50%) translateY(-50%)}.next{right:2%}.infolay{background:none repeat scroll 0 0 rgba(0,0,0,0.5);color:#fff;cursor:default;font-family:helvetica;min-height:5%;overflow:auto;padding:10px;position:fixed;text-align:center;top:3%;transition-duration:3s;transition-property:all;width:90%;z-index:5}.closed{opacity:0;width:0;height:0}
  </style>
  </body>
  </html>
