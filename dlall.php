<?php
$zip = new ZipArchive;
$zipname = "images.zip";
if ($zip->open($zipname, ZIPARCHIVE::CREATE) !== TRUE) {
die("An error occured while opening the zipfile");
}
	foreach(glob("*.JPG") as $image)
	{
		$img = pathoffile($_SERVER["SCRIPT_FILENAME"])  . DIRECTORY_SEPARATOR . $image;
		if($zip->locateName($image) !== false)
		{

	  }
		else
		{
			echo "Zipping {$image}...<br />\n";
			flush();
			$zip->addFile($img, $image);
		}
	}
    $zip->close();
/*$handle = fopen($zipname, "r") or die("Couldn't get handle");
if ($handle) {
    while (!feof($handle)) {
        echo fgets($handle, 4096);
    }
    fclose($handle);
}
unlink($zipname);*/
echo "<script>location='images.zip';</script>";
 function pathoffile($file)
    {
      $a = explode("/",$file);
      $b = sizeof($a);
      unset($a[$b-1]);
      return implode("/",$a);
      }
?>
