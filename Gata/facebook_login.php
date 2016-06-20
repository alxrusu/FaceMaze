<?php
session_start();
require_once( 'Facebook/autoload.php' ); 

$fb = new Facebook\Facebook([
  'app_id' => '554357831402861',
  'app_secret' => '5428d5692c2f38e39025429bbec79a69',
  'default_graph_version' => 'v2.5',
]);

$helper = $fb->getRedirectLoginHelper();

$permissions = ['email']; // Optional permissions for more permission you need to send your application for review
$loginUrl = $helper->getLoginUrl('http://localhost/FaceMaze/facebook_callback.php', $permissions);

header("location: ".$loginUrl);

?>