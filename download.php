<?php
error_reporting(E_ALL);
$paths = explode("/",substr($_SERVER["PATH_INFO"],1));
if($paths[0] == "exif")
{
  if(strlen($paths[1]) <1)
  {
    die(json_encode(array("error" => "please specify an filename")));
  }
  $we = exif_read_data($paths[1],"FILE");
  unset($we['MakerNote']);
  $gmaps = false;
  if(strpos($we['SectionsFound'],"GPS") !== false)
  {
    $gmaps = calc($we['GPSLatitude'][0]) . '°' . calc($we['GPSLatitude'][1]) . "'" . calc($we['GPSLatitude'][2]) . '"N';
    $gmaps .= " " . calc($we['GPSLongitude'][0]) . "°" . calc($we['GPSLongitude'][1]) . "'" . calc($we['GPSLongitude'][2]) . '"E';
  }
  echo json_encode(
  array(
  'dump' => print_r($we,1),
  'width' => $we['ExifImageWidth'],
  'height' => $we['ExifImageLength'],
  'make' => maker($we['Make']),
  'model' => model($we['Model']),
  'GPS' => $gmaps,
  'date' => edate($we['DateTime'],$we['FileDateTime']),
  'ISO' => ISO($we['ISOSpeedRatings']),
  'aperture' => aperture($we['FNumber']),
  'exposure' => exposure($we['ExposureTime']),
  'filesize' => formatsize($we['FileSize'])
  ));
  //echo json_last_error_msg();
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
  if(strpos(strtolower($cont),"image/") !== false)
  {
    header("Content-type: {$cont}-download");
  }
  else
  {
    echo "Not an image (mime-type: {$cont} file: {$file})";
  }
  finfo_close($finfo);
  if(!isset($size))
  {
    echo file_get_contents($file);
  }
  else
  {
    require "thumbs.php";
    $ext = getextension($file,true);
    $oname = "thumbs.dir"  . DIRECTORY_SEPARATOR . $ext[1] . "-" .  $paths[1] . "." .  $ext[0];
    thumb($file,$oname,$size[0],$size[1]);
    echo file_get_contents($oname);
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
  if($size < 1) return false;
  if($size > 1024 * 1024 * 1024)
  {
    return round($size / 1024 / 1024 / 1024,2) . " GiB";
  }
  elseif($size > 1024 * 1024)
  {
    return round($size / 1024 / 1024,2) . " MiB";
  }
  elseif($size > 1024)
  {
    return round($size / 1024,2) . " KiB";
  }
  elseif($size < 1024)
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
  function edate($a,$b)
  {
    if(strlen($a) > 2) return $a;
    return date("Y:m:d h:i:s",$b);
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
?>
