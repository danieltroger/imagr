<?php
error_reporting(0);
require "sql.php";
$paths = explode("/",@substr($_SERVER['PATH_INFO'],1));
if(!empty($paths) && strlen($paths[0]) > 1)
{
  if($paths[0] == "exif")
  {
    header("Content-type: text/plain");
    if(strlen($paths[1]) < 1)
    {
      die(json_encode(array("error" => "please specify an filename")));
    }
    exit(json_encode(pexif($paths[1])));
  }
  elseif($paths[0] == "rawtest")
  {
    $tn = "server_test_image_do_not_delete.cr2";
    $on = "out.test";
    if(!extension_loaded('imagick'))
    {
      file_put_contents(".raw","false");
      echo "false";
      exit;
    }
    try
    {
      $im = new Imagick($tn);
      $im->setImageFormat("jpg");
      $im->writeImage($on);
      $im->clear();
      $im->destroy();
     }
     catch(ImagickException $e)
     {
       file_put_contents(".raw","false");
       echo "false";
     }
     @$is = getimagesize($on);
     if($is[0] > 1900 && $is[1] > 1290) //pass
     {
       file_put_contents(".raw","true");
       echo "true";
     }
     @unlink($on);
     exit;
  }
  elseif($paths[0] == "delete")
  {
    header("Content-type: text/html; charset=utf-8");
    header("Expires: on, 01 Jan 1970 00:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    if(deleting)
    {
      @$f = basename($paths[1]);
      if(empty($f))
      {
        $r = false;
      }
      else
      {
        //@unlink($paths[1]);
        rename($f,"deleted.dir/{$f}");
        if(file_exists($paths[1]))
        {
          $r = false;
        }
        else
        {
          $r = true;
        }
      }
    }
    else
    {
      $r = false;
    }
    exit(json_encode(Array('success' => $r)));
  }
  elseif($paths[0] == "rename")
  {
    if(renaming)
    {
      function safr($str)
      {
        return str_replace("'","\'",$str);
      }
      $image = safr($paths[1]);
      $field = safr($paths[2]);
      $value = safr($paths[3]);
      $om = getmeta($image);
      $om[$field] = $value;
      exit(
           json_encode(
                      Array('success' =>
                      updatemeta($image,
                      $om['title'],
                      $om['description'],
                      $om['upby']),
                      'exif' => pexif($image))));
    }
    else
    {
      exit(json_encode(Array('success' => false)));
    }
  }
  else
  {
    if($paths[0] == "resize")
    {
      $size = explode("x",strtolower($paths[1]));
      $file = $paths[2];
    }
    else
    {
      $file = $paths[0];
    }
    if(strlen($file) < 1)
    {
      die("Please specify a file<br />Usage: {$_SERVER['PHP_SELF']}[/resize/width/[height]]/imagefilename to download an image<br />{$_SERVER['PHP_SELF']}/exif/filename returns json encoded exif data from filename");
    }
    if(!file_exists($file))
    {
      die("File doesn't exist");
    }
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $cont = finfo_file($finfo,$file);
    $fsize = filesize($file);
    if(substr(strtolower($cont),0,6) != "image/")
    {
      die("Not an image (mime-type: {$cont} file: {$file})");
    }
    finfo_close($finfo);
    if(!isset($size))
    {
      $rname = "thumbs.dir/" . basename($file);
      if(!is_dir("thumbs.dir")){mkdir("thumbs.dir");}
      if(!file_exists($rname))
      {
        $e = exif_read_data($file);
        $r = @$e['Orientation'];
        if(!empty($r) && ($r == 8 || $r == 3 || $r == 6))
        {
          header("X-exif-rotation: {$r}");
          header("Content-type: image/jpeg-dl");
          switch($e['Orientation'])
          {
              case 8:
                  $image =  imagecreatefromstring(file_get_contents($file));
                  imagejpeg(imagerotate(imagecreatefromstring(file_get_contents($file)),90,0),$rname);
                  break;
              case 3:
                  imagejpeg(imagerotate(imagecreatefromstring(file_get_contents($file)),180,0),$rname);
                  break;
              case 6:
                  imagejpeg(imagerotate(imagecreatefromstring(file_get_contents($file)),-90,0),$rname);
                  break;
          }
          $dfile = $rname;
        }
        else
        {
          $dfile = $file;
        }
      }
      else
      {
        $dfile = $rname;
      }
    }
    else
    {
      require_once "thumbs.php";
      $ext = getextension($file,true);
      $oname = "thumbs.dir"  . DIRECTORY_SEPARATOR . $ext[1] . "-" .  $paths[1] . "." .  $ext[0];
      thumb($file,$oname,$size[0],$size[1]);
      $dfile = $oname;
    }
    // downloader
    $offset = 0;
    $range = @$_SERVER['HTTP_RANGE'];
    $buffsize = 1048576;
    $fsize = filesize($dfile);
    $h = fopen($dfile,"r");
    if(!empty($range))
    {
      $a = explode("=",$range);
      unset($a[0]);
      $a = explode("-",implode("=",$a));
      $offset = $a[0];
      if(empty($a[1]))
      {
        $stop = $fsize;
      }
      else
      {
        $stop = explode("/",$a[1])[0]+1;
      }
      $length = $stop-$offset;
      header('HTTP/1.1 206 Partial Content');
      header('Accept-Ranges: bytes');
      header("Content-type: {$cont}-download");
      header("Content-Range: bytes " . $offset . "-" . ($stop-1) . "/" . $fsize);
      header("Content-length: {$length}");
      if($length == 0) exit;
      fseek($h, $offset);
      for(;$offset+$buffsize < $stop;$offset += $buffsize)
      {
        echo fread($h,$buffsize);
      }
      echo fread($h,$stop-$offset);
    }
    else
    {
      header('Accept-Ranges: bytes');
      header("Content-type: {$cont}-download");
      header("Content-length: {$fsize}");
      while(!feof($h))
      {
        echo fread($h,$buffsize);
      }
    }
    fclose($h);
  }
}
function calc($equation,$nocomma = true)
{
  // Remove whitespaces
  $equation = preg_replace('/\s+/', '', $equation);


  $number = '((?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?|pi|π)'; // What is a number

  $functions = '(?:sinh?|cosh?|tanh?|acosh?|asinh?|atanh?|exp|log(10)?|deg2rad|rad2deg
  |sqrt|pow|abs|intval|ceil|floor|round|(mt_)?rand|gmp_fact)'; // Allowed PHP functions
  $operators = '[\/*\^\+-,]'; // Allowed math operators
  $regexp = '/^([+-]?('.$number.'|'.$functions.'\s*\((?1)+\)|\((?1)+\))(?:'.$operators.'(?1))?)+$/'; // Final regexp, heavily using recursive patterns

  if (preg_match($regexp, $equation))
  {
    $equation = preg_replace('!pi|π!', 'pi()', $equation); // Replace pi with pi function
    eval('$result = '.$equation.';');
    if($nocomma)
    {
      if(strpos($result,".") !== false)
      {
        return explode(".",$result)[0];
      }
      else
      {
        return $result;
      }
    }
    else
    {
      return $result;
    }
  }
  else
  {
    return false;
  }
}
function formatsize($size)
{
  if($size == 0) return "0 Bytes";
  if($size == 1) return "1 Byte";
  if($size >= 1024 * 1024 * 1024)
  {
    return round($size / 1024 / 1024 / 1024,2) . " GiB";
  }
  elseif($size >= 1024 * 1024)
  {
    return round($size / 1024 / 1024,2) . " MiB";
  }
  elseif($size >= 1024)
  {
    return round($size / 1024,2) . " KiB";
  }
  elseif($size <= 1024)
  {
    return "{$size} Bytes";
  }
}
function exposure($exp)
{
  if(strlen($exp) < 1) return false;
  $split = explode("/",$exp);
  if($split[0] == "1") return $exp;
  if($split[1] == "1") return $exp;
  return "1/" .round($split[1] / $split[0]);
}
function aperture($ap)
{
  if(strlen($ap) < 1) return false;
  return calc($ap,false);
}
function ISO($iso)
{
  if(strlen($iso) < 1) return false;
  return $iso;
}
function edate($a,$b,$c,$d)
{
  if(empty($a) && empty($b) && empty($c) && empty($d)) return false;
  if(!empty($a)) return $a;
  if(!empty($b)) return $b;
  if(!empty($c)) return $c;
  return date("Y:m:d H:i:s",$d);
}
function model($model)
{
  if(strlen($model) > 1 ) return $model;
  return false;
}
function maker($make)
{
  if(strlen($make) > 1) return $make;
  return false;
}
function flash($fl)
{
  if($fl & 1 != 0) return true;
  return false;
}
function w($t)
{
  $f = $GLOBALS['paths'][1];
  if(!empty($t)) return $t;
  return getimagesize($f)[0];
}
function h($t)
{
  $f = $GLOBALS['paths'][1];
  if(!empty($t)) return $t;
  return getimagesize($f)[1];
}
function sw($soft)
{
  return empty($soft) ? false : $soft;
}
function pexif($file)
{
  $we = exif_read_data($file,"FILE");
  unset($we['MakerNote']);
  $gmaps = false;
  if(strpos($we['SectionsFound'],"GPS") !== false)
  {
    $gmaps = calc($we['GPSLatitude'][0]) . '°' . calc($we['GPSLatitude'][1]) . "'" . calc($we['GPSLatitude'][2]) . '"N';
    $gmaps .= " " . calc($we['GPSLongitude'][0]) . "°" . calc($we['GPSLongitude'][1]) . "'" . calc($we['GPSLongitude'][2]) . '"E';
  }
  return Array(
    'width' => w($we['ExifImageWidth']),
    'height' => h($we['ExifImageLength']),
    'flash' => flash($we['Flash']),
    'make' => maker($we['Make']),
    'model' => model($we['Model']),
    'GPS' => $gmaps,
    'date' => edate($we['DateTimeOriginal'],$we['DateTimeDigitized'],$we['DateTime'],$we['FileDateTime']),
    'ISO' => ISO($we['ISOSpeedRatings']),
    'aperture' => aperture($we['FNumber']),
    'exposure' => exposure($we['ExposureTime']),
    'filesize' => formatsize($we['FileSize']),
    'software' => sw(@$we['Software']),
    'meta' => getmeta($file)
  );
}
?>
