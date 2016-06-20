<?php
session_start();
require 'TwitterAPILoader.php';
use Abraham\TwitterOAuth\TwitterOAuth;
define('CONSUMER_KEY', 'Q5iD9LEWOgNaKkwu1OrJnAJyW'); 
define('CONSUMER_SECRET', 'TeFyW8UuXxGT3tlTgvaUD5OoKvJXXFBsExy2hH3cdrJdfwmVYJ'); 
if (isset($_SESSION['oauth_token'])) {
	$request_token = [];
	$request_token['oauth_token'] = $_SESSION['oauth_token'];
	$request_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];
	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $request_token['oauth_token'], $request_token['oauth_token_secret']);
	$access_token = $connection->oauth("oauth/access_token", array("oauth_verifier" => $_REQUEST['oauth_verifier']));
	$_SESSION['access_token'] = $access_token;

	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
	$user = $connection->get("account/verify_credentials");
	$_SESSION['username'] = $user->name;
	$_SESSION['profile_picture'] = $user->profile_image_url;

	header('Location: ./');
}

header('Location: ./');