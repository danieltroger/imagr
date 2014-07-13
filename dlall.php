<?php
header("Content-type: application/zip");
header('Content-Disposition: attachment; filename="images.zip"');
$zip = new ZipArchive;
$zipname = rand(1,200);
if ($zip->open($zipname, ZIPARCHIVE::CREATE) !== TRUE) {
die("An error occured while opening the zipfile");
}
	foreach(glob("*.JPG") as $image)
	{
	//echo "Zipping {$image}...<br />";
    $zip->addFile(pathoffile($_SERVER["SCRIPT_FILENAME"])  . DIRECTORY_SEPARATOR . $image, $image);
	}
    $zip->close();
$handle = fopen($zipname, "r") or die("Couldn't get handle");
if ($handle) {
    while (!feof($handle)) {
        echo fgets($handle, 4096);
    }
    fclose($handle);
}
unlink($zipname);
 function pathoffile($file)
    {
      $a = explode("/",$file);
      $b = sizeof($a);
      unset($a[$b-1]);
      return implode("/",$a);
      }
?>
