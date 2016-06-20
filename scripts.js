Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

function ListFriends(htmltext){
	document.getElementById("userdata").innerHTML=(htmltext);
	start_gate_opening();

 	document.getElementById("charimg1").parentElement.style.background="#FF0000";
	document.getElementById("charimg2").parentElement.style.background="#FFB8FF";
	document.getElementById("charimg3").parentElement.style.background="#00FFFF";
	document.getElementById("charimg4").parentElement.style.background="#FFB851";
}

function getFriends(){
	var xmlHttp = new XMLHttpRequest();
	
	xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            ListFriends(xmlHttp.responseText);
    }

    xmlHttp.open( "GET", "./friends.php", true ); // false for synchronous request
    xmlHttp.send( null );
    
}
