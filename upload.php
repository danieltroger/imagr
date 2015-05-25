<?php
error_reporting(E_ALL);
require "thumbs.php";
header("Content-type: text/plain");
if(!uploading) x_err("Uploading not allowed");
if(!is_writable(".")) x_err('Directory not writable');
//$h = getallheaders();
register_shutdown_function("x_err");
$tn = tempnam(sys_get_temp_dir(), 'upl');
$temp = fopen($tn,"w+");
$in = fopen("php://input","r");
stream_filter_append($temp, 'convert.base64-decode',STREAM_FILTER_WRITE);
$c = 1;
while($c)
{
  if(fread($in,1) == ",") $c = 0;
}
while(!feof($in))
{
  fwrite($temp, fread($in,1048576));
}
fclose($in);
//$length = $h['X-length'];
//if(filesize($tn) != $length) exit(json_encode(Array('error' => "Filesize doesn't match: " . filesize($tn) . " != " . $length)));
$fname = $_GET['name'];
$raw = false;
if(empty($fname)) x_err("Filename is empty");
if(strcasecmp(substr($fname,-4),".php") == 0) x_err("1337: b4d_h4x0r");
if(strcasecmp(substr($fname,-4),".cr2") == 0) $raw = true;
if($raw && !extension_loaded('imagick')) x_err("please install the imagick extension for raw image support");
$date = (int) $_GET['date'];
if(substr($date,-3) == 000) $date = substr($date,0,-3);
$finfo = new finfo(FILEINFO_MIME_TYPE);
fseek($temp,0);
$mime = $finfo->buffer(fread($temp,1024));
if(substr($mime,0,6) != "image/") x_err("Not an image (mime: " . $mime . ")");
finfo_close($finfo);
fclose($temp);
$a = 1;
while(file_exists($fname))
{
  $ext = getextension($fname,true);
  $spaces = explode(" ",$ext[1]);
  if($a != 1)
  {
    $ss = sizeof($spaces);
    unset($spaces[$ss-1]);
  }
  $fi_new = implode(" ",$spaces);
  $fname = "{$fi_new} ({$a}).{$ext[0]}";
  $a++;
}
rename($tn,$fname);
if($raw)
{
  try
  {
    $nn = $fname . ".jpg";
    $im = new Imagick($fname);
    $im->setImageFormat("jpg");
    $im->writeImage($nn);
    $im->clear();
    $im->destroy();
    unlink($fname);
    $fname = $nn;
   }
   catch (ImagickException $e)
   {
       x_err("ImagickException: " . print_r($e,1));
   }

}
chmod($fname,0644);
touch(__DIR__ . DIRECTORY_SEPARATOR . $fname,$date);
thumb($fname);
if(file_exists($fname))
{
  exit(json_encode(Array('success' => true,/*'date' => $date,*/'file' => $fname,'orig_file' => $_GET['name'])));
}
else
{
  x_err("Something went wrong while saving the file");
}
function x_err($e)
{
  // try to clean up if neccessary
  @unlink($GLOBALS['tn']);
  exit(json_encode(Array('success' => false, 'error' => $e,'file' => $GLOBALS['fname'])));
}
