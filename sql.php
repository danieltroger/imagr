<?php
require "config.php";
$conn = new mysqli($servername, $username, $password);
if ($conn->connect_error)
{
  die("MySQL connection failed: " . $conn->connect_error);
}

// try to create database if not exists
/*
if ($conn->query("CREATE DATABASE IF NOT EXISTS {$database}") !== TRUE)
{
  die("Error creating database: " . $conn->error);
}
*/
if($conn->select_db($database) !== TRUE)
{
  die("Couldn't select database '{$database}'");
}
if ($conn->query("CREATE TABLE IF NOT EXISTS meta (
image VARCHAR(255) NOT NULL,
title VARCHAR(30),
upby VARCHAR(30),
description VARCHAR(1024)
)") !== TRUE)
{
  die("Error creating table: " . $conn->error);
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
