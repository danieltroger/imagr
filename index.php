<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>ImgView</title>
    <link type="text/css" href="imagr.css" rel="stylesheet" />
    <script type="text/javascript">
    var imagesources = [<?php
    $imgs = file("imgs.list");
    foreach($imgs as $img)
    {
      $img = trim(preg_replace('/\s+/', '', $img));
      echo "\"" . $img . "\",";
    }
    ?>];
    </script>
    <script src="imagr.js" type="text/javascript"></script>
  </head>
  <body>
<img src="prev.svg" style="opacity: 0;" class="pn" id="prev" />
<img src="next.svg" style="opacity: 0;" class="pn" id="next" />
<h1 style="color:white; z-index:0; ">Loading… If not, please enable javascript and use a modern browser.</h1>
</body>
</html>
