function basename(d,c){var a=d.replace(/^.*[\/\\]/g,"");if(typeof c==="string"&&a.substr(a.length-c.length)==c){a=a.substr(0,a.length-c.length)}return a};

self.onmessage=function(e)
{
  e.data.forEach(function (img)
  {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", img, false);
    oReq.responseType = "blob";
    oReq.onload = function(oEvent)
    {
      var blob = oReq.response;
      postMessage([blob,basename(oEvent.target.responseURL)]);
    };
    oReq.send();
  });
}
