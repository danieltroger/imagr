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
      <script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/url/urlencode.js"></script>
      <script src="ie.js"></script>
    <body>
    <div id="grid">
    </div>
    <div id="bigpic" style="cursor:pointer;display:none"></div>
      <script>
      var thumbsize = 0,realsize,hash=location.hash,argr,args,mobile=false,spic=undefined,info=false;
      if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){mobile=true}
      if(mobile)
      {
        realsize=screen.width*2; // in case of retina & co
      }
      else
      {
        realsize=screen.width+(screen.width/10);
      }
      if(hash[1] == "!")
        {
          console.info("Parsing URL paramenters...");
          if(hash.length <= 2)
          {
            console.warn("No arguments provided but #!. Stopping.");
          }
          else
            {
              argr=substr(hash,2);
              args=explode("|",argr);
              for(var i = 0;i<args.length;i++)
              {
                var arg=explode("=",args[i]),key=arg[0],value=arg[1];
                if(value == undefined)
                {
                  console.warn("No value given");
                }
                if(arg.length > 2)
                {
                  console.warn("Multiple values specified, using first one");
                }
                console.log("Key: "+key+" value: "+value);
                if(key == "ts")
                {
                  if(value != "")
                  {
                    thumbsize=value;
                  }
                }
                if(key == "rs")
                {
                  if(value != "")
                  {
                    realsize=value;
                  }
                }
                if(key == "image")
                {
                  if(value != "")
                  {
                    spic = value;
                  }
                }
                if(key == "info")
                {
                  if(value == "true")
                  {
                    info = true;
                  }
                }
              }
            }
        }
      var imgs=Array(<?php
        $imgs = glob("*");
        $imglen = sizeof($imgs)-1;
        $invalid_files_length = 0;
        $rkey = 0;
        $invalid_extensions=Array("php","zip","ign","html","html~","php~","json","json~","log","svg","mov","svg~","license","dir","zip","meta","js","md");
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
      meta=json_decode(file_get_contents("meta?"+rand(1,200))),
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
          if(thumbsize != 0)
          {
              imgelem.src="download.php/resize/"+(parseInt(thumbsize)+(parseInt(thumbsize)/10))+"/"+image;
              imgelem.style.width=thumbsize+"px";
          }
          else
          {
            imgelem.src="thumbs.dir/"+image+".jpg";
            imgelem.style.width="19%";
            if(mobile){imgelem.style.width="92%";}
            imgelem.style.minWidth="200px";
          }
          imgelem.setDataAttribute("original",image);
          imgelem.classList.add("image");
          if(meta[image]!=undefined)
          {
            imgelem.setDataAttribute("by",meta[image].by);
            imgelem.setDataAttribute("description",meta[image].description);
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
            if(realsize == 0)
            {
            img.src=srcthumb.dataset.original;
            }
            else
            {
              img.src="download.php/resize/"+realsize+"/"+srcthumb.dataset.original;
            }
            container.style.display="";
            if(srcthumb.dataset.by != undefined)
            {
              infobut.style.display="";
              var exif = json_decode(file_get_contents("download.php/exif/"+basename(img.src))),
              inf=srcthumb.dataset.description+", hochgeladen von "+srcthumb.dataset.by,
              dlstr = "<br /><a style=\"color:white;\" href=\"download.php/"+basename(img.src)+"\">Download</a>";
              if(srcthumb.dataset.description == "undefined")
              {
               inf="Hochgeladen von "+srcthumb.dataset.by;
              }
                if(exif != false)
                {
                    /*
                    width  2774
                    height 1943
                    make "SONY"
                    model "DSC-W120"
                    GPS false
                    date "2014:06:04 08:26:28"
                    ISO 125
                    aperture "7"
                    exposure "1/200"
                    filesize "2.08 MiB"
                 	*/
                 	var width = exif['width'],
                 	height = exif['height'],
                 	make = exif['make'],
                 	model = exif['model'],
                 	gps = exif['GPS'],
                 	date = exif['date'],
                 	iso = exif['ISO'],
                 	aperture = exif['aperture'],
                 	exposure = exif['exposure'],
                 	filesize = exif['filesize'];
                 	inf += "<br />";
                 	if(date != false) inf += ", fotografiert am "+date;
                 	if(date != false && make != false && model != false)
                 	{
                 	    var mm = make+ " " + model;
                 	    if(make == model) mm = model;
                 	    inf += ", mit einer "+mm;
                 	}
                 	if(make != false && model != false)
                 	{
                 	    var mm = make+ " " + model;
                 	    if(make == model) mm = model;
                 	    inf += ", fotografiert mit einer "+mm;
                 	}
                 	if(iso != false) inf += ", ISO: "+iso;
                 	if(aperture != false) inf += ", Blende: "+aperture;
                 	if(exposure != false) inf += ", Belichtungszeit: "+exposure+" sekunde(n)";
                 	if(filesize != false) inf += ", Dateigr&ouml;sse: "+filesize;
                 	inf += dlstr;
                 	if(gps != false) inf += "<a style=\"color:white;\" href=\"http://maps.apple.com/?q="+urlencode(gps)+"\">View on maps</a>";
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
                        if(imgs[i] == urldecode(imgurl))
                        {
                          return i;
                        }
                      }
                    }
                    document.onkeyup=function (e){var kk = e.keyCode || e.which;if(kk==39){next();}if(kk==37){prev()}};
    window.onload=function ()
    {
    if(spic != undefined)
    {
       var ps=findthumb(spic);
       if(ps != undefined)
       {
        openpic(ps);
       }
       if(info){infolay.classList.remove("closed")}
     }
     }
    </script>
    <style>
    .image
    {
      margin:20px;
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
