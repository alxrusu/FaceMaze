var flag_s = 1;
var flag_r = 0;

function toggle_sidebar(){
	if (flag_s==1){
		document.getElementById('sidebar').style.left="-13%";
		document.getElementById('game').style.left="2%";
	}
	else
	{
		document.getElementById('sidebar').style.left="0%";
		document.getElementById('game').style.left="15%";
	}
	flag_s = 1 - flag_s;
	document.getElementById('game').style.width= (96 - (flag_s + flag_r) *13) + "%";
}

function toggle_ranking(){
	if (flag_r==1){
		document.getElementById('clasament').style.visibility="hidden";
		document.getElementById('rankingTable').style.visibility="hidden";
		document.getElementById('ranking').style.width="2%";
		document.getElementById('ranking').style.left="98%";
	}
	else
	{
		document.getElementById('clasament').style.visibility="visible";
		document.getElementById('rankingTable').style.visibility="visible";
		document.getElementById('ranking').style.left="85%";
		document.getElementById('ranking').style.width="15%";
	}
	flag_r = 1 - flag_r;
	document.getElementById('game').style.width= (96 - (flag_s + flag_r) *13) + "%";
}


function redirect () {

	document.getElementById('game').innerHTML="<embed width=\"100%\" height=\"100%\" src=\"http://www.webpacman.com/flash/pacman.swf\" quality=\"high\" type=\"application/x-shockwave-flash\">";
	flag_s = 1;
	flag_r = 1;
	toggle_sidebar();
	toggle_ranking();
	
}