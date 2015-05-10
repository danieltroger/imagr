<?php
require "sql.php";
$m = json_decode(file_get_contents("meta"));
foreach($m as $im => $mdat)
{
  updatemeta($im,NULL,$mdat->description,$mdat->by);
  echo $im . PHP_EOL;
}
unlink("meta");
unlink("migrate.php");
