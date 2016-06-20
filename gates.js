var gate;
var gate_style;


function on_open_gates(){

	var main=document.getElementById("main");
	document.getElementById("game_wrapper").style.zIndex="3";
	document.getElementById("gates").remove();
	eval("startGame();");
	
}

function open_gates(delta){
	var target=-window.innerHeight;
	
	if (parseInt(gate_style.top)>target){

		gate.style.top=parseInt(gate_style.top)-delta+"px";
		setTimeout(open_gates,10,delta+0.5);
		
	}
	else
	{
		gate.style.top="-103%";
		gate.style.display="none";
		on_open_gates();
	}
}

function start_gate_opening(){
	setTimeout(open_gates,1000,1);
}

window.onload=function(){
	gate=document.getElementById("gate");
	gate_style=getComputedStyle(gate);
}

