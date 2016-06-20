<!DOCTYPE html>
<html>
<head>
	<title>Dummy</title>
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
	<a href="./closesession.php"><div id="logout"></div></a>

	<div class="gates" id="gates">
		<div id="gate">
			<img class="gatetexture" src="images/1.png"></img>
			
			
			<div id="charms">
				
				<a href="./facebook_login.php">
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
	</div>

</div>

</body>
</html>