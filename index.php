<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>ImgView</title>
    <link type="text/css" href="imagr.css" rel="stylesheet" />
    <script src="imagr.js" type="text/javascript"></script>
  </head>
  <body>
<?php
$imgs = file("imgs.list");
foreach($imgs as $img)
{
  $img = trim(preg_replace('/\s+/', '', $img));
  ?><div class="idiv" style="display: none;">
    <div class="bgdiv" style="background: url('<?php echo $img; ?>-fhd.jpg') no-repeat center center fixed;"></div>
    <img class="image" src="<?php echo $img; ?>-fhd.jpg">
  </div>
    <?php
}
?>
<img src="prev.svg" style="opacity: 0;" class="pn" id="prev" />
<img src="next.svg" style="opacity: 0;" class="pn" id="next" />
<h1 style="color:white; z-index:0; ">Loading… If not, please enable javascript and use a modern browser.</h1>
</body>
</html>
