<?php
error_reporting(0);
function create_thumb($src,$dest,$desired_width = false, $desired_height = false)
{
    /*If no dimenstion for thumbnail given, return false */
    if (!$desired_height&&!$desired_width) return false;
    $fparts = pathinfo($src);
    $ext = strtolower($fparts['extension']);
    /* if its not an image return false */
    if (!in_array($ext,array('gif','jpg','png','jpeg'))) return false;

    /* read the source image */
    if ($ext == 'gif')
        $resource = imagecreatefromgif($src);
    else if ($ext == 'png')
        $resource = imagecreatefrompng($src);
    else if ($ext == 'jpg' || $ext == 'jpeg')
        $resource = imagecreatefromjpeg($src);

    $width  = imagesx($resource);
    $height = imagesy($resource);
    /* find the "desired height" or "desired width" of this thumbnail, relative to each other, if one of them is not given  */
    if(!$desired_height) $desired_height = floor($height*($desired_width/$width));
    if(!$desired_width)  $desired_width  = floor($width*($desired_height/$height));

    /* create a new, "virtual" image */
    $virtual_image = imagecreatetruecolor($desired_width,$desired_height);

    /* copy source image at a resized size */
    imagecopyresized($virtual_image,$resource,0,0,0,0,$desired_width,$desired_height,$width,$height);

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
  if(!isset($width) && !isset($height)){$width = 380;}
  if(!isset($oname)){$oname = "thumbs.dir" . DIRECTORY_SEPARATOR . "{$image}.jpg";}
  if(!is_dir("thumbs.dir"))
  {
      if(!is_writable ("./"))
      {
         die("</script>please allow your webserver write access to the directory which contains this script, or manually create a directory called thumbs.dir where I have write access.");
      }
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
