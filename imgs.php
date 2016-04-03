<?php
error_reporting(E_ALL);
require_once "thumbs.php";
function imgs($rfiles = true)
{
  $valid_extensions = Array("tiff","jpg","jpeg","png","gif");
  $files = Array();
  foreach($valid_extensions as $extension)
  {
     // f***** array_merge doesn't work on my webhost. sorry for using this crappy method.
    $g1 = glob("*.{$extension}");
    $g2 = glob("*." . strtoupper($extension));
    foreach($g1 as $file)
    {
      $files[] = $file;
      thumb($file);
    }
    foreach($g2 as $file)
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
      @$dt = $we['DateTime'];
      @$dt = $we['DateTimeDigitized'];
      @$dt = $we['DateTimeOriginal'];
      if(!$dt)
      {
        $fdt = strtotime($dt);
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
