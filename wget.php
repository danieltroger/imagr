<?php
require "imgs.php";
require "thumbs.php";
header("Content-type: text/plain");
$a = imgs();
$b = explode("/",getextension($_SERVER['SCRIPT_NAME'],true)[1]);
unset($b[sizeof($b)-1]);
$b = implode("/",$b);
$c = "http://" . $_SERVER['SERVER_ADDR'] . ":" . $_SERVER['SERVER_PORT'] . $b . "/download.php/";
foreach($a as $d)
{
  echo $c . urlencode($d) . PHP_EOL;
}
