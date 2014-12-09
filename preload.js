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
      postMessage([blob,oEvent.target.responseURL]);
    };
    oReq.send();
  });
}
