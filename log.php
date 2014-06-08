<?php
$date = date("m-d-Y H:i:s ");
$ua = $_SERVER['HTTP_USER_AGENT'];
$uae = explode("/",$ua);
if(strpos($ua,"Firefox/") !== false)
{
$ua = "Firefox v" . $uae[3];
}
elseif(strpos($ua,"Safari/") !== false)
{
$sv = explode(" ",$uae[3]);
if((strpos($ua,"iPhone OS") !== false) || (strpos($ua,"iPad") !== false) || (strpos($ua,"iPod") !== false))
{
$ios = explode(" ",$uae[1]);
$device = substr($ios[1],1,-1) . "\n";
$key = fpoint($ios);
$ios = str_replace("_",".",$ios[$key+1]);
$ua = "MobileSafari v{$sv[0]}, iOS {$ios} on an {$device}";
}
else
{
$ua = "Safari v" . $sv[0];
}
}
file_put_contents("a.txt",print_r($_SERVER,1));
file_put_contents("log.txt","{$date} {$_SERVER['REMOTE_ADDR']}:{$_SERVER['SERVER_PORT']} {$_SERVER['SERVER_PROTOCOL']} {$_SERVER['REQUEST_METHOD']} {$_SERVER['REQUEST_URI']} {$ua}\n" . file_get_contents("log.txt"));;
file_put_contents("total.txt",file_get_contents("total.txt") +1);
function fpoint($a)
{
foreach($a as $b => $c)
{
if($c == "OS")
{
return $b;
}
}
}
?>
