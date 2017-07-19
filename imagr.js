window.onload = function()
{
  window.images = document.getElementsByClassName("idiv");
  window.i = 0;
  window.abrt = 0;
  window.ris = new Date/1000;
  window.direction = 1;
  document.getElementsByTagName("h1")[0].remove();
  images[0].style.display = "";
  images[0].children[0].classList.add("visible");
  images[0].children[1].classList.add("large");
  document.getElementById("prev").style.opacity = "1";
  document.getElementById("next").style.opacity = "1";
  document.getElementById("prev").onclick = prev;
  document.getElementById("next").onclick = next;
};
window.onkeypress = function (e){
  var k = e.which || e.keyCode;
  if(k == 32 || k == 39){next()}
  if(k == 37){prev()}
}
function next()
{
  var diff = (new Date/1000)-ris;
  console.log(diff);
  if(diff < 1){if(direction == 0){abrt++}}
  hi(i);
  ri(i);
  i = ni(i);
  di(i);
  setTimeout("si("+i+");",100);
  direction = 1;
}
function prev()
{
  var diff = (new Date/1000)-ris;
  console.log(diff);
  if(diff < 1){if(direction == 1){abrt++}}
  hi(i);
  ri(i);
  i = li(i);
  di(i);
  setTimeout("si("+i+");",100);
  direction = 0;
}
function ri(i)
{
  ris = new Date/1000;
  setTimeout("(function(){console.log(abrt);if(abrt > 0){abrt--;return}images["+i+"].style.display = \"none\";})();",1000);
}
function di(i)
{
  images[i].style.display = "";
}
function si(i)
{
  images[i].children[0].classList.add("visible");
  images[i].children[1].classList.add("large");
}
function hi(i)
{
  images[i].children[0].classList.remove("visible");
  images[i].children[1].classList.remove("large");
}
function ni(i)
{
  i++;
  if(i >= images.length){i = 0}
  return i;
}
function li(i)
{
  i--;
  if(i < 0){i = images.length-1;}
  return i;
}
