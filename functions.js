function fqueue(e)
{
    e.preventDefault();
    var files = e.target.files != undefined ? e.target.files : e.dataTransfer.files,
    i = 0;
    for(; i < files.length; i++)
    {
      var src = files[i],
      raw = (substr(src.name,-3).toLowerCase() == "cr2");
      if(src.type.match(/image.*/) || raw)
      {
        if(typeof empty != "undefined" && empty != undefined) empty.style.display = "none";
        read(src,raw);
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
function read(file,raw)
{
  while(upname == null || upname.length < 2) upname = prompt("Please enter your name","");
  if(raw && !features.srs && !smalldev && features.uploading)
  {
    raws.push(file);
  }
  else
  {
    var reader = new FileReader();
    reader.addEventListener("load",function (e) {
      upload(e.target.result,file.name,file.lastModified);
    });
    reader.readAsDataURL(file);
  }
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
  var mr = new xhr(),
  u = basename(upload.fname); // TODO: do the following in the request which is being sent above
  mr.open("GET","download.php/rename/"+u+"/upby/"+upname,true);
  mr.addEventListener("readystatechange",function ()
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
  mr.send();
  // three requests for one upload, a shame :( ....
  upload.uploading = true;
  uploads.active++;
}
function parsed(canvas,file)
{
  console.log(canvas,file);
  // rawViewer.previews.image_filenamecr2.getMetadata()
  // TODO: need to do something smart with that.
  upload(canvas.toDataURL("image/jpeg"),file.name+".jpg",file.lastModified);
  canvas.remove();
  raws.splice(0,1);
  busy = false;
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
      if(!upload.uploading && uploads.active < 1)
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
    $('html,body').animate({scrollTop: $(i).offset().top}, 1000);
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
      imgelem.src = "download.php/resize/"+(parseInt(thumbsize)+(parseInt(thumbsize)/10))+"/"+image;
      imgelem.style.width = thumbsize+"px";
  }
  else
  {
    imgelem.src = smalldev ? "download.php/resize/110/"+image : "thumbs.dir/"+image+".jpg";
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
  $('html,body').animate({scrollTop: $(srcthumb).offset().top}, 1000);
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
    img.src = url;
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
  container.style.display = "";
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
  img.src = "";
  var nextindex = (findimg($.data(img,'original') == undefined ? basename(img.src) : $.data(img,'original'))+1);
  if(nextindex == imgs.length)
  {
    nextindex = 0;
  }
  var thumb = findthumb(imgs[nextindex]);
  openpic(thumb);
}
function moov()
{
  if(chidden) showctl();
  clearTimeout(htimeout);
  var now = time(),
  diff = now - lastmove;
  lastmove = now;
  htimeout = setTimeout(hidectl,2000);
}
function hidectl()
{
  chidden = true;
  console.log("Hiding controls");
  infobut.classList.add("hidden");
  prevb.classList.add("hidden");
  nextb.classList.add("hidden");
  img.classList.add("pmode");
  bigpic.style.background = "rgba(0,0,0,0.9)";
  if(info) infooverlay();
}
function showctl()
{
  chidden = false;
  console.log("Showing controls");
  infobut.classList.remove("hidden");
  prevb.classList.remove("hidden");
  nextb.classList.remove("hidden");
  img.classList.remove("pmode");
  bigpic.style.background = "";
}
function prev(e)
{
  img.src = "";
  var previndex = findimg($.data(img,'original') == undefined ? basename(img.src) : $.data(img,'original'))-1;
  if(previndex < 0)
  {
    previndex = (imgs.length-1);
  }
    openpic(findthumb(imgs[previndex]));
}
function findimg(imgurl)
{
  for(i = 0;i <= imgs.length;i++)
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
function rawloop()
{
  if(raws.length > 0 && !busy && !smalldev && features.uploading)
  {
    busy = true;
    rawViewer.readFile(raws[0], parsed);
  }
  setTimeout(rawloop,3000);
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

function init()
{
  window.thumbsize = 0;
  window.svg = typeof SVGRect != "undefined" && window.navigator.userAgent.indexOf("Windows") < 0 ? true : false;
  window.realsize = "dyn";
  window.argr = "";
  window.args = [];
  window.info = false;
  window.smalldev = $(window).width() < 768;
  window.preload = false;
  window.loaded = false;
  window.url = "";
  window.grid = CE("div");
  window.container = CE("div");
  window.desc = CE("span");
  window.prevb = CE("img");
  window.nextb = CE("img");
  window.img = CE("img");
  window.mdata = {};
  window.empty;
  window.prog = CE("span");
  window.uploads = {'active': 0,'queued': 0};
  window.raws = [];
  window.busy = false;
  window.upname = "";
  window.imgs = [];
  window.lastmove = 0;
  window.htimeout = 0;
  window.chidden = false;
  window.xhr = function (){return window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")};
  prog.id = "progress";
  container.id = "bigpic";
  container.style.cursor = "pointer";
  container.style.display = "none";
  container.addEventListener("click",iclick);
  prevb.src = svg ? "icons/prev.svg" : "icons/prev.png";
  prevb.classList.add("prev");
  prevb.classList.add("symbol");
  prevb.classList.add("vertcent");
  prevb.classList.add("fade");
  prevb.style.width = "10%";
  prevb.addEventListener("click",prev);
  nextb.src = svg ? "icons/next.svg" : "icons/next.png";
  nextb.classList.add("next");
  nextb.classList.add("symbol");
  nextb.classList.add("vertcent");
  nextb.classList.add("fade");
  nextb.style.width="10%";
  nextb.addEventListener("click",next);
  img.classList.add("largepic");
  img.classList.add("cent");
  img.classList.add("fade");
  img.addEventListener("dblclick",fs);
  window.infobut = CE("img");
  infobut.src = svg ? "icons/info.svg" : "icons/info.png";
  infobut.classList.add("symbol");
  infobut.style.width = "7%";
  infobut.style.bottom = "2%";
  infobut.addEventListener("click",infooverlay);
  infobut.classList.add("horcent");
  infobut.classList.add("fade");
  window.infolay = CE("div");
  infolay.classList.add("infolay");
  infolay.classList.add("horcent");
  infolay.classList.add("closed");
  container.appendChilds(prevb,nextb,img,infobut,infolay);
  document.body.appendChilds(prog,grid,container);
  var mdts = Object.keys(files).sort(),
  i = 0;
  for(; i < mdts.length; i++)
  {
    var imag = files[mdts[i]];
    if(typeof imag != "string")
    {
      imag.forEach(function (image)
      {
        addimg(image);
        imgs.push(image);
      });
    }
    else
    {
      addimg(imag);
      imgs.push(imag);
    }
  }
  ety();
  lhash();
  startWorker();
  update_progress();
  rawloop();
  window.addEventListener("keypress",kinput);
  if(!smalldev)
  {
    window.addEventListener("mousemove",moov);
    window.addEventListener("touchmove",moov);
    window.addEventListener("touchstart",moov);
    window.addEventListener("click",moov);
  }
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
    if(!features.srs && !smalldev)
    {
      var x = new xhr();
      x.open("GET","raw.min.js",false);
      x.send();
      eval(x.responseText);
      window.rawViewer = new Rawson.Viewer('preview',{
          formats: {
              read: ['RAW']
          },
          controls: [
              new Rawson.Control.FileProgress()
          ]
      });
    }
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
