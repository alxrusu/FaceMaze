<?php
session_start();

define('CLIENT_ID', '6d6316aedd8b4692aa4dabbdfac8b510'); 
define('OAUTH_CALLBACK', 'http://localhost/FaceMaze/instagram_callback.php');

if (!isset($_SESSION['access_token']))
	header('Location: https://api.instagram.com/oauth/authorize/?client_id='.CLIENT_ID.'&redirect_uri='.OAUTH_CALLBACK.'&response_type=code&scope=follower_list+basic');


