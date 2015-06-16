<?php
    error_reporting(E_ALL);
    header("Content-type: text/html; charset=utf-8");
    header("Expires: on, 01 Jan 1970 00:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
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
      file_put_contents(".htaccess","<IfModule mod_rewrite.c>" . PHP_EOL . "RewriteEngine On" . PHP_EOL . "RewriteBase " . (strlen($dir) < 1 ? "/" : $dir) . PHP_EOL . "RewriteRule ^download\.php$ - [L]" . PHP_EOL . "RewriteCond %{REQUEST_FILENAME} !-f" . PHP_EOL . "RewriteCond %{REQUEST_FILENAME} !-d" . PHP_EOL . "RewriteRule . {$dir}/download.php [L]" . PHP_EOL . "</IfModule>");
    }
    if(!is_dir("deleted.dir"))
    {
      if(!is_writable(".")) die("Cannot create deleted.dir, probaly permission denied.");
      mkdir("deleted.dir");
      if(!is_writable("deleted.dir")) die("Cannot write to deleted.dir");
      file_put_contents("deleted.dir/.htaccess","Order deny,Allow" . PHP_EOL . "Deny from all" . PHP_EOL);
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
      files = json_decode('<?php
      echo imgs(0);
      ?>');
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
