self.onmessage=function(e)
{
  e.data.forEach(function (img)
  {
    var oReq = typeof XMLHttpRequest == "function" ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    oReq.open("GET", "download.php/"+img, false);
    oReq.responseType = "blob";
    oReq.send();
    var blob = oReq.response;
    var m = typeof XMLHttpRequest == "function" ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    m.open("GET","download.php/exif/"+img,false);
    m.send();
    var json = m.response;
    postMessage([blob,img,json]);
  });
}
