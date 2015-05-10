<?php
header("Content-type: text/plain");
require "config.php";
$conn = new mysqli($servername, $username, $password);
if ($conn->connect_error)
{
  die("MySQL connection failed: " . $conn->connect_error . PHP_EOL);
}

// try to create database if not exists
if ($conn->query("CREATE DATABASE IF NOT EXISTS {$database}") === TRUE)
{
  l("Database '{$database}' now exists.");
}
else
{
    l("Error creating database: " . $conn->error);
}
if($conn->select_db($database) === TRUE)
{
  l("Selected database '{$database}'");
}
else
{
  l("Couldn't select database '{$database}'");
}
// try to create table
if ($conn->query("CREATE TABLE IF NOT EXISTS meta (
image VARCHAR(255) NOT NULL,
title VARCHAR(30),
upby VARCHAR(30),
description VARCHAR(1024)
)") === TRUE)
{
    l("Metadata table now exists");
}
else
{
    l("Error creating table: " . $conn->error);
}
l($conn->error);
$conn->close();
function l($str)
{
  echo $str . PHP_EOL;
}
function updatemeta($img,$title,$desc,$by)
{
  $GLOBALS['conn']->query("DELETE FROM meta WHERE image = '{$img}'");
  $sql = "INSERT INTO meta (image, title, description, upby)
  VALUES ('{$img}','{$title}','{$desc}','{$by}')";
  return ($GLOBALS['conn']->query($sql) === TRUE) ? true : false;
}
function getmeta($img)
{
  $query = "SELECT * FROM meta";
  $r = false;
  if ($result = $GLOBALS['conn']->query($query))
  {
    while ($row = $result->fetch_assoc())
    {
        if($row['image'] == $img) $r = $row;
    }
    $result->free();
  }
  return $r;
}
?>
