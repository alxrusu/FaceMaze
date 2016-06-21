var foreground;
var foregroundContext;
var background;
var backgroundContext;
var points;
var pointsContext;

var imageRadius;

var connection;

var width, height;
var maze;
var score = 0;
var lives;

function startGame () {

    document.getElementById("gameresult").style.display="none";

    foreground = document.getElementById("characters");
    foregroundContext = foreground.getContext("2d");
    background = document.getElementById("background");
    backgroundContext = background.getContext("2d");
    points = document.getElementById("points");
    pointsContext = points.getContext("2d");

    connection = new WebSocket('ws://localhost:8001');
    connection.onmessage = parseMessage;

    document.addEventListener('keydown', keyDownHandler, false);
    foreground.addEventListener('mousedown', mouseDownHandler, false);

    characters = [new Character(0, "#FFF000"), new Character(1, "#FF0000"), new Character(2, "#FFB8FF"), new Character(3, "#00FFFF"), new Character(4, "#FFB851")];

}

function Character (number, color) {
    this.x = -100; this.y = -100;
    this.state = 0;
    this.color = color;
    this.image = new Image ();
    this.image.src = (document.getElementById("charimg"+number.toString())).src;
    this.name = (document.getElementById("charname"+number.toString())).innerHTML;
}

var characters;

function parseMessage (event) {
    if (event.data.startsWith("pos")) {
        var data = event.data.split(":")[1].split(";");
        for (var i=0; i<characters.length; i++) {
            characters[i].x = parseFloat (data[3*i]);
            characters[i].y = parseFloat (data[3*i+1]);
            characters[i].state = parseInt (data[3*i+2]);
        }
        return;
    }
    if (event.data.startsWith("scr")) {
        var data = event.data.split(":")[1];
        score = parseInt (data);
        console.log ("Score: " + score);
        document.getElementById("userscore").innerHTML=score;
        document.getElementById("score").innerHTML="Congratulations, you have scored "+score+" points!";
        return;
    }
    if (event.data.startsWith("del")) {
        var data = event.data.split(":")[1].split(";");
        var x = parseInt (data[0]);
        var y = parseInt (data[1]);
        maze[x][y] = 0;
        drawPoints();
        return;
    }
    if (event.data.startsWith("mze")) {
        var data = event.data.split(":")[1];
        maze = new Array (width);
        for (var i=0; i<width; i++) {
            maze[i] = new Array (height);
            for (j=0; j<height; j++) {
                maze[i][j] = parseInt (data.charAt (i*height + j));
            }
        }
        drawBackground();
        drawPoints();
        return;
    }
    if (event.data.startsWith("kil")) {
        var data = event.data.split(":")[1];
        console.log ("You were killed by " + data);
        document.getElementById("killer").innerHTML="You were killed by " + document.getElementById("charname"+data).innerHTML;
        return;
    }
    if (event.data.startsWith("lvs")) {
        lives = parseInt (event.data.split(":")[1]);
        console.log ("Lives: " + lives);
        if (lives == 0){
            console.log ("Game over");
            document.getElementById("gameresult").style.display="block";
            connection.close();
        }
        return;
    }
    if (event.data.startsWith("win")) {
        console.log ("Level complete");
        document.getElementById("gameresult").style.display="block";
        return;
    }
    if (event.data.startsWith("ini")) {
        var data = event.data.split(":")[1].split(";");
        var delay = parseInt (data[0]);
        width = parseInt (data[1]);
        height = parseInt (data[2]);
        imageRadius = Math.min (foreground.width / width, foreground.height / height) / 2;
        setInterval (draw, delay);
        return;
    }
};

function sendDirection (direction){
	connection.send("dir:"+direction.toString());
}

function mouseDownHandler (evt) {
    var rect = foreground.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    if (x/foreground.width < y/foreground.height) {
        if (x/foreground.width < (foreground.height-y)/foreground.height)
            sendDirection (3);
        else
            sendDirection (2);
    }
    else {
        if (x/foreground.width < (foreground.height-y)/foreground.height)
            sendDirection (0);
        else
            sendDirection (1);
    }
}

function keyDownHandler(e) {
    if(e.keyCode == 38) {
        sendDirection(0);
    }
    else if(e.keyCode == 39) {
        sendDirection(1);
    }
    else if(e.keyCode == 40) {
        sendDirection(2);
    }
    else if(e.keyCode == 37) {
        sendDirection(3);
    }
    else if (e.keyCode === 27) {
        connection.send("psd");
    }
}

var smallImage = new Image(), bigImage = new Image();
smallImage.src="assets/twitter.png";
bigImage.src="assets/like.png";

var rocks = [];
var clays = [];
var loadedImages = 0;
function countLoaded () {
    loadedImages++;
}
for (var i=0; i<4; i++) {
    rocks.push (new Image());
    rocks[i].src = "assets/rock" + i.toString() + ".png";
    rocks[i].onload = countLoaded;
}
for (var i=0; i<6; i++) {
    clays.push (new Image());
    clays[i].src = "assets/clay" + i.toString() + ".png";
    clays[i].onload = countLoaded;
}

function drawPoints () {
    pointsContext.clearRect(0, 0, points.width, points.height);
    var i, j;
    for (i=0; i<width; i++)
        for (j=0; j<height; j++) {
            if (maze[i][j] == 2)
                pointsContext.drawImage (smallImage, points.width *i /width, points.height *j /height, points.width /width, points.height /height);
            if (maze[i][j] == 3)
                pointsContext.drawImage (bigImage, points.width *i /width, points.height *j /height, points.width /width, points.height /height);
        }
}

function drawBackground () {
    if (loadedImages != rocks.length + clays.length) {
        setTimeout (drawBackground, 30);
        return;
    }
    var i, j;
    for (i=1; i<width-1; i++)
        for (j=1; j<height-1; j++) {
            if (maze[i][j] == 1)
                backgroundContext.drawImage (rocks[Math.floor (Math.random() * rocks.length)], background.width *i /width, background.height *j /height, background.width /width, background.height /height);
            else
                backgroundContext.drawImage (clays[Math.floor (Math.random() * clays.length)], background.width *i /width, background.height *j /height, background.width /width, background.height /height);
        }
}

function drawCharacter (character) {

    var x = foreground.width * (character.x+0.5) / width;
    var y = foreground.height * (character.y+0.5) / height;

    if (character.state == 2)
        foregroundContext.globalAlpha = 0.5;
    else
        foregroundContext.globalAlpha = 1;

	foregroundContext.beginPath();
	foregroundContext.arc (x, y, imageRadius*1.2, 0, Math.PI*2);
	if (character.state == 0)
        foregroundContext.fillStyle = character.color;
    else
        foregroundContext.fillStyle = "#2121FF";
	foregroundContext.fill();
	foregroundContext.closePath();

    foregroundContext.save();
    foregroundContext.beginPath();
    foregroundContext.arc (x, y, imageRadius, 0, Math.PI*2);
    foregroundContext.closePath();
    foregroundContext.clip();

    foregroundContext.drawImage (character.image, x - imageRadius, y - imageRadius, imageRadius*2, imageRadius*2);

    foregroundContext.beginPath();
    foregroundContext.arc (x, y, imageRadius, 0, Math.PI*2);
    foregroundContext.clip();
    foregroundContext.closePath();
    foregroundContext.restore();


}

function draw() {
    
	foregroundContext.clearRect(0, 0, foreground.width, foreground.height);
    for (var i=0; i<characters.length; i++)
	   drawCharacter (characters[i]);

}
