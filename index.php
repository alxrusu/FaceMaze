<!DOCTYPE html>
<html>
<head>
	<title>FaceMaze</title>
	<link rel="icon" type="image/x-icon" href="images/brand/pac_icon.png">
	<link rel="stylesheet" href="styles.css"/>
	<script type="text/javascript" src="gates.js"></script>
	<script type="text/javascript" src="game.js"> </script>
	<script type="text/javascript" src="scripts.js"> </script>
</head>
<body>

<script type="text/javascript">
<?php
	session_start();
	if (isset($_SESSION['access_token'])){
		echo "getFriends();";	
	}
?>
</script>

<div id="main">
	<div id="gamebkg"></div>
	<div id="userdata"></div>
	<img id="logout" onclick="location.href='./closesession.php';" src="./images/logout_icon.png">

	<div class="gates" id="gates">

		<div id="gate">
			<img src="./images/brand/FaceMaze_logo1.png" id="logo"/>
			<img class="gatetexture" src="images/1.png"></img>
			
			
			<div id="charms">
				
				<a href="./facebook_login_proxy.php">
					<img src="images/brand/facebook_logo.png" onmouseover="this.src='images/brand/facebook_logo_original.png';" onmouseout="this.src='images/brand/facebook_logo.png';" id="fb_charm" width="10%">
				</a>

				<a href="./instagram_login.php">
					<img src="images/brand/Instagram_logo.png" onmouseover="this.src='images/brand/Instagram_logo_original.png';" onmouseout="this.src='images/brand/Instagram_logo.png';" id="insta_charm" width="10%">
				</a>

				<a href="./twitter_login_proxy.php">
					<img src="images/brand/Twitter_logo.png" onmouseover="this.src='images/brand/Twitter_logo_original.png';" onmouseout="this.src='images/brand/Twitter_logo.png';" id="twitter_charm" width="10%">
				</a>

			</div>
		</div>

		
	</div>

	<div id="game_wrapper">
		<canvas style="position:absolute" id="background" width="1500" height="900"></canvas>
		<canvas style="position:absolute" id="points" width="1500" height="900"></canvas> 
		<canvas style="position:absolute" id="characters" width="1500" height="900"></canvas>
		<div onclick="startGame();" style="position:absolute" id="gameresult" width="1500" height="900">
		<p class="endtext" id="score">Congratulations, you have scored</p>
		<p class="endtext" id="killer"></p>
		</div>
	</div>

</div>

</body>
</html>