<?php
session_start();
require 'TwitterAPILoader.php';
use Abraham\TwitterOAuth\TwitterOAuth;
define('CONSUMER_KEY', 'Q5iD9LEWOgNaKkwu1OrJnAJyW');
define('CONSUMER_SECRET', 'TeFyW8UuXxGT3tlTgvaUD5OoKvJXXFBsExy2hH3cdrJdfwmVYJ');
define('OAUTH_CALLBACK', 'http://127.0.0.1/FaceMaze/twitter_callback.php');
if (!isset($_SESSION['access_token'])) {
	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);
	$request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => OAUTH_CALLBACK));
	$_SESSION['oauth_token'] = $request_token['oauth_token'];
	$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];
	$url = $connection->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));
	header('Location: '.$url);
}
?>