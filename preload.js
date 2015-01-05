self.onmessage=function(e)
{
  e.data.forEach(function (img)
  {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", img, false);
    oReq.responseType = "blob";
    oReq.send();
    var blob = oReq.response;
    var m = new XMLHttpRequest();
    m.open("GET","download.php/exif/"+img,false);
    m.send();
    var json = m.response;
    postMessage([blob,oReq.responseURL,json]);
  });
}
