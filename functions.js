function CE(x){return document.createElement(x)}
HTMLElement.prototype.appendChilds = function()
{
    var a = arguments
        , b = 0;
    for (; b < a.length; b++)
    {
        var c = a[b];
        if (typeof c == "object")
        {
            this.appendChild(a[b])
        }
    }
};
window.addEventListeners = function(){
    var elements = [], listeners = [], functions = [];
    $(arguments).each(function (){
      if(this.__proto__.charCodeAt != undefined) listeners.push(this);
      else if(typeof(this) == "object") elements.push(this);
      else if(typeof(this) == "function") functions.push(this);
    });
    elements.forEach(function(element){
      functions.forEach(function(func){
        listeners.forEach(function(listener){
          element.addEventListener(listener,func);
        })
      })
    })
  };
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
        if(typeof empty != "undefined" && empty != undefined) empty.style.display = "none";
        read(src);
      }
      else
      {
        alert("File: "+src.name+" is not an image");
      }
    }
}
function force_fs()
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
  while(upname == null || upname.length < 2) upname = prompt("Please enter your name","");
  var reader = new FileReader();
  reader.addEventListener("load",function (e) {
    upload(e.target.result,file.name,file.lastModified);
  });
  reader.readAsDataURL(file);
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
      var ret = JSON.parse(this.responseText);
      if(ret.success)
      {
        upload.success = true;
        upload.binary = "";
        upload.container.remove();
        imgs.push(ret.file);
        addimg(ret.file);
        mdata[ret.file] = ret.exif;
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
      upload.label.innerHTML = round(percent*100,0)+"%";
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
    upload.container.remove();
    console.log("an error occurred with upload id #"+upload.id);
  });
  xmlhttp.addEventListener("timeout",xmlhttp.abort);
  xmlhttp.addEventListener("error",xmlhttp.abort);
  xmlhttp.open("POST","upload.php?name="+upload.fname+"&date="+upload.date+"&by="+upname,true);
  xmlhttp.send(upload.image.src);
  upload.uploading = true;
  uploads.active++;
}
function loop()
{
  sidebar.style.display = uploads.queued != 0 ? "" : "none";
  // check for uploads, update the progress bar and start sending uploads when "ready"
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
  // enter presentation mode when user ist inactive for more than 3 seconds
  var diff = time() - lastmove;
  if(diff > 3)
  {
    if(!chidden) hidectl();
  }
  else
  {
    if(chidden) showctl();
  }
  // parse the location hash
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
       argr = hash.substr(2);
       args = argr.split(",");
       for(var i = 0;i<args.length;i++)
       {
         var arg = args[i].split("="),key=arg[0],value=arg[1];
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
         if(key == "overview")
         {
           if(value == "true" || value == true) if(container.style.display != "none") container.click();
         }
         if(key == "smalldev")
         {
           value == "true" || value == true ? smalldev = true : false;
         }
       }
     }
   }
   // request the next run. The browser will try to run this function 60 times per second if possible.
  requestAnimationFrame(loop);
}
function upload()
{
  var binary = arguments[0],
  fname = arguments[1],
  date = arguments[2],
  timg = new Image(),
  id = uniqid(),
  uf = CE("div"),
  label = CE("span");
  timg.src = binary;
  timg.addEventListener("load",function ()
  {
    uploads[id] = {image: timg,
    "fname": fname,
    "date": date,
    "uploaded": 0.0,
    "uploading": false,
    "id": id,
    "label": label,
    "container": uf};
    uploads.queued++;
  });
  uf.classList.add("upfile");
  timg.classList.add("upthumb");
  label.classList.add("uptext");
  label.classList.add("fade");
  timg.classList.add("fade");
  label.appendChild(document.createTextNode("Waiting..."));
  uf.appendChilds(timg,label);
  sidebar.appendChild(uf);
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
     var rt = JSON.parse(this.responseText);
     if(!rt.success) alert("Something went wrong while renaming");
      mdata[u] = rt.exif;
   }
 });
 rq.send();
}
function winwidth()
{
  var w = window,d = document,e = d.documentElement,g = d.getElementsByTagName('body')[0],x = w.innerWidth || e.clientWidth || g.clientWidth;
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
  else
  {
    lastmove = time();
  }
  if(ce && tn == "SPAN")
  {
    if(kk == 13) {e.preventDefault(); tg.blur()}
  }
}
function addimg(image)
{
  var imgelem = CE("img");
  imgelem.classList.add("loadingbg");
  if(thumbsize != 0)
  {
      imgelem.src = "download.php/resize/"+(parseInt(thumbsize)+(parseInt(thumbsize)/10))+"/"+image;
      imgelem.style.width = thumbsize+"px";
  }
  else
  {
    imgelem.src = smalldev ? "download.php/resize/110/"+image : "thumbs.dir/"+image+".jpg";
    imgelem.style.maxWidth = "10%";
  }
  imgelem.dataset.original = image;
  imgelem.classList.add("image");
  imgelem.addEventListener("click",openpic);
  grid.appendChild(imgelem);
}
function openpic(srcthumb)
{
  ib = 0;
  if(this.tagName == "IMG")
  {
    srcthumb = this;
  }
  if(srcthumb == undefined)
  {
    console.warn("srcthumb is undefined");
    return;
  }
  url = srcthumb.dataset.original;
  var blob = false, burl = imgs[url];
  if(burl != undefined && burl.substr(0,4) == "blob")
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
  img.dataset.original = url;
  location.hash = "#!image="+basename(url)+ (info ? ",info=true" : "");
  container.style.display = "";
  grid.style.webkitFilter =
  grid.style.filter = "blur(9px)";
  while(infolay.firstChild) // http://jsperf.com/innerhtml-vs-removechild
  {
    infolay.removeChild(infolay.firstChild);
  }
  var exif = mdata[url] != undefined ? mdata[url] : JSON.parse(file_get_contents("download.php/exif/"+url)),
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
       gps = isNaN(parseInt(exif['GPS'])) ? false : exif['GPS'],
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
       dl.href = blob ? burl : "download.php/"+basename(url);
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
  return acs("image",function(thumb,realsource){
    var orig = thumb.dataset.original;
    if(orig == realsource)
    {
      return thumb;
    }
  },realsource);
}
function del()
{
  var pic = img.dataset.original,
  r = JSON.parse(file_get_contents("download.php/delete/"+pic));
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
  var nextindex = (findimg(img.dataset.original == undefined ? basename(img.src) : img.dataset.original)+1);
  if(nextindex == imgs.length)
  {
    nextindex = 0;
  }
  var thumb = findthumb(imgs[nextindex]);
  if(!badbrowser)
  {
    img.style.width = img.width+"px";
    img.style.height = img.height+"px";
    img.src = thumb.src;
  }
  openpic(thumb);
}
function rstx(){if(ib&1){this.style.width = "";this.style.height =""}ib++}
function moov() {lastmove = time()}
function hidectl()
{
  chidden = true;
  //console.log("Hiding controls");
  infobut.classList.add("hidden");
  prevb.classList.add("hidden");
  nextb.classList.add("hidden");
  if(!smalldev)
  {
    img.classList.add("pmode");
    //if(info) infooverlay();
    container.style.background = "rgba(0,0,0,0.9)";
  }
}
function showctl()
{
  chidden = false;
  //console.log("Showing controls");
  infobut.classList.remove("hidden");
  prevb.classList.remove("hidden");
  nextb.classList.remove("hidden");
  if(!smalldev)
  {
    container.style.background = "";
    img.classList.remove("pmode");
  }
}
function prev(e)
{
  var previndex = findimg(img.dataset.original == undefined ? basename(img.src) : img.dataset.original)-1;
  if(previndex < 0)
  {
    previndex = (imgs.length-1);
  }
  var thumb = findthumb(imgs[previndex]);
  if(!badbrowser)
  {
    img.style.width = img.width+"px";
    img.style.height = img.height+"px";
    img.src = thumb.src;
  }
  openpic(thumb);
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
    this.style.display = "none";
    grid.style.webkitFilter =
    grid.style.filter = "";
    location.hash = "#!overview"
  }
}
if(typeof HTMLElement.prototype.remove != "function")
{
  HTMLElement.prototype.remove = function ()
  {
    this.parentElement.removeChild(this);
  }
}
function mimg(event)
{
  var target = event.target,
  x = (ix || 0) + event.dx;
  ix = x;
  x -= iwi / 2;
    target.style.webkitTransform =
    target.style.transform =
      'translate(' +x + 'px, -50%)';
}
function smimg(event)
{
  var target = event.target;
  iwi = target.clientWidth;
  target.classList.remove("fade");
  target.classList.remove("cent");
}
function emimg(event)
{
  var target = event.target;
  target.classList.add("cent");
  ix = 0;
  target.setAttribute("style","");
  target.classList.add("fade");
  var x = event.clientX;
  if(x < (winwidth()/100)*10) prev();
  if(x > (winwidth()/100)*90) next();
}
function acs(slct,code)
{
  var eles = document.getElementsByClassName(slct), ij = 0, retval = 0,rt;
  for(;ij<eles.length;ij++)
  {
    if(arguments[2] != undefined && arguments[2].length > 1)
    {
      rt = code(eles[ij],arguments[2]);
      if(!retval) retval = rt;
    }
    else{code(eles[ij])}
  }
  return retval;
}
function hidestatus(){
  acs("uptext",function(e){e.style.opacity = 0});
  acs("upfile",function(e){e.style.margin = 0})
}
function showstatus(){
  acs("uptext",function(e){e.style.opacity = 1});
  acs("upfile",function(e){e.style.margin = "0.5%"})
}
function init()
{
  window.thumbsize = 0;
  window.svg = typeof SVGRect != "undefined" && window.navigator.userAgent.indexOf("Windows") < 0 ? true : false;
  window.realsize = "dyn";
  window.argr = "";
  window.args = [];
  window.info = false;
  window.smalldev = window.innerWidth < 768;
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
  window.upname = "";
  window.imgs = [];
  window.lastmove = time();
  window.chidden = false;
  window.iwi = 0;
  window.ix = 0;
  window.ib = 0;
  window.sidebar = CE("div");
  window.badbrowser = navigator.userAgent.toLowerCase().indexOf("webkit") !== -1; // Webkit....
  window.xhr = function (){return window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")};
  var gs = grid.style;
  gs.webkitTransitionDuration =
  gs.oTransitionDuration =
  gs.msTransitionDuration =
  gs.transitionDuration = "0.7s";
  sidebar.classList.add("fade");
  sidebar.id = "sidebar";
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
  nextb.style.width = "10%";
  nextb.addEventListener("click",next);
  img.classList.add("largepic");
  img.classList.add("cent");
  img.classList.add("fade");
  img.classList.add("loadingbg");
  if(smalldev) img.classList.add("pmode");
  img.addEventListener("dblclick",fs);
  img.addEventListener("touchstart",force_fs);
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
  container.classList.add("fade");
  container.appendChilds(prevb,nextb,img,infobut,infolay);
  document.body.appendChilds(prog,grid,container,sidebar);
  sidebar.style.display = "none";
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
  loop();
  window.addEventListener("keypress",kinput);
  window.addEventListener("mousemove",moov);
  window.addEventListener("click",moov);
  window.addEventListener("touchmove",moov);
  window.addEventListener("touchstart",moov);
  window.addEventListener("touchend",moov);
  sidebar.addEventListener("mouseover",showstatus);
  sidebar.addEventListener("touchstart",showstatus);
  sidebar.addEventListener("mouseout",hidestatus);
  sidebar.addEventListener("touchend",hidestatus);
  if(!badbrowser) img.addEventListener("load",rstx);
  var o = false,
  r = false;
  window.intr = interact(img).draggable({
   inertia: true,
   onstart: smimg,
   onend: emimg,
   onmove: mimg,
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
}
