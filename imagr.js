window.onload = function()
{
  // define globals
  window.images = document.getElementsByClassName("idiv");
  window.i = 0;
  document.getElementsByTagName("h1")[0].remove(); // remove "loading text"
  // if there's an image in the url, display it as first image
  if(location.hash.substr(1).length > 0)
  {
    var ti = fi(parseInt(location.hash.substr(1)));
    i = ti;
    di(i);
    si(i);
  }
  else // display first image in images
  {
    di(0);
    si(0);
  }
  window.onhashchange = function(e)
  {
    var ti = fi(parseInt(e.newURL.split("#")[1]));
    hi(i);
    ri(i);
    i = ti;
    di(i);
    setTimeout("si("+i+");",100);
  }
  // show next and previous buttons
  document.getElementById("prev").style.opacity = "1";
  document.getElementById("next").style.opacity = "1";
  // add event handlers for next and previous buttons
  document.getElementById("prev").onclick = prev;
  document.getElementById("next").onclick = next;
};
window.onkeypress = function (e){ // set previous and next keyboard shortcuts
  var k = e.which || e.keyCode;
  if(k == 32 || k == 39){next()}
  if(k == 37){prev()}
}
function next() // shows the next image to the one currently being shown
{
  uh(ni(i));
}
function prev() // shows the previous image to the one currently being shown
{
  uh(li(i));
}
function ri(im) // remove image, "removes" an image (per display:none) after one second if abrt hasn't been set until then
{
  ris = new Date/1000;
  setTimeout("(function(){if(i == "+im+"){return}images["+im+"].style.display = \"none\";})();",500);
}
function di(im) // display image, unsets an image's display style
{
  images[im].style.display = "";
}
function si(im) // show image, counterpart of hi
{
  images[im].children[0].classList.add("visible");
  images[im].children[1].classList.add("large");
}
function hi(im) // hide image, remove's the background and image element's 'visible' and 'large' classes
{
  images[im].children[0].classList.remove("visible");
  images[im].children[1].classList.remove("large");
}
function ni(im) // next image (returns image in images after im)
{
  im++;
  if(im >= images.length){im = 0}
  return im;
}
function li(im) // last image (returns image in images before im)
{
  im--;
  if(im < 0){im = images.length-1;}
  return im;
}
function uh(im) // update hash, updates location.hash to show the id of im
{
  location.hash = ifi(im);
}
function ifi(im) // id from image, finds the id of the image im in images, counterpart of fi
{
  return images[im].children[1].src.split("/")[4].split("-")[0];
}
function fi(id) // find index in images of given id
{ // the images file name is currently <random>-fhd.jpg, so we find the index of the image of <random>
  for(var j = 0; j < images.length; j++)
  {
    if(ifi(j) == id)
    {
      return j;
    }
  }
}
