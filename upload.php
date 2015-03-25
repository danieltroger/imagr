<?php
error_reporting(E_ALL);
require "thumbs.php";
header("Content-type: text/plain");
if(!is_writable(".")) exit(json_encode(Array('success' => false, 'error' => 'Directory not writable')));
$h = getallheaders();
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
$fname = basename($h['X-name']);
$date = (int) $h['X-date'];
if(substr($date,-3) == 000) $date = substr($date,0,-3);
$finfo = new finfo(FILEINFO_MIME_TYPE);
fseek($temp,0);
$mime = $finfo->buffer(fread($temp,1024));
if(substr($mime,0,6) != "image/") exit(json_encode(Array('success' => false, 'error' => "Not an image (mime: " . $mime . ")",'file' => $fname)));
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
chmod($fname,0644);
touch(__DIR__ . DIRECTORY_SEPARATOR . $fname,$date);
if(file_exists($fname))
{
  exit(json_encode(Array('success' => true,'date' => $date,'file' => $fname,'orig_file' => $h['X-name'])));
}
else
{
  exit(json_encode(Array('success' => false, 'error' => "Something went wrong while saving the file",'file' => $fname)));
}
