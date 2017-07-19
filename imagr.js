window.onload = function()
{
  window.images = document.getElementsByClassName("idiv");
  window.i = 0;
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
  hi(i);
  ri(i);
  i = ni(i);
  di(i);
  setTimeout("si("+i+");",20);
}
function prev()
{
  hi(i);
  ri(i);
  i = li(i);
  di(i);
  setTimeout("si("+i+");",20);
}
function ri(i)
{
  setTimeout("images["+i+"].style.display = \"none\";",1000);
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
