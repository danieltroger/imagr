(function() {
  if (!Event.prototype.preventDefault) {
    Event.prototype.preventDefault=function() {
      this.returnValue=false;
    };
  }
  if (!Event.prototype.stopPropagation) {
    Event.prototype.stopPropagation=function() {
      this.cancelBubble=true;
    };
  }
  if (!Element.prototype.addEventListener) {
    var eventListeners=[];

    var addEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var self=this;
      var wrapper=function(e) {
        e.target=e.srcElement;
        e.currentTarget=self;
        if (listener.handleEvent) {
          listener.handleEvent(e);
        } else {
          listener.call(self,e);
        }
      };
      if (type=="DOMContentLoaded") {
        var wrapper2=function(e) {
          if (document.readyState=="complete") {
            wrapper(e);
          }
        };
        document.attachEvent("onreadystatechange",wrapper2);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});

        if (document.readyState=="complete") {
          var e=new Event();
          e.srcElement=window;
          wrapper2(e);
        }
      } else {
        this.attachEvent("on"+type,wrapper);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
      }
    };
    var removeEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var counter=0;
      while (counter<eventListeners.length) {
        var eventListener=eventListeners[counter];
        if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
          if (type=="DOMContentLoaded") {
            this.detachEvent("onreadystatechange",eventListener.wrapper);
          } else {
            this.detachEvent("on"+type,eventListener.wrapper);
          }
          eventListeners.splice(counter, 1);
          break;
        }
        ++counter;
      }
    };
    Element.prototype.addEventListener=addEventListener;
    Element.prototype.removeEventListener=removeEventListener;
    if (HTMLDocument) {
      HTMLDocument.prototype.addEventListener=addEventListener;
      HTMLDocument.prototype.removeEventListener=removeEventListener;
    }
    if (Window) {
      Window.prototype.addEventListener=addEventListener;
      Window.prototype.removeEventListener=removeEventListener;
    }
  }
})();
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
CE = function(a)
{
    if (typeof a == "string")
    {
        return document.createElement(a)
    }
}
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2015-03-12
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

// Full polyfill for browsers with no classList support
if (!("classList" in document.createElement("_"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (index !== -1) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	if (force === true || force === false) {
		return force;
	} else {
		return !result;
	}
};
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		if (ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

} else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
	"use strict";

	var testElement = document.createElement("_");

	testElement.classList.add("c1", "c2");

	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
	// classList.remove exist but support only one argument at a time.
	if (!testElement.classList.contains("c2")) {
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];

			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;

				for (i = 0; i < len; i++) {
					token = arguments[i];
					original.call(this, token);
				}
			};
		};
		createMethod('add');
		createMethod('remove');
	}

	testElement.classList.toggle("c3", false);

	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	// support the second argument.
	if (testElement.classList.contains("c3")) {
		var _toggle = DOMTokenList.prototype.toggle;

		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};

	}

	testElement = null;
}());

}

}

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
  var reader = new FileReader();
  reader.addEventListener("load",function (e){
    upload(e.target.result,file.name,file.lastModified);
  });
  reader.readAsDataURL(file);
}
function do_upload(upload)
{
  var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  xmlhttp.addEventListener("readystatechange",function ()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      uploads.active--;
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
    if(id != "active")
    {
      var upload = uploads[id];
      percentage = upload.uploaded;
      average += percentage;
      if(!upload.uploading && uploads.active < 2)
      {
        do_upload(upload);
      }
    }
  }
  average /= uploads.active;
  if(parseInt(prog.style.width) != average)
  {
    prog.style.width = uploads.active == 0 ? "0%" : average*100+"%";
  }
  requestAnimationFrame(update_progress);
}
function upload(binary,fname,date)
{
  var MAX_WIDTH = thumbsize != 0 ? thumbsize : ((winwidth()/100)*20),
  timg = new Image(),
  id = uniqid();
  timg.src = binary;
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
    ctx.fillInversedText("Uploading image...", (timg.width/100)*20, (timg.height/100)*50);
    var ri = canvas.toDataURL(),
    i = new Image();
    canvas.remove();
    timg.remove();
    i.src = ri;
    i.classList.add("image");
    i.style.maxWidth = "19%";
    i.style.minWidth = "200px";
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

/**
 * Canvas extension: fillInversedText
 * By Ken Fyrstenberg Nilsen 2013. Beta 1.
*/
CanvasRenderingContext2D.prototype.fillInversedText = function (txt, x, y) {

    //measure
    var tw = this.measureText(txt).width;
    var th = parseInt(this.font, '10');
    th = (th === 0) ? 16 : th;

    //setupp off-screen canvas
    var co = document.createElement('canvas');
    co.width = tw;
    co.height = th;

    //fill text
    var octx = co.getContext('2d');
    octx.font = this.font;
    octx.textBaseline = 'top';
    octx.fillText(txt, 0, 0);

    //get pixel buffers
    var ddata = this.getImageData(x, y, tw, th);
    var sdata = octx.getImageData(0, 0, tw, th);

    var dd = ddata.data;
    var ds = sdata.data;
    var len = ds.length;

    //invert
    for (var i = 0; i < len; i += 4) {
        if (ds[i + 3] > 0) {
            dd[i] = (255 - dd[i]);
            dd[i + 1] = (255 - dd[i + 1]);
            dd[i + 2] = (255 - dd[i + 2]);
        }
    }

    //result at x/y
    this.putImageData(ddata, x, y);
}
function kinput(e)
{
  var kk = e.keyCode || e.which;
  if(kk == 105) infooverlay();
  if(kk == 102) fs();
  if(kk == 27) {e.preventDefault(); container.click();}
  if(kk == 39 || kk == 110) next();
  if(kk == 37 || kk == 112) prev();
  if(kk == 8 || kk == 46){ e.preventDefault(); del();}
}
function addimg(image)
{
  var imgelem=CE("img");
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
  $.data(imgelem,'original',image);
  imgelem.classList.add("image");
  if(meta[image]!=undefined)
  {
    $.data(imgelem,'by',meta[image].by);
    $.data(imgelem,'description',meta[image].description);
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
  var url = $.data(srcthumb,'original'), blob = false, burl = imgs[url];
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
      img.src="download.php/resize/"+(winwidth()/100)*95+"/"+url;
    }
    else
    {
      img.src="download.php/resize/"+realsize+"/"+url;
    }
  }
  $.data(img,'original',url);
  location.hash = "#!image="+basename(url);
  container.style.display="";
  var d = $(srcthumb).data();
  if("by" in d)
  {
    by = d.by;
  }
  else
  {
    by = meta['all'] != undefined ? meta['all'] : "Unknown";
  }
  if("description" in d)
  {
    desc = d.description;
  }
  else
  {
    desc = "Unbenannt";
  }
  infobut.style.display="";
    var exif = mdata[url] != undefined ? mdata[url] : json_decode(file_get_contents("download.php/exif/"+url)),
    inf = desc+", hochgeladen von "+by,
    lstr = blob ? "<br /><a style=\"color:white;\" download=\""+url+"\" href=\""+burl+"\">In Originalgröße downloaden</a>" : "<br /><a style=\"color:white;\" href=\"download.php/"+url+"\">In Originalgröße downloaden</a>";
    //lstr += "<br /><a style=\"color:white;\" href=\"#!image="+basename(url)+"\">Link this image</a>";
    if($.data(srcthumb,'description') == "undefined")
    {
     inf="Hochgeladen von "+$.data(srcthumb,'by');
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
      if(sw != false && sw != null) inf += ", software: "+sw;
       inf += lstr;
       if(gps != false) inf += " <a target=\"_blank\" style=\"color:white;\" href=\"http://maps.apple.com/?q="+urlencode(gps)+"\">Ort in Karten öffnen</a>";
      if(features.deleting) inf += "&nbsp;&nbsp;&nbsp;&nbsp;<button style='color: white; background: transparent; border: 1px solid white; border-radius: 5px; margin: 1px;' onclick='del(this);'>Löschen</button>";
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
  var previndex = findimg($.data(img,'original') == undefined ? basename(img.src) : $.data(img,'original'))-1;
  if(previndex < 0)
  {
    previndex = (imgs.length-1);
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

/* StackBlur - a fast almost Gaussian Blur For Canvas

Version: 	0.5
Author:		Mario Klingemann
Contact: 	mario@quasimondo.com
Website:	http://www.quasimondo.com/StackBlurForCanvas
Twitter:	@quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Or support me on flattr:
https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var mul_table = [
        512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
        454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
        482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
        437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
        497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
        320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
        446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
        329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
        505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
        399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
        324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
        268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
        451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
        385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
        332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
        289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];


var shg_table = [
	     9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
		17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
		19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
		20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];


function stackBlurCanvasRGBA( canvas, top_x, top_y, width, height, radius )
{
	if ( isNaN(radius) || radius < 1 ) return;
	radius |= 0;

	var context = canvas.getContext("2d");
	var imageData;

	try {
	  try {
		imageData = context.getImageData( top_x, top_y, width, height );
	  } catch(e) {

		// NOTE: this part is supposedly only needed if you want to work with local files
		// so it might be okay to remove the whole try/catch block and just use
		// imageData = context.getImageData( top_x, top_y, width, height );
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			imageData = context.getImageData( top_x, top_y, width, height );
		} catch(e) {
			alert("Cannot access local image");
			throw new Error("unable to access local image data: " + e);
			return;
		}
	  }
	} catch(e) {
	  alert("Cannot access image");
	  throw new Error("unable to access image data: " + e);
	}

	var pixels = imageData.data;

	var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum,
	r_out_sum, g_out_sum, b_out_sum, a_out_sum,
	r_in_sum, g_in_sum, b_in_sum, a_in_sum,
	pr, pg, pb, pa, rbs;

	var div = radius + radius + 1;
	var w4 = width << 2;
	var widthMinus1  = width - 1;
	var heightMinus1 = height - 1;
	var radiusPlus1  = radius + 1;
	var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;

	var stackStart = new BlurStack();
	var stack = stackStart;
	for ( i = 1; i < div; i++ )
	{
		stack = stack.next = new BlurStack();
		if ( i == radiusPlus1 ) var stackEnd = stack;
	}
	stack.next = stackStart;
	var stackIn = null;
	var stackOut = null;

	yw = yi = 0;

	var mul_sum = mul_table[radius];
	var shg_sum = shg_table[radius];

	for ( y = 0; y < height; y++ )
	{
		r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

		r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
		g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
		b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
		a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );

		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		a_sum += sumFactor * pa;

		stack = stackStart;

		for( i = 0; i < radiusPlus1; i++ )
		{
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack.a = pa;
			stack = stack.next;
		}

		for( i = 1; i < radiusPlus1; i++ )
		{
			p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
			r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
			g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
			b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
			a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;

			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			a_in_sum += pa;

			stack = stack.next;
		}


		stackIn = stackStart;
		stackOut = stackEnd;
		for ( x = 0; x < width; x++ )
		{
			pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
			if ( pa != 0 )
			{
				pa = 255 / pa;
				pixels[yi]   = ((r_sum * mul_sum) >> shg_sum) * pa;
				pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
				pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
			} else {
				pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
			}

			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			a_sum -= a_out_sum;

			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			a_out_sum -= stackIn.a;

			p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;

			r_in_sum += ( stackIn.r = pixels[p]);
			g_in_sum += ( stackIn.g = pixels[p+1]);
			b_in_sum += ( stackIn.b = pixels[p+2]);
			a_in_sum += ( stackIn.a = pixels[p+3]);

			r_sum += r_in_sum;
			g_sum += g_in_sum;
			b_sum += b_in_sum;
			a_sum += a_in_sum;

			stackIn = stackIn.next;

			r_out_sum += ( pr = stackOut.r );
			g_out_sum += ( pg = stackOut.g );
			b_out_sum += ( pb = stackOut.b );
			a_out_sum += ( pa = stackOut.a );

			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			a_in_sum -= pa;

			stackOut = stackOut.next;

			yi += 4;
		}
		yw += width;
	}


	for ( x = 0; x < width; x++ )
	{
		g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

		yi = x << 2;
		r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
		g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
		b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
		a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);

		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		a_sum += sumFactor * pa;

		stack = stackStart;

		for( i = 0; i < radiusPlus1; i++ )
		{
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack.a = pa;
			stack = stack.next;
		}

		yp = width;

		for( i = 1; i <= radius; i++ )
		{
			yi = ( yp + x ) << 2;

			r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
			g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
			b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
			a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;

			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			a_in_sum += pa;

			stack = stack.next;

			if( i < heightMinus1 )
			{
				yp += width;
			}
		}

		yi = x;
		stackIn = stackStart;
		stackOut = stackEnd;
		for ( y = 0; y < height; y++ )
		{
			p = yi << 2;
			pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
			if ( pa > 0 )
			{
				pa = 255 / pa;
				pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
				pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
				pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
			} else {
				pixels[p] = pixels[p+1] = pixels[p+2] = 0;
			}

			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			a_sum -= a_out_sum;

			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			a_out_sum -= stackIn.a;

			p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;

			r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
			g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
			b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
			a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));

			stackIn = stackIn.next;

			r_out_sum += ( pr = stackOut.r );
			g_out_sum += ( pg = stackOut.g );
			b_out_sum += ( pb = stackOut.b );
			a_out_sum += ( pa = stackOut.a );

			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			a_in_sum -= pa;

			stackOut = stackOut.next;

			yi += width;
		}
	}

	context.putImageData( imageData, top_x, top_y );

}

function BlurStack()
{
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 0;
	this.next = null;
}
// end stackBlur
if(typeof HTMLElement.prototype.remove != "function")
{
  HTMLElement.prototype.remove = function ()
  {
    $(this).remove();
  }
}
var thumbsize = 0,
svg = typeof SVGRect != "undefined" && window.navigator.userAgent.indexOf("Windows") < 0 ? true : false,
realsize = "dyn",
argr,args,
mobile = false,
info = false,
preload = true,
loaded = false,
mobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
grid = CE("div"),
meta = json_decode(file_get_contents("meta?"+rand(1,200))),
container = CE("div"),
isMobile = false,
desc = CE("span"),
prevb = CE("img"),
nextb = CE("img"),
img = CE("img"),
mdata = {},
empty,
prog = CE("span"),
uploads = {'active': 0};
prog.id = "progress";
container.id = "bigpic";
container.style.cursor = "pointer";
container.style.display = "none";
container.addEventListener("click",iclick);
prevb.src = svg ? "icons/prev.svg" : "icons/prev.png";
prevb.classList.add("prev");
prevb.classList.add("symbol");
prevb.classList.add("vertcent");
prevb.style.width="10%";
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
container.appendChilds(prevb,nextb,img,infobut,infolay);
function init()
{
  document.body.appendChilds(prog,grid,container);
  document.querySelector(".fileUpload").style.display = "";
  imgs.forEach(addimg);
  ety();
  lhash();
  startWorker();
  update_progress();
  window.addEventListener("keypress",kinput);
  if(features.uploading)
  {
    var upbut = document.querySelector("input");
    upbut.addEventListener("change",fqueue);
    document.body.addEventListener("dragover", function(e){e.preventDefault();});
    document.body.addEventListener("drop",fqueue);
  }
}
