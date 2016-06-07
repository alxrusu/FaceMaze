<?php 
session_start();
if (isset($_GET['code']))
{
	$url = 'https://api.instagram.com/oauth/access_token';
	
	$fields=array(
		'client_id' => '6d6316aedd8b4692aa4dabbdfac8b510',
    	'client_secret' => '32709b231048497890a3179ecb17e795',
    	'grant_type' => 'authorization_code',
    	'redirect_uri' => 'http://localhost/FaceMaze/instagram_callback.php',
    	'code' => $_GET['code'],
    	'scope' => 'follower_list'); //necesita aprobare de la Instagram
    
    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $result = curl_exec($ch);
    curl_close($ch);

    $result=json_decode($result, true);
    
    $access_token=$result['access_token'];
    $user_id=$result['user']['id'];
    $username=$result['user']['username'];
    $full_name=$result['user']['full_name'];
    $profile_picture=$result['user']['profile_picture'];
    
    $_SESSION['type']='insta';
    $_SESSION['username']=$full_name;
    $_SESSION['access_token']=$access_token;
    $_SESSION['profile_picture']=$profile_picture;

    header('Location: ./');
}
else
    header('Location: ./');
    
