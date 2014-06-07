<?php require "thumbs.php"; session_start(); function o2a($d) {if (is_object($d)) {$d = get_object_vars($d);}if (is_array($d)) {return array_map(__FUNCTION__, $d);}else {return $d;}}
if(sizeof($_FILES) > 0)
{
$files = array();
$rfiles = array();
foreach($_FILES['files']['name'] as $key => $file)
{
if($_FILES['files']['error'][$key] >0)
{
die("Something went wrong with file {$file}, please try again");
}
$rfiles[] = $file;
$a = 2;
while(file_exists($file))
{
$ext = getextension($file,true);
$sss = $ext[1];
if($a > 2)
{
$sss = explode(" ",$ext[1]);
$ssss = sizeof($sss);
unset($sss[$ssss-1]);
$sss = implode(" ",$sss);
}
$file = "{$sss} ({$a}).{$ext[0]}";
$a++;
}
move_uploaded_file($_FILES['files']['tmp_name'][$key],$file);
$meta = o2a(json_decode(file_get_contents("meta")));
$meta[$rfiles[$key]]['by'] = $_SESSION['name'];
file_put_contents("meta",json_encode($meta));
$files[] = $file;
}
$descview = true;
}
elseif(strlen($HTTP_RAW_POST_DATA) > 0)
{
$data = o2a(json_decode($HTTP_RAW_POST_DATA));
$ret = array();
if(isset($data['name']))
{
$ret['operation'] = "setname";
$_SESSION['name'] = $data['name'];
$ret["status"] ="ok";
}
elseif(isset($data['file']))
{
$ret['operation'] = "uprepare";
$_SESSION[$data['file']] = $data['moddate'];
$ret["status"] ="ok";
}
elseif(isset($data['meta']))
{
// echo'ed stuff
$ret['operation'] = "meta";
$ret['meta'] = $data['meta'];
$ret['meta']['moddate'] = $_SESSION[$data['rfile']];
$ret['meta']['by'] = $_SESSION['name'];
$ret["status"] ="ok";
// stuff for the meta file
$meta = o2a(json_decode(file_get_contents("meta")));
$meta[$data['meta']['name']] = array("description" => $data['meta']['description'],"moddate" => $_SESSION[$data['rfile']]);
$meta[$data['meta']['name']]['by'] = $_SESSION['name'];
file_put_contents("meta",json_encode($meta));
}
$ret['sessiondump'] = $_SESSION;
die(json_encode($ret));
}
?><!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width" />
<script src="https://raw.github.com/kvz/phpjs/master/functions/json/json_decode.js"></script>
<script src="https://raw.github.com/kvz/phpjs/master/functions/json/json_encode.js"></script>
<script src="https://raw.githubusercontent.com/kvz/phpjs/master/functions/strings/nl2br.js"></script>
</head>
<body style="font-family:helvetica;">
<style>
.uploadedfile
{
    border: 2px dotted #0000FF;
    margin: 12px;
    padding: 7px;
}
.tarea
{
  border: 1px dotted #FF0000;
    font-family: helvetica;
    font-size: 13pt;
    margin: 10px;
    width: 25%;
}
</style>
<script>function send(arr)
{
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
var response=json_decode(xmlhttp.responseText);
console.log(response);
   if(response.status == "ok")
{
if(response.operation == "setname")
{
location.reload();
}
if(response.operation == "uprepare")
{
var sbut=document.getElementById("submit");
sbut.disabled=false;
}
}
    }
  }
xmlhttp.open("POST","<?php echo $_SERVRE['PHP_SELF']; ?>",false);
xmlhttp.send(json_encode(arr));
}
function sendname(name)
{
send({"name":name});
}
</script><?php
if(!isset($_SESSION['name']))
{
?>
<label for="name">Nahme des Kindes: </label><input id="name" name="name" />
<button onclick="sendname(document.getElementById('name').value);">Weiter</button>
<?php
}
elseif($descview)
{
foreach($files as $key => $value)
{
?><div class="uploadedfile" data-image="<?php echo $value; ?>">
<img src="download.php/resize/300/<?php echo $value; ?>" /><textarea class="tarea" rows="3" placeholder="Bitte geben Sie eine kurze Beschreibung des Bildes ein"></textarea><button onclick="send({'rfile':'<?php echo $rfiles[$key]; ?>','meta':{'name':this.parentElement.dataset.image,'description':nl2br(this.previousElementSibling.value)}});this.disabled=true;">Submit</button>
</div>
<?php
}
}
else
{
?>
<form enctype="multipart/form-data" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="POST">
<input type="file" id="uploader" name="files[]" multiple /><br />
Fotos: <div id="files"></div>
<br />
<input type="submit" value="Weiter" id="submit" disabled />
</form>
<script>
var uploader=document.getElementById("uploader"),files=document.getElementById("files");
uploader.onchange=function (e)
{
for(i = 0;i<this.files.length;i++)
{
var file=this.files[i],fname=file.name,ftype=file.type,moddate=file.lastModifiedDate;
if(ftype.indexOf("image/") == -1)
{
alert("Datei: "+fname+" ist kein foto, bitte versuchen sie es erneut....");
files.innerHTML="";
return;
}
files.innerHTML+="<br /> "+fname;
send({"file":fname,"moddate":moddate});
}
this.style.display="none";
}
</script>
<?php
}
?>
</body>
</html>
