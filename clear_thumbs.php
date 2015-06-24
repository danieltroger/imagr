<?php
header("Content-type: text/plain");
foreach(glob("thumbs.dir/*") as $f)
{
  unlink($f);
  echo "Deleted {$f}" . PHP_EOL;
}
