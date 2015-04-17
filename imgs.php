<?php
function imgs($print = false)
{
  $files = Array();
  $imgs = glob("*");
  $imglen = sizeof($imgs)-1;
  $invalid_files_length = 0;
  $rkey = 0;
  $invalid_extensions = Array("icons","sh","jar","css","features","php","zip","txt","ign","html","html~","php~","json","json~","log","mov","svg~","license","dir","zip","meta","js","md");
  foreach($imgs as $key => $img)
  {
    $extension = getextension($img);
    if(in_array($extension,$invalid_extensions))
    {
      $invalid_files_length++;
    }
  }
  //echo "/*imglength = {$imglen}, invalid_files_length = {$invalid_files_length}*/\n";
  foreach($imgs as $key => $img)
  {
    $extension = getextension($img);
    if(!in_array($extension,$invalid_extensions))
    {
      if($print) echo "\"" . thumb($img) . "\"";
      $files[] = $img;
      if($rkey != $imglen-$invalid_files_length && $print)
      {
        echo ",";
      }
      $rkey++;
    }
    //echo " /* file = {$img}, extension = {$extension}, key = {$key}, rkey = {$rkey}*/\n";
  }
  return $files;
}
