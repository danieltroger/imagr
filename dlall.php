<?php
$zip = new ZipArchive;
$zipname = "images.zip";
$meta = o2a(json_decode(file_get_contents("meta")));
$zs = $zip->open($zipname, ZIPARCHIVE::CREATE);
if ($zs !== TRUE) {
die("An error occured while opening the zipfile.<br />\n{$zs}");
}
	foreach(glob("*.JPG") as $image)
	{
		$img = pathoffile($_SERVER["SCRIPT_FILENAME"])  . DIRECTORY_SEPARATOR . $image;
		$desc = $meta[$image]['description'];
		if($zip->locateName($image) !== false)
		{
			echo "Keeping {$image}<br />\n";
			echo "Comment: " . $zip->getCommentName($image).  "<br />\n";
	  }
		else
		{
			echo "Zipping {$image}...<br />\n";
			$zip->addFile($img, $image);
			if($desc != false && $desc != "false")
			{
				$zip->setCommentName($image,$desc);
			}
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
			function o2a($d) {if (is_object($d)) {$d = get_object_vars($d);}if (is_array($d)) {return array_map(__FUNCTION__, $d);}else {return $d;}}
?>
