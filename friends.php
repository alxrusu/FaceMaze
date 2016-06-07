<?php
	session_start();
	require 'TwitterAPILoader.php';
	use Abraham\TwitterOAuth\TwitterOAuth;
	define('CONSUMER_KEY', 'Q5iD9LEWOgNaKkwu1OrJnAJyW');
	define('CONSUMER_SECRET', 'TeFyW8UuXxGT3tlTgvaUD5OoKvJXXFBsExy2hH3cdrJdfwmVYJ');
	define('OAUTH_CALLBACK', 'http://127.0.0.1/FaceMaze/twitteroauth/callback.php');


	$friends= array(
		array(	'nume' => 'pogchamp',
				'poza' => 'friends/pogchamp.png'),
		array(	'nume' => 'kreygasm',
				'poza' => 'friends/kreygasm.png'),
		array(	'nume' => 'kappa',
				'poza' => 'friends/kappa.png'),
		array(	'nume' => 'doge',
				'poza' => 'friends/doge.png')
	);

	if (isset($_SESSION['type'])){
		if ($_SESSION['type']=='insta' &&
			isset($_SESSION['access_token']))
			{
				$ch = curl_init('https://api.instagram.com/v1/users/self/follows?access_token='.$_SESSION['access_token']);
			    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
			    $result = curl_exec($ch);
			    curl_close($ch);
			    $result=json_decode($result, true);
			    foreach ($result['data'] as $key => $value)
			    {
			    	$nume=$result['data'][$key]['full_name'];
			    	$poza=$result['data'][$key]['profile_picture'];
			    	array_unshift($friends,array('nume'=>$nume,'poza'=>$poza));
			    }
			} 		
	}
	else
	{
		if (isset($_SESSION['access_token'])) 
			{
				$access_token = $_SESSION['access_token'];
				$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
				$followers = $connection->get("friends/list");
				foreach ($followers->users as $key => $value) 
				{
				 	$nume=$followers->users[$key]->screen_name;
					$poza=$followers->users[$key]->profile_image_url;
					array_unshift($friends,array('nume'=>$nume,'poza'=>$poza));
				} 
			}

		
	}
	$rand_keys = array_rand($friends, 4);		
	foreach ($rand_keys as $key => $value)
	{
		echo '<p id="charname'.$key.'" style="display:none;">'.$friends[$value]['nume'].'</p>';
		echo '<img id="charimg'.$key.'" style="display:none;" width=150 height=150 src="'.str_replace('_normal', '', $friends[$value]['poza']).'"></img>';
	}
?>



<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>Gamedev Canvas Workshop</title>

    <style>
    	* { padding: 0; margin: 0; }
    	canvas { display: block; margin: 0 auto; }
    </style>

</head>
<body>


<canvas style="position:absolute" id="background" width="720" height="480"></canvas>
<canvas style="position:absolute" id="points" width="720" height="480"></canvas>
<canvas style="position:absolute" id="characters" width="720" height="480"></canvas>



<script type="text/javascript" src="game.js"> </script>

</body>
</html>