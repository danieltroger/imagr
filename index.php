<?php
    error_reporting(E_ALL);
    header("Content-type: text/html; charset=utf-8");
    header("Expires: on, 01 Jan 1970 00:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    require "thumbs.php";
    require "imgs.php";
    require "config.php";

    // init a .htaccess if there's no one
    if(!file_exists(".htaccess"))
    {
      if(!is_writable(".")) die("Cannot create .htaccess, probaly permission denied.");
      $dir = explode("/",$_SERVER["PHP_SELF"]);
      unset($dir[sizeof($dir)-1]);
      $dir = implode("/",$dir);
      file_put_contents(".htaccess","<IfModule mod_rewrite.c>\nRewriteEngine On\nRewriteBase {$dir}\nRewriteRule ^download\.php$ - [L]\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule . {$dir}/download.php [L]\n</IfModule>");
    }
    ?><!DOCTYPE html>
    <html>
    <head>
      <title>Imagr</title>
      <meta name="viewport" content="width=device-width" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <script src="//code.jquery.com/jquery.min.js"></script>
      <script src="//code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
      <script src="http://natur-kultur.eu/phpjs.php?f=json_encode,uniqid,urlencode,urldecode,explode,substr,basename,rand,isset,in_array,file_get_contents,json_decode"></script>
      <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com//css?family=Ubuntu+Mono%7CUbuntu%3Aregular%2Cbold&amp;subset=Latin">
      <link rel="stylesheet" type="text/css" href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css">
      <link rel="stylesheet" type="text/css" href="style.min.css">
      <script src="functions.min.js"></script>
      <script>
      var features = {"uploading": <?php echo uploading ? true : false; ?>, "deleting": <?php echo deleting ? true : false; ?>},
      imgs = Array(<?php
      imgs(1);
      ?>);
      window.addEventListener("load",function (){if(typeof(init) != "function"){alert("Error loading page, please try again")}init()});
      </script>
    <body>
      <div style="display: none;" class="fileUpload btn btn-primary">
        <span>Upload image</span>
        <input type="file" multiple class="upload" />
      </div>
    <noscript>
      Sorry, but you need javascript to get this page working.
    </noscript>
  </body>
  </html>
