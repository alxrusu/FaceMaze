var gate_left;
var gate_right;
var gate_left_style;
var gate_right_style;


function on_open_gates(){

	var main=document.getElementById("main");
	eval("StartGame();");
	
}

function open_gates(delta){
	var target_left=-window.innerWidth/2;
	var target_right=innerWidth;
	if (parseInt(gate_left_style.left)>target_left){

		gate_left.style.left=parseInt(gate_left_style.left)-delta+"px";
		gate_right.style.right=parseInt(gate_right_style.right)-delta+"px";
		setTimeout(open_gates,10,delta+0.5);
		
	}
	else
	{
		gate_left.style.left="-50%";
		gate_right.style.right="-50%";
		on_open_gates();
	}
}

function start_gate_opening(){
	setTimeout(open_gates,200,1);
}

window.onload=function(){
	gate_left=document.getElementById("gate_left");
	gate_left_style=getComputedStyle(gate_left);
	gate_right=document.getElementById("gate_right");
	gate_right_style=getComputedStyle(gate_right);

}

