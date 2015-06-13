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
    require "sql.php";
    // init a .htaccess if there's no one
    if(!file_exists(".htaccess"))
    {
      if(!is_writable(".")) die("Cannot create .htaccess, probaly permission denied.");
      $dir = explode("/",$_SERVER["PHP_SELF"]);
      unset($dir[sizeof($dir)-1]);
      $dir = implode("/",$dir);
      file_put_contents(".htaccess","<IfModule mod_rewrite.c>\nRewriteEngine On\nRewriteBase {$dir}\nRewriteRule ^download\.php$ - [L]\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule . {$dir}/download.php [L]\n</IfModule>");
    }
    if(!file_exists("config.php")) die("Please create a config.php file");
    ?><!DOCTYPE html>
    <html>
    <head>
      <title>Imagr</title>
      <meta name="viewport" content="width=device-width" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <link rel="stylesheet" type="text/css" href="style.min.css">
      <script src="external.min.js"></script>
      <script src="functions.min.js"></script>
      <script>
      var features = {<?php echo (file_exists(".raw") ? '"srs":' . file_get_contents(".raw") . "," : ""); ?>"uploading": <?php echo uploading ? "true" : "false"; ?>, "deleting": <?php echo deleting ? "true" : "false"; ?>, "renaming": <?php echo renaming ? "true" : "false"; ?>},
      imgs = json_decode("<?php
      echo json_encode(imgs(0));
      ?>");
      window.addEventListener("load",function (){if(typeof(init) != "function"){alert("Error loading page, please try again")}init()});
      </script>
    <body>
      <div style="display: none;" class="fileUpload btn btn-primary">
        <span>Upload image</span>
        <input type="file" multiple class="upload" />
      </div>
      <div id="preview-container" style="display: none;">
        <img id="preview">
      </div>
    <noscript>
      Sorry, but you need javascript to get this page working.
    </noscript>
  </body>
  </html>
