function fqueue(e)
{
    e.preventDefault();
    var files = e.target.files != undefined ? e.target.files : e.dataTransfer.files,
    i = 0;
    for(; i < files.length; i++)
    {
      var src = files[i];
      if(src.type.match(/image.*/))
      {
        if(empty != undefined) empty.style.display = "none";
        read(src);
      }
      else
      {
        alert("File: "+src.name+" is not an image");
      }
    }
}
function fs()
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
}
function read(file)
{
  console.log(e.type,e.filename);
  /*
  var reader = new FileReader();
  reader.addEventListener("load",function (e){
    upload(e.target.result,file.name,file.lastModified);
  });
  reader.readAsDataURL(file);
  */
}
function do_upload(upload)
{
  var xmlhttp = new xhr();
  xmlhttp.addEventListener("readystatechange",function ()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      uploads.active--;
      uploads.queued--;
      upload.thumbnail.remove();
      var ret = json_decode(this.responseText);
      if(ret.success)
      {
        upload.success = true;
        upload.binary = "";
        imgs.push(ret.file);
        addimg(ret.file);
        console.log(ret.orig_file+" was successfully uploaded");
      }
      else
      {
        upload.success = false;
        alert("There was an error while uploading: "+ret.error+", file: "+ret.file);
      }
    }
  });
  xmlhttp.upload.addEventListener("progress",function (e)
  {
    if (e.lengthComputable)
    {
      var percent = e.loaded / e.total;
      upload.uploaded = percent;
    }
    else
    {
      console.warn("Unable to compute progress information since the total size is unknown");
    }
  });
  xmlhttp.addEventListener("abort",function ()
  {
    uploads.queued--;
    upload.success = false;
    upload.thumbnail.remove();
    console.log("an error occurred with upload id #"+upload.id);
  });
  xmlhttp.addEventListener("timeout",xmlhttp.abort);
  xmlhttp.addEventListener("error",xmlhttp.abort);
  xmlhttp.open("POST","upload.php?name="+upload.fname+"&date="+upload.date,true);
  xmlhttp.send(upload.binary);
  upload.uploading = true;
  uploads.active++;
}
function update_progress()
{
  var k = Object.keys(uploads),
  i = 0,
  l = k.length,
  average = 0;
  for(;i<l;i++)
  {
    var id = k[i];
    if(id != "active" && id != "queued")
    {
      var upload = uploads[id];
      if(upload.uploaded != 1)
      {
        percentage = upload.uploaded;
        average += percentage;
      }
      if(!upload.uploading && uploads.active < 2)
      {
        do_upload(upload);
      }
    }
  }
  average /= uploads.queued;
  average *= 100;
  var wi = uploads.queued == 0 ? "0%" : average+"%";
  if(prog.style.width != wi)
  {
    prog.style.width = wi;
  }
  requestAnimationFrame(update_progress);
}
function upload(binary,fname,date)
{
  var MAX_WIDTH = thumbsize != 0 ? thumbsize : ((winwidth()/100)*20),
  timg = new Image(),
  id = uniqid();
  if(substr(fname,-4).toLowerCase() == ".cr2")
  {
    timg.src = svg ? "icons/white.svg" : "icons/white.png";
  }
  else
  {
    timg.src = binary;
  }
  timg.addEventListener("load",function ()
  {
    MAX_WIDTH *= 2;
    if(timg.width > MAX_WIDTH)
    {
      timg.height *= MAX_WIDTH / timg.width;
      timg.width = MAX_WIDTH;
    }
    var canvas = CE("canvas"),
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = timg.width;
    canvas.height = timg.height;
    ctx.drawImage(timg, 0, 0, timg.width, timg.height);
    stackBlurCanvasRGBA(canvas,0,0, timg.width, timg.height,10);
    ctx.font = (timg.height/100)*12+'px Ubuntu';
    ctx.fillInversedText("Uploading image...", (timg.width/100)*15, (timg.height/100)*50);
    var ri = canvas.toDataURL(),
    i = new Image();
    canvas.remove();
    timg.remove();
    i.src = ri;
    i.classList.add("image");
    i.style.maxWidth = "19%";
    i.style.cursor = "progress";
    grid.appendChild(i);
    if(typeof window.scrollTo == "function") window.scrollTo(0,$(i).offset().top);
    uploads[id] = {"binary": binary,
    "fname": fname,
    "date": date,
    "uploaded": 0.0,
    "uploading": false,
    "thumbnail": i,
    "id": id};
    uploads.queued++;
  });
}

 function startWorker()
 {
   if(typeof(Worker) !== "undefined" && typeof(w) == "undefined" && preload)
   {
     w = new Worker("preload.min.js");
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
 function update()
 {
   var rq = new xhr(),
   u = url;
   rq.open("GET","download.php/rename/"+u+"/"+this.id+"/"+this.textContent,true);
   rq.addEventListener("readystatechange",function ()
   {
     if (this.readyState == 4 && this.status == 200)
     {
       if(!json_decode(this.responseText).success) alert("Something went wrong while renaming");
        var m = new xhr();
        m.open("GET","download.php/exif/"+u+"?"+rand(),false);
        m.send();
        mdata[u] = json_decode(m.response);
     }
   });
   rq.send();
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
          var arg = explode("=",args[i]),key=arg[0],value=arg[1];
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
              var hidden = (container.style.display == "none");
              if(hidden || $.data(img,'original') != value)
              {
                var t = findthumb(value);
                if(t != undefined && ($.data(img,'original') != $.data(t,'original') || hidden))
                {
                  openpic(t);
                }
              }
            }
          }
          if(key == "info")
          {
            if(value == "true" && !info)
            {
              infolay.classList.remove("closed");
              info = true;

            }
            else if(value == "false" && info)
            {
              infolay.classList.add("closed");
              info = false;
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
            if(value == "true" || value == true) if(container.style.display != "none") container.click();
          }
        }
      }
    }
}
function winwidth()
{
  var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth;
  return x;
}

function kinput(e)
{
  var tg = e.target,
  ce = tg.contentEditable,
  tn = tg.tagName,
  kk = e.keyCode || e.which;
  if(!ce || tn != "SPAN")
  {
    if(kk == 105) infooverlay();
    if(kk == 102) fs();
    if(kk == 27) {e.preventDefault(); container.click()}
    if(kk == 39 || kk == 110) next();
    if(kk == 37 || kk == 112) prev();
    if(kk == 8 || kk == 46){ e.preventDefault(); del()}
  }
  if(ce && tn == "SPAN")
  {
    if(kk == 13) {e.preventDefault(); tg.blur()}
  }
}
function addimg(image)
{
  var imgelem=CE("img");
  if(thumbsize != 0)
  {
      imgelem.src="download.php/resize/"+(parseInt(thumbsize)+(parseInt(thumbsize)/10))+"/"+image;
      imgelem.style.width = thumbsize+"px";
  }
  else
  {
    imgelem.src=smalldev ? "download.php/resize/110/"+image : "thumbs.dir/"+image+".jpg";
    imgelem.style.width="19%";
  }
  $.data(imgelem,'original',image);
  imgelem.classList.add("image");
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
  url = $.data(srcthumb,'original');
  var blob = false, burl = imgs[url];
  if(substr(burl,0,4) == "blob")
  {
    console.info("Reading image "+url+" from "+burl);
    img.src = burl;
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
      img.src="download.php/resize/"+(smalldev ? winwidth()*4 : (winwidth()/100)*95)+"/"+url;
    }
    else
    {
      img.src="download.php/resize/"+realsize+"/"+url;
    }
  }
  $.data(img,'original',url);
  location.hash = "#!image="+basename(url)+ (info ? ",info=true" : "");
  container.style.display="";
  infobut.style.display="";
  while(infolay.firstChild) // http://jsperf.com/innerhtml-vs-removechild
  {
    infolay.removeChild(infolay.firstChild);
  }
  var exif = mdata[url] != undefined ? mdata[url] : json_decode(file_get_contents("download.php/exif/"+url)),
  inf = "";
    var m = exif.meta, t = "";
    if(m == false) m = {};
    if("title" in m && m.title != "")
    {
      t += m.title;
    }
    else
    {
      t += "Unbenannt";
    }
    var spt = CE("span");
    spt.appendChild(document.createTextNode(t));
    if(features.renaming) spt.contentEditable = true;
    spt.id = "title";
    spt.addEventListener("blur",update);
    var spb = CE("span");
    spb.id = "upby";
    spb.appendChild(document.createTextNode("upby" in m && m.upby != "" ? m.upby : "Unbekannt"));
    if(features.renaming) spb.contentEditable = true;
    spb.addEventListener("blur",update);
    var spd = CE("span"),
    dxc = "description" in m && m.description != "" ? m.description : "Unbeschrieben";
    spd.id = "description";
    spd.addEventListener("blur",update);
    spd.appendChild(document.createTextNode(dxc));
    if(features.renaming) spd.contentEditable = true;
    infolay.appendChilds(spt,document.createTextNode(" von "),spb,document.createTextNode(": "),spd);
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
       if(filesize != false) inf += ", Dateigröße: "+filesize;
       if(width != false && height != false) inf += ", Abmessungen: "+width+"x"+height;
       if(sw != false && sw != null) inf += ", software: "+sw;
       infolay.appendChild(document.createTextNode(inf+" "));
       var dl = CE("a");
       dl.download = url;
       dl.href = blob ? burl : url;
       dl.appendChild(document.createTextNode("In Originalgröße downloaden"));
       infolay.appendChild(dl);
       if(gps != false)
       {
         var gpl = CE("a");
         gpl.target = "_blank";
         gpl.href = "//maps.apple.com/?q="+urlencode(gps);
         gpl.appendChild(document.createTextNode("Ort in Karten öffnen"));
         infolay.appendChild(gpl);
       }
       if(features.deleting)
       {
         infolay.appendChild(document.createTextNode("    "));
         var but = CE("button");
         but.addEventListener("click",del);
         but.classList.add("delbut");
         but.appendChild(document.createTextNode("Löschen"));
         infolay.appendChild(but);
       }
    }
  }
function infooverlay()
{
    infolay.classList.toggle("closed");
    info = infolay.classList.contains("closed") ? false : true;
    if(container.style.display != "none") location.hash = "#!image="+url+(info ? ",info=true" : "");
}
function findthumb(realsource)
{
  var thumbs = document.getElementsByClassName("image");
  for(i = 0;i<thumbs.length;i++)
  {
    if($.data(thumbs[i],'original') == realsource)
    {
      return thumbs[i];
    }
  }
}
function del()
{
  var pic = $.data(img,'original'),
  r = json_decode(file_get_contents("download.php/delete/"+pic));
  if(r.success)
  {
    //prev();
    next();
    findthumb(pic).remove();
    imgs.splice(findimg(pic),1);
    ety(true);
  }
  else
  {
    alert("Ein fehler ist beim löschen aufgetreten.");
  }
}
function next(e)
{
  spin();
  var nextindex = (findimg($.data(img,'original') == undefined ? basename(img.src) : $.data(img,'original'))+1);
  if(nextindex == imgs.length)
  {
    nextindex = 0;
  }
  var thumb = findthumb(imgs[nextindex]);
  openpic(thumb);
}
function prev(e)
{
  spin();
  var previndex = findimg($.data(img,'original') == undefined ? basename(img.src) : $.data(img,'original'))-1;
  if(previndex < 0)
  {
    previndex = (imgs.length-1);
  }
    openpic(findthumb(imgs[previndex]));
}
function spin()
{
  img.src = svg ? "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIzMjAiIGhlaWdodD0iMzIwIj4KICA8Zz4KICAgIDxsaW5lIGlkPSJsaW5lIiB4MT0iMTUiIHkxPSIxNjAiIHgyPSI2NSIgeTI9IjE2MCIgc3Ryb2tlPSIjMTExIiBzdHJva2Utd2lkdGg9IjMwIiBzdHlsZT0ic3Ryb2tlLWxpbmVjYXA6cm91bmQiLz4KICAgIDx1c2UgeGxpbms6aHJlZj0iI2xpbmUiIHRyYW5zZm9ybT0icm90YXRlKDMwLDE2MCwxNjApIiBzdHlsZT0ib3BhY2l0eTouMDgzMyIvPgogICAgPHVzZSB4bGluazpocmVmPSIjbGluZSIgdHJhbnNmb3JtPSJyb3RhdGUoNjAsMTYwLDE2MCkiIHN0eWxlPSJvcGFjaXR5Oi4xNjYiLz4KICAgIDx1c2UgeGxpbms6aHJlZj0iI2xpbmUiIHRyYW5zZm9ybT0icm90YXRlKDkwLDE2MCwxNjApIiBzdHlsZT0ib3BhY2l0eTouMjUiLz4KICAgIDx1c2UgeGxpbms6aHJlZj0iI2xpbmUiIHRyYW5zZm9ybT0icm90YXRlKDEyMCwxNjAsMTYwKSIgc3R5bGU9Im9wYWNpdHk6LjMzMzMiLz4KICAgIDx1c2UgeGxpbms6aHJlZj0iI2xpbmUiIHRyYW5zZm9ybT0icm90YXRlKDE1MCwxNjAsMTYwKSIgc3R5bGU9Im9wYWNpdHk6LjQxNjYiLz4KICAgIDx1c2UgeGxpbms6aHJlZj0iI2xpbmUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCwxNjAsMTYwKSIgc3R5bGU9Im9wYWNpdHk6LjUiLz4KICAgIDx1c2UgeGxpbms6aHJlZj0iI2xpbmUiIHRyYW5zZm9ybT0icm90YXRlKDIxMCwxNjAsMTYwKSIgc3R5bGU9Im9wYWNpdHk6LjU4MzMiLz4KICAgIDx1c2UgeGxpbms6aHJlZj0iI2xpbmUiIHRyYW5zZm9ybT0icm90YXRlKDI0MCwxNjAsMTYwKSIgc3R5bGU9Im9wYWNpdHk6LjY2NjYiLz4KICAgIDx1c2UgeGxpbms6aHJlZj0iI2xpbmUiIHRyYW5zZm9ybT0icm90YXRlKDI3MCwxNjAsMTYwKSIgc3R5bGU9Im9wYWNpdHk6Ljc1Ii8+CiAgICA8dXNlIHhsaW5rOmhyZWY9IiNsaW5lIiB0cmFuc2Zvcm09InJvdGF0ZSgzMDAsMTYwLDE2MCkiIHN0eWxlPSJvcGFjaXR5Oi44MzMzIi8+CiAgICA8dXNlIHhsaW5rOmhyZWY9IiNsaW5lIiB0cmFuc2Zvcm09InJvdGF0ZSgzMzAsMTYwLDE2MCkiIHN0eWxlPSJvcGFjaXR5Oi45MTY2Ii8+CiAgICAKICAgIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgYXR0cmlidXRlVHlwZT0iWE1MIiB0eXBlPSJyb3RhdGUiIGJlZ2luPSIwcyIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGNhbGNNb2RlPSJkaXNjcmV0ZSIKICAgIGtleVRpbWVzPSIwOy4wODMzOy4xNjY7LjI1Oy4zMzMzOy40MTY2Oy41Oy41ODMzOy42NjY2Oy43NTsuODMzMzsuOTE2NjsxIgogICAgdmFsdWVzPSIwLDE2MCwxNjA7MzAsMTYwLDE2MDs2MCwxNjAsMTYwOzkwLDE2MCwxNjA7MTIwLDE2MCwxNjA7MTUwLDE2MCwxNjA7MTgwLDE2MCwxNjA7MjEwLDE2MCwxNjA7MjQwLDE2MCwxNjA7MjcwLDE2MCwxNjA7MzAwLDE2MCwxNjA7MzMwLDE2MCwxNjA7MzYwLDE2MCwxNjAiLz4KICA8L2c+Cjwvc3ZnPg==" : "data:image/gif;base64,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";
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
function ety()
{
  if(!imgs.length)
  {
    empty = CE("div"),
    h1 = CE("h1"),
    h2 = CE("h2");
    h1.appendChild(document.createTextNode("Noch nichts da..."));//"Nothing here yet."));
    h2.appendChild(document.createTextNode("Ziehe fotos auf diese Seite um sie hochzuladen"));//"Upload something by dragging images onto this page"));
    empty.id = "empty";
    empty.classList.add("cent");
    empty.appendChild(h1);
    empty.appendChild(h2);
    document.body.appendChild(empty);
    if(arguments[0]) container.click();
  }
}
function iclick(e)
{
  if(e.target.id == this.id)
  {
    this.style.display="none";
    location.hash = "#!overview"
  }
}

if(typeof HTMLElement.prototype.remove != "function")
{
  HTMLElement.prototype.remove = function ()
  {
    $(this).remove();
  }
}
function back()
{
  img.classList.remove("move");
  img.classList.add("cent");
  img.style.top = "50%";
  img.classList.add("move");
  img.style.left = "50%";
}
var thumbsize = 0,
svg = typeof SVGRect != "undefined" && window.navigator.userAgent.indexOf("Windows") < 0 ? true : false,
realsize = "dyn",
argr,args,
info = false,
smalldev = $(window).width() < 768,
preload = smalldev ? false : true,
loaded = false,
url = "",
grid = CE("div"),
container = CE("div"),
desc = CE("span"),
prevb = CE("img"),
nextb = CE("img"),
img = CE("img"),
mdata = {},
empty,
prog = CE("span"),
uploads = {'active': 0,'queued': 0};
prog.id = "progress";
container.id = "bigpic";
container.style.cursor = "pointer";
container.style.display = "none";
container.addEventListener("click",iclick);
prevb.src = svg ? "icons/prev.svg" : "icons/prev.png";
prevb.classList.add("prev");
prevb.classList.add("symbol");
prevb.classList.add("vertcent");
prevb.style.width = "10%";
prevb.addEventListener("click",prev);
nextb.src = svg ? "icons/next.svg" : "icons/next.png";
nextb.classList.add("next");
nextb.classList.add("symbol");
nextb.classList.add("vertcent");
nextb.style.width="10%";
nextb.addEventListener("click",next);
img.classList.add("largepic");
img.classList.add("cent");
img.addEventListener("dblclick",fs);
var infobut = CE("img")
infobut.src = svg ? "icons/info.svg" : "icons/info.png";
infobut.classList.add("symbol");
infobut.style.width="7%";
infobut.style.bottom="2%";
infobut.addEventListener("click",infooverlay);
infobut.classList.add("horcent");
var infolay = CE("div");
infolay.classList.add("infolay");
infolay.classList.add("horcent");
infolay.classList.add("closed");
window.xhr = function (){return window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")};
container.appendChilds(prevb,nextb,img,infobut,infolay);
function init()
{
  document.body.appendChilds(prog,grid,container);
  imgs.forEach(addimg);
  ety();
  lhash();
  startWorker();
  update_progress();
  window.addEventListener("keypress",kinput);
  var o = false,
  r = false;
  $(img).draggable({
    start: function() {
      img.classList.remove("cent");
      img.classList.remove("move");
      o = false;
    },
    drag: function(e) {
      if(e.clientX < (winwidth()/100)*10)
      {
        o = true;
        r = false;
      }
      if(e.clientX > (winwidth()/100)*90)
      {
        o = true;
        r = true;
      }
    },
    stop: function() {
      img.style.width = ""; // reset width that jQury sets which makes the images streched
      if(!o)
      {
        back();
      }
      else
      {
        img.classList.add("move");
        if(!r)
        {
          img.style.left = -winwidth()+"px";
          setTimeout(prev,500);
          setTimeout("img.classList.remove('move');img.style.left = winwidth()+'px'",500);
          setTimeout(back,1000);
        }
        else
        {
          img.style.left = winwidth()+"px";
          setTimeout(next,500);
          setTimeout("img.classList.remove('move');img.style.left = -winwidth()+'px'",500);
          setTimeout(back,1000);
        }
      }
    },
    axis: "x"
  });
  if(features.uploading)
  {
    var upbut = document.querySelector(".upload");
    document.querySelector(".fileUpload").style.display = "";
    upbut.addEventListener("change",fqueue);
    document.body.addEventListener("dragover", function(e){e.preventDefault();});
    document.body.addEventListener("drop",fqueue);
  }
  if(features.srs == undefined)
  {
    var x = new xhr();
    x.open("GET","download.php/rawtest",true);
    x.addEventListener("readystatechange",function ()
    {
      if (this.readyState == 4 && this.status == 200)
      {
        this.response == "true" ? features.srs = true : features.srs = false;
      }
    });
    x.send();
  }
}
