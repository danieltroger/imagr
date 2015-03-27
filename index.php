<?php
    error_reporting(E_ALL);
    header("Content-type: text/html; charset=utf-8");
    header("Expires: on, 01 Jan 1970 00:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    require "thumbs.php";
    require "imgs.php";

    // init a .htaccess if there's no one
    if(!file_exists(".htaccess"))
    {
      if(!is_writable(".")) die("Cannot create .htaccess, probaly permission denied.");
      $dir = explode("/",$_SERVER["PHP_SELF"]);
      unset($dir[sizeof($dir)-1]);
      $dir = implode("/",$dir);
      file_put_contents(".htaccess","<IfModule mod_rewrite.c>\nRewriteEngine On\nRewriteBase {$dir}\nRewriteRule ^download\.php$ - [L]\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule . {$dir}/download.php [L]\n</IfModule>");
    }
    ?><!DOCTYPE html>
    <html>
    <head>
      <title>Imagr</title>
      <meta name="viewport" content="width=device-width" />
      <script src="/phpjs.php?f=json_encode,urlencode,urldecode,explode,substr,basename,rand,isset,in_array,file_get_contents,json_decode,compat"></script>
      <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com//css?family=Ubuntu+Mono%7CUbuntu%3Aregular%2Cbold&amp;subset=Latin">
      <!--<script src="script.js"></script>-->
    <body>
    <div id="grid">
    </div>
    <div id="bigpic" style="cursor:pointer;display:none"></div>
      <script>
      var thumbsize = 0,
      realsize="dyn",
      argr,args,
      mobile=false,
      info=false,
      preload = true,
      loaded = false,
      mobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      preload = mobile ? false : true,
      imgs=Array(<?php
      imgs(1);
      ?>),
      grid=document.getElementById("grid"),
      meta=json_decode(file_get_contents("meta?"+rand(1,200))),
      container=document.getElementById("bigpic"),
      isMobile=false,
      desc=document.createElement("span"),
      prevb=document.createElement("img"),
      nextb=document.createElement("img"),
      img=document.createElement("img"),
      mdata = {};
      bigpic.addEventListener("click",function (e)
      {
        if(e.target.id == this.id)
        {
          this.style.display="none";
          location.hash = "#!overview=true"
        }
      });
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
      var infolay = document.createElement("div");
      infolay.classList.add("infolay");
      infolay.classList.add("horcent");
      infolay.classList.add("closed");
      container.appendChild(infolay);
      imgs.forEach(addimg);
      if(!imgs.length)
      {
        var empty = document.createElement("div"),
        h1 = document.createElement("h1"),
        h2 = document.createElement("h2");
        h1.appendChild(document.createTextNode("Noch nichts da..."));//"Nothing here yet."));
        h2.appendChild(document.createTextNode("Ziehe fotos auf diese Seite um sie hochzuladen"));//"Upload something by dragging images onto this page"));
        empty.id = "empty";
        empty.classList.add("cent");
        empty.appendChild(h1);
        empty.appendChild(h2);
        document.body.appendChild(empty);
      }
      function addimg(image)
      {
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
      }
        function openpic(srcthumb)
        {
          if(this.tagName == "IMG")
          {
            srcthumb = this;
          }
          if(srcthumb == undefined)
          {
            console.warn("srcthumb is undefined");
            return;
          }
          var url = srcthumb.dataset.original, blob = false, burl = imgs[url];
          if(substr(burl,0,4) == "blob")
          {
            console.info("Reading image "+url+" from "+burl);
            img.src=burl;
            blob = true;
          }
          else
          {
            if(realsize == 0)
            {
            img.src=url;
            }
            else if(realsize == "dyn")
            {
              //var cw = img.clientWidth,
              //dynsize = cw > 2 ? cw : screen.width;
              var w = window,
              d = document,
              e = d.documentElement,
              g = d.getElementsByTagName('body')[0],
              x = w.innerWidth|| e.clientWidth|| g.clientWidth;
              img.src="download.php/resize/"+(x/100)*95+"/"+url;
            }
            else
            {
              img.src="download.php/resize/"+realsize+"/"+url;
            }
          }
          img.dataset.original = url;
          location.hash = "#!image="+basename(url);
          container.style.display="";
          srcthumb.dataset.by == undefined ? srcthumb.dataset.by = (meta['all'] != undefined ? meta['all'] : "Unknown") : null;
          srcthumb.dataset.description == undefined ? srcthumb.dataset.description = "Unbenannt" : null;
          infobut.style.display="";
            var exif = mdata[url] != undefined ? mdata[url] : json_decode(file_get_contents("download.php/exif/"+url)),
            inf=srcthumb.dataset.description+", hochgeladen von "+srcthumb.dataset.by,
            lstr = blob ? "<br /><a style=\"color:white;\" download=\""+url+"\" href=\""+burl+"\">In Originalgröße downloaden</a>" : "<br /><a style=\"color:white;\" href=\"download.php/"+url+"\">In Originalgröße downloaden</a>";
            //lstr += "<br /><a style=\"color:white;\" href=\"#!image="+basename(url)+"\">Link this image</a>";
            if(srcthumb.dataset.description == "undefined")
            {
             inf="Hochgeladen von "+srcthumb.dataset.by;
            }
            if(exif != false && exif != null)
            {
             	var width = exif['width'],
             	height = exif['height'],
             	make = exif['make'],
             	model = exif['model'],
             	gps = exif['GPS'],
             	date = exif['date'],
             	iso = exif['ISO'],
             	aperture = exif['aperture'],
             	exposure = exif['exposure'],
             	filesize = exif['filesize'],
             	flash = exif['flash'],
              sw = exif['software'];
             	if(date != false) inf += ", fotografiert am "+date;
             	if(date != false && make != false && model != false)
             	{
           	    var mm = make+ " " + model;
           	    if(make == model) mm = model;
           	    if(model.indexOf(make) != -1) mm = model;
           	    inf += ", mit einer / einem "+mm;
             	}
             	else if(make != false && model != false)
             	{
           	    var mm = make+ " " + model;
           	    if(make == model) mm = model;
           	    if(model.indexOf(make) != -1) mm = model;
           	    inf += ", fotografiert mit einer / einem "+mm;
             	}
             	if(iso != false) inf += ", ISO: "+iso;
             	if(aperture != false) inf += ", Blende: "+aperture;
             	if(exposure != false) inf += ", Belichtungszeit: "+exposure;
             	if(flash != false) inf += ", Blitz aktiviert";
             	if(filesize != false) inf += ", Dateigr&ouml;sse: "+filesize;
             	if(width != false && height != false) inf += ", Abmessungen: "+width+"x"+height;
              if(sw != false && sw != null) inf += ", editiert mit "+sw;
             	inf += lstr;
             	if(gps != false) inf += " <a target=\"_blank\" style=\"color:white;\" href=\"http://maps.apple.com/?q="+urlencode(gps)+"\">Ort in Karten öffnen</a>";
            }
            /*
            TODO: fix this.
            while(infolay.firstChild) // http://jsperf.com/innerhtml-vs-removechild
            {
              infolay.removeChild(infolay.firstChild);
            }
            infolay.appendChild(document.createTextNode(inf));
            */
            infolay.innerHTML = inf;
          }
          function infooverlay()
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
            var nextindex=(findimg(img.dataset.original == undefined ? basename(img.src) : img.dataset.original)+1);
            if(nextindex == imgs.length)
            {
              nextindex = 0;
            }
            var thumb = findthumb(imgs[nextindex]);
            openpic(thumb);
          }
          function prev(e)
          {
            var previndex=findimg(img.dataset.original == undefined ? basename(img.src) : img.dataset.original)-1;
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
            window.addEventListener("keypress",function (e){var kk = e.keyCode || e.which;if(kk==39){next();}if(kk==37){prev()}});
            window.addEventListener("load",lhash);
            window.addEventListener("load",startWorker);
            var p;
            window.addEventListener("load",function ()
            {
              document.body.style.background = "black";
              p = document.querySelector("#progress");
              var elem = document.body;
              elem.addEventListener("dragover", function(e){e.preventDefault();});
              elem.addEventListener("drop", function(e)
              {
                e.preventDefault();
                var files = e.dataTransfer.files,
                i = 0;
                for(; i < files.length; i++)
                {
                  var src = files[i];
                  if(src.type.match(/image.*/))
                  {
                    read(src);
                  }
                  else
                  {
                    alert("File: "+src.name+" is not an image");
                  }
                }
              });
            });
            img.addEventListener("dblclick",function ()
            {
                // based on http://davidwalsh.name/fullscreen
                if((document.fullscreenEnabled == false) || (document.mozFullScreen == false) || (document.webkitIsFullScreen == false))
                {
                  var e = document.documentElement;
                  if(e.requestFullscreen)
                  {
                    e.requestFullscreen();
                  }
                  else if(e.mozRequestFullScreen)
                  {
                    e.mozRequestFullScreen();
                  }
                  else if(e.webkitRequestFullscreen)
                  {
                    e.webkitRequestFullscreen();
                  }
                  else if(e.msRequestFullscreen)
                  {
                    e.msRequestFullscreen();
                  }
                }
                else
                {
                  if(document.exitFullscreen)
                  {
                    document.exitFullscreen();
                  }
                  else if(document.mozCancelFullScreen)
                  {
                    document.mozCancelFullScreen();
                  }
                  else if(document.webkitExitFullscreen)
                  {
                    document.webkitExitFullscreen();
                  }
                }
              });
          function read(file)
          {
            var reader = new FileReader();
            reader.addEventListener("load",function (e){
              upload(e.target.result,file.name,file.lastModified);
            });
            reader.readAsDataURL(file);
          }
          function upload(binary,fname,date)
          {
            var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            xmlhttp.onreadystatechange=function()
            {
              if (xmlhttp.readyState==4 && xmlhttp.status == 200)
              {
                var ret = json_decode(xmlhttp.responseText);
                if(ret.success)
                {
                  imgs.push(ret.file);
                  addimg(ret.file);
                  if(imgs.length != 0 && typeof empty != "undefined" && empty != undefined && empty.style.display != "none") empty.style.display = "none";
                  alert(ret.orig_file+" was successfully uploaded");
                }
                else
                {
                  alert("There was an error while uploading: "+ret.error+", file: "+ret.file);
                }
              }
            }
            xmlhttp.open("POST","upload.php",true);
            xmlhttp.setRequestHeader("X-name",fname);
            xmlhttp.setRequestHeader("X-date",date);
            xmlhttp.send(binary);
          }
     function startWorker()
     {
       if(typeof(Worker) !== "undefined" && typeof(w) == "undefined" && preload)
       {
         w = new Worker("preload.js");
         w.onmessage = function(e)
         {
           var fname = basename(e.data[1]),
           blob = e.data[0];
           var url = (window.URL || window.webkitURL).createObjectURL(blob);
           imgs[fname] = url;
           mdata[fname] = json_decode(e.data[2]);
           console.info("WebWorker has successfully downloaded "+fname+" to "+url);
          };
          w.postMessage(imgs);
          console.info("Preload WebWorker started");
       }
     }
     function lhash()
     {
       requestAnimationFrame(lhash);
       var hash = location.hash;
       if(hash[1] == "!")
        {
          //console.info("Parsing URL paramenters...");
          if(hash.length <= 2)
          {
            console.warn("No arguments provided but #!. Stopping.");
          }
          else
          {
            argr = substr(hash,2);
            args = explode(",",argr);
            for(var i = 0;i<args.length;i++)
            {
              var arg=explode("=",args[i]),key=arg[0],value=arg[1];
              if(value == undefined)
              {
                //console.warn("No value given, assuming true");
                value = true;
              }
              if(arg.length > 2)
              {
                console.warn("Multiple values specified, using first one");
              }
              //console.log("Key: "+key+" value: "+value);
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
                if(value != "" && value != undefined)
                {
                  var hidden = (bigpic.style.display == "none");
                  if(hidden || img.dataset.original != value)
                  {
                    var t = findthumb(value);
                    if(t != undefined && (img.dataset.original != t.dataset.original || hidden))
                    {
                      openpic(t);
                    }
                  }
                }
              }
              if(key == "info")
              {
                if(value == "true")
                {
                  infolay.classList.remove("closed");
                }
                else if(value == "false")
                {
                  infolay.classList.add("closed");
                }
              }
              if(key == "preload")
              {
                //console.log(value);
                if(value == "false" || value == false) preload = false;
                if(value == "true" || value == true) preload = true;
              }
              if(key == "overview")
              {
                if(value == "true" || value == true) if(bigpic.style.display != "none") bigpic.click();
              }
            }
          }
        }
    }
    </script>
    <noscript>
      Sorry, but you need javascript to get this page working.
    </noscript>
    <style>
    #empty
    {
      color: white;
      position: fixed;
      top: 50%;
      left: 50%;
      max-width: 90%;
      max-height: 90%;
      text-align: center;
    }
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
        font-family: Ubuntu;
        /*
        fix drag 'n drop when no images are present
        */
        min-width: 97%;
        min-height: 97%;
        max-width: 100%;
        max-height: 100%;
        position: absolute;
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
          -ms-transform: translateY(-50%);
        }
        .horcent
        {
          left: 50%;
          transform: translateX(-50%);
          -webkit-transform: translateX(-50%);
          -ms-transform: translateX(-50%);
        }
        .cent
        {
          transform: translateX(-50%) translateY(-50%);
          -webkit-transform: translateX(-50%) translateY(-50%);
          -ms-transform: translateX(-50%) translateY(-50%);
        }
        .next
        {
          right:2%;
        }
        .infolay
        {
          background: none repeat scroll 0 0 rgba(0, 0, 0, 0.5);
          color: white;
          cursor: default;
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
