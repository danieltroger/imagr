<?php
require "imgs.php";
require "thumbs.php";
header("Content-type: text/plain");
$a = imgs();
$b = explode("/",getextension($_SERVER['PHP_SELF'],true)[1]);
unset($b[sizeof($b)-1]);
$b = implode("/",$b);
$p = explode("/",$_SERVER['SERVER_PROTOCOL']);
$p = strtolower($p[0]);
$c =  $p . "://" . $_SERVER['SERVER_NAME'] . ":" . $_SERVER['SERVER_PORT'] . $b . "/download.php/";
foreach($a as $d)
{
  echo $c . urlencode($d) . PHP_EOL;
}
