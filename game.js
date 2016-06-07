var canvas = document.getElementById("characters");
var ctx = canvas.getContext("2d");
var background = document.getElementById("background");
var backgroundContext = background.getContext("2d");
var points = document.getElementById("points");
var pointsContext = points.getContext("2d");

var ballRadius = 10;

var connection = new WebSocket('ws://localhost:8001');

var width, height;
var maze;
var score = 0;
var lives;

function Character (number) {
    this.x = -100; this.y = -100;
    this.state = 0;
    this.image=(document.getElementById("charimg"+number.toString())).src;
    this.name=(document.getElementById("charname"+number.toString())).innerHTML;
    console.log(this.image);
    console.log(this.name);
}

var characters = [new Character(0), new Character(1), new Character(2), new Character(3), new Character(3)];

connection.onmessage = function (event) {
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
        return;
    }
    if (event.data.startsWith("lvs")) {
        lives = parseInt (event.data.split(":")[1]);
        console.log ("Lives: " + lives);
        if (lives == 0)
            console.log ("Game over");
        return;
    }
    if (event.data.startsWith("win")) {
        console.log ("Level complete");
        return;
    }
    if (event.data.startsWith("ini")) {
        var data = event.data.split(":")[1].split(";");
        var delay = parseInt (data[0]);
        width = parseInt (data[1]);
        height = parseInt (data[2]);
        setInterval (draw, delay);
        return;
    }
};

document.addEventListener("keydown", keyDownHandler, false);

canvas.addEventListener('mousedown', function(evt) {
    var rect = canvas.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    if (x/canvas.width < y/canvas.height) {
        if (x/canvas.width < (canvas.height-y)/canvas.height)
            sendDirection (3);
        else
            sendDirection (2);
    }
    else {
        if (x/canvas.width < (canvas.height-y)/canvas.height)
            sendDirection (0);
        else
            sendDirection (1);
    }
}, false);

canvas.addEventListener('mouseup', function(evt) {
    mouseAction = false;
}, false);

function sendDirection (direction){
	connection.send("dir:"+direction.toString());
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

function drawPoints () {
    pointsContext.clearRect(0, 0, points.width, points.height);
    var i, j;
    var small = [];
    var big = [];
    var smallImage = new Image(), bigImage = new Image();
    for (i=0; i<width; i++)
        for (j=0; j<height; j++) {
            if (maze[i][j] == 2)
                small.push ({i:smallImage, x : background.width *i /width, y : background.height *j /height, w : background.width /width, h : background.height /height});
            if (maze[i][j] == 3)
                small.push ({i:bigImage, x : background.width *i /width, y : background.height *j /height, w : background.width /width, h : background.height /height});
        }
    smallImage.onload = function() {
        drawImages (pointsContext, small);
    }
    bigImage.onload = function() {
        drawImages (pointsContext, big);
    }
    smallImage.src="assets/twitter.png";
    bigImage.src="assets/like.png";
}

function loadImages (sources, info) {
    var loadedImages = 0;
    var numImages = info.length;
    var images = new Array(numImages);
    for(var i=0; i<info.length; i++) {
        images[i] = new Image();
        info[i].i = images[i];
        images[i].onload = function() {
            if(++loadedImages >= numImages) {
                drawImages(backgroundContext, info);
            }
        };
        images[i].src = sources[i];
    }
}

function drawImages (context, info) {
    for (var i=0; i<info.length; i++) {
        context.drawImage (info[i].i, info[i].x, info[i].y, info[i].w, info[i].h);
    }
}

function drawBackground () {
    var i, j;
    var sources = [];
    var info = [];
    for (i=0; i<width; i++)
        for (j=0; j<height; j++) {
            if (maze[i][j] == 1)
                sources.push("assets/rock" + Math.floor (Math.random() * 4).toString() + ".png");
            else
                sources.push("assets/clay5.png");//"assets/clay" + Math.floor (Math.random() * 6).toString() + ".png");
            info.push ({i : 0, x : background.width *i /width, y : background.height *j /height, w : background.width /width, h : background.height /height});
        }
    loadImages (sources, info);
}

function drawCharacter (character, img) {
    var x = canvas.width * (character.x+0.5) / width;
    var y = canvas.height * (character.y+0.5) / height;
	ctx.beginPath();
	ctx.arc (x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0077ff";
	ctx.fill();
	ctx.closePath();


}

function draw() {
    
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i=0; i<characters.length; i++)
	   drawCharacter(characters[i],"ghost"+toString(i));

}
