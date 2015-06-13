<?php
function imgs($rfiles = true)
{
  $valid_extensions = Array("tiff","jpg","jpeg","png","gif");
  $files = Array();
  foreach($valid_extensions as $extension)
  {
    $files = array_merge($files,glob("*.{$extension}"));
    $files = array_merge($files,glob("*." . strtoupper($extension)));
  }
  if($rfiles) return $files;
  $images = Array();
  foreach($files as $file)
  {
    echo $file;
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
    $images[] = Array($fdt,$file);
  }
  return $images;
}
