<html>
<head>
	<title>FaceMaze</title>
	<link rel="stylesheet" type="text/css" href="stylesheet.css">
	<link rel="shortcut icon" href="pac_icon.png">
	<script type="text/javascript" src="scripts.js"></script>

</head>


<body
	<div id="main">
	
		<div id="sidebar" onclick="toggle_sidebar()">
			<?php
				session_start();
				$poza='user.png';
				if (isset($_SESSION['profile_picture']))
					$poza=$_SESSION['profile_picture'];	
					
				echo '<img width=150 height=150 id="user" src="'.str_replace('_normal', '', $poza).'">';

			?>
			<div id="userInfo">
				<p>Mr. Pog Chan-Pyon</p>
			</div>
			
			<br>
			<hr class="faded">
			<br>
			
			<div id="userTools">
				<p>Setari cont</p>
				<a href="closesession.php"><p>Logout</p></a>
			</div>
			
			<div id="social">
				<img class="media" src="facebook_logo.png">
				<img class="media" src="insta_logo.png">
				<img class="media" src="twitter_logo.png">
			</div>
			
		</div>

		<div id="ranking" onclick="toggle_ranking()">
		
			<img id="logo" src="FaceMaze_logo.png">
		
			<div id="clasament">
				<p>Clasament</p>
			</div>
			
			<table id="rankingTable">
								
				<tr>
					<td class="rankingName"> Supa La Plic </td>
					<td class="rankingScore"> 20 </td>
				</tr>
				
				<tr>
					<td class="rankingName"> Mr. Ross Kappa </td>
					<td class="rankingScore"> 18 </td>
				</tr>
				
				<tr>
					<td class="rankingName"> President Sleeper </td>
					<td class="rankingScore"> 17 </td>
				</tr>
				
				
			</table>
			
		</div>
		
		<div id="game" onclick="redirect()">
			<img src="background.png" style = "width:100%; height:100%;" /> 
		</div>
		
	</div>
</body>
</html>