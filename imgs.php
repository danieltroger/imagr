<?php
require_once "thumbs.php";
error_reporting(E_ALL);
function imgs($rfiles = true)
{
  $valid_extensions = Array("tiff","jpg","jpeg","png","gif");
  $files = Array();
  foreach($valid_extensions as $extension)
  {
    foreach(array_merge(glob("*.{$extension}"),glob("*." . strtoupper($extension))) as $file)
    {
      $files[] = $file;
      thumb($file);
    }
  }
  if($rfiles) return $files;
  //echo "{" . PHP_EOL;
  $carr = Array();
  foreach($files as $i => $file)
  {
    $fdt = 0;
    if(function_exists("exif_read_data")) $exif = @exif_read_data($file);
    if($exif !== FALSE && is_array($exif))
    {
      if(!empty($exif['DateTime']))
      {
        $fdt = strtotime($exif['DateTime']);
      }
      else
      {
        $fdt = $exif['FileDateTime'];
      }
    }
    else
    {
      $fdt = filemtime($file);
    }
    if(!isset($carr[$fdt]))
    {
      $carr[$fdt] = $file;
    }
    else
    {
      if(is_array($carr[$fdt]))
      {
        $carr[$fdt][] = $file;
      }
      else
      {
        $temp = $carr[$fdt];
        $carr[$fdt] = Array($temp,$file);
      }
    }
    //echo "\"{$file}\": {$fdt}" . ($i == sizeof($files)-1 ? "" : ",") . PHP_EOL;
  }
  return json_encode($carr);
}
