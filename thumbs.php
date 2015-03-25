<?php
error_reporting(0);
if(!function_exists('gd_info')) die("Cannot find the GD extension. Please check that it's installed.");
function create_thumb($src,$dest,$desired_width = false, $desired_height = false)
{
   // echo "/* create_humb() called file: " . __FILE__ . " line: " . __LINE__ .  " */ \n";
    /*If no dimenstion for thumbnail given, return false */
    if (!$desired_height&&!$desired_width) return false;
    $fparts = pathinfo($src);
    $ext = strtolower($fparts['extension']);
    /* if its not an image return false */
    if (!in_array($ext,array('gif','jpg','png','jpeg'))) return false;
  // echo "/*going to read the image file: " . __FILE__ . " line: " . __LINE__ .  " */ \n";

    /* read the source image */
    if ($ext == 'gif')
        {$resource = imagecreatefromgif($src);}
    elseif ($ext == 'png')
        {$resource = imagecreatefrompng($src);}
    elseif ($ext == 'jpg' || $ext == 'jpeg')
       {$resource = imagecreatefromjpeg($src);}
   // echo "/* read the image file: " . __FILE__ . " line: " . __LINE__ .  " */ \n";
    $width  = imagesx($resource);
    $height = imagesy($resource);
    /* find the "desired height" or "desired width" of this thumbnail, relative to each other, if one of them is not given  */
    if(!$desired_height) $desired_height = floor($height*($desired_width/$width));
    if(!$desired_width)  $desired_width  = floor($width*($desired_height/$height));

    /* create a new, "virtual" image */
    $virtual_image = imagecreatetruecolor($desired_width,$desired_height);

    /* copy source image at a resized size */
    imagecopyresized($virtual_image,$resource,0,0,0,0,$desired_width,$desired_height,$width,$height);
    $exif = exif_read_data($src);
    if(!empty($exif['Orientation']))
    {
      switch($exif['Orientation'])
      {
          case 8:
              $virtual_image = imagerotate($virtual_image,90,0);
              break;
          case 3:
              $virtual_image = imagerotate($virtual_image,180,0);
              break;
          case 6:
              $virtual_image = imagerotate($virtual_image,-90,0);
              break;
      }
    }
    /* create the physical thumbnail image to its destination */
    /* Use correct function based on the desired image type from $dest thumbnail source */
    $fparts = pathinfo($dest);
    $ext = strtolower($fparts['extension']);
    /* if dest is not an image type, default to jpg */
    if (!in_array($ext,array('gif','jpg','png','jpeg'))) $ext = 'jpg';
    $dest = $fparts['dirname'].'/'.$fparts['filename'].'.'.$ext;

    if ($ext == 'gif')
        imagegif($virtual_image,$dest);
    else if ($ext == 'png')
        imagepng($virtual_image,$dest,1);
    else if ($ext == 'jpg' || $ext == 'jpeg')
        imagejpeg($virtual_image,$dest,100);

    return array(
        'width'     => $width,
        'height'    => $height,
        'new_width' => $desired_width,
        'new_height'=> $desired_height,
        'dest'      => $dest
    );
  }
  function thumb($image,$oname, $width, $height)
  {
  //echo "/* going to thumb {$image}...*/\n";
  if(!isset($width) && !isset($height)){$width = 380;}
  if(!isset($oname)){$oname = "thumbs.dir" . DIRECTORY_SEPARATOR . "{$image}.jpg";}
  if(!is_dir("thumbs.dir"))
  {
    mkdir("thumbs.dir");
  }
  if(!file_exists($oname))
  {
    if(!isset($height))
  {
    create_thumb($image,$oname,$width);
  }
  else
  {
    create_thumb($image,$oname,$width,$height);
  }
  }
 // echo "/* thumbed {$image}*/\n";
  return $image;
  }
  function getextension($file,$split = false)
    {
      $extension = explode(".",$file);
      $asize = sizeof($extension);
      $ext = strtolower($extension[$asize-1]);
      if(!$split)
      {
        return $ext;
      }
      else
      {
        unset($extension[$asize-1]);
        return array($ext,implode(".",$extension));
      }
    }
  ?>
