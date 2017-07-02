<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>ImgView</title>
    <style type="text/css">
    body
    {
      margin: 0;
      background: black;
    }
    #prev{left: 2%;}
    #next{right: 2%;}
    .pn
    {
      transition-duration: 1;
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      width: 20%;
    }
    .bgdiv
    {
      z-index: 1;
      filter: blur(20px);
      background-size: cover;
    }
    .oldiv
    {
      z-index:2;
      background: rgba(255,190,190,0.2);
    }
    .image{z-index:3}
    .idiv, .bgdiv, .oldiv
    {
      position: fixed;
      width: 100%;
      height: 100%;
    }
    .idiv
    {
      transition-duration: 1s;
      opacity: 0;
    }
    .idiv.visible
    {
      opacity: 1;
    }
    .image
    {
      transition-duration: 0.5s;
      position: fixed;
      max-width: 100%;
      max-height: 100%;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%) scale(0.1);
    }
    .image.large
    {
      transform: translate(-50%,-50%) scale(1);
    }
    img{border:none}
    </style>
  </head>
  <body>
<?php
$imgs = file("imgs.list");
foreach($imgs as $img)
{
  $img = trim(preg_replace('/\s+/', '', $img));
  ?><div class="idiv" style="display: none;">
    <div class="bgdiv" style="background: url('<?php echo $img; ?>-fhd.jpg') no-repeat center center fixed;"></div>
    <div class="oldiv"></div>
    <img class="image" src="<?php echo $img; ?>-fhd.jpg">
  </div>
    <?php
}
?>
<script type="text/javascript">
var images = document.getElementsByClassName("idiv"),
i = 0;
window.onload = function()
{
  document.getElementsByTagName("h1")[0].remove();
  images[0].style.display = "";
  images[0].classList.add("visible");
  images[images.length-1].style.display = "";
  images[1].style.display = "";
  images[0].children[2].classList.add("large");
  document.getElementById("prev").style.opacity = "1";
  document.getElementById("next").style.opacity = "1";
};
window.onkeypress = function (e){
  var k = e.which || e.keyCode;
  if(k == 32 || k == 39){next()}
  if(k == 37){prev()}
}
function next()
{
  hi(i);
  ri(li(i));
  i = ni(i);
  si(i);
  di(ni(i));
}
function prev()
{
  hi(i);
  ri(ni(i));
  i = li(i);
  si(i);
  di(li(i));
}
function ri(i)
{
  setTimeout("eval('images["+i+"].style.display = \"none\";');",1000);
}
function di(i)
{
  images[i].style.display = "";
}
function si(i)
{
  images[i].classList.add("visible");
  images[i].children[2].classList.add("large");
}
function hi(i)
{
  images[i].classList.remove("visible");
  images[i].children[2].classList.remove("large");
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
</script>
<img src="prev.svg" onclick="prev();" style="opacity: 0;" class="pn" id="prev" />
<img src="next.svg" onclick="next();" style="opacity: 0;" class="pn" id="next" />
<h1 style="color:white; z-index:0; ">Loading… If not, please enable javascript and use a modern browser.</h1>
<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
  </body>
</html>
