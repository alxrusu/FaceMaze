var ws = require("nodejs-websocket")

var width = 33, height = 18;
var delay = 20;

var smallScore = 10, bigScore = 30, enemyScore = 200;

var directions = [ {x:0,y:-1}, {x:1,y:0}, {x:0,y:1}, {x:-1,y:0} ];

function gameState (socket) {
    this.socket = socket;
    this.maze = generateMaze();
    this.score = 0;
    this.imuneTimer = 0;
    this.combo = 1;
    this.lives = 3;
    this.paused = 0;
    this.sleep = 0;
    this.characters = [ new player(this), new redGhost(this), new pinkGhost(this), new cyanGhost(this), new orangeGhost(this) ];
}

function player (instance) {
    this.instance = instance;
    this.x = -10; this.y = -10;
    this.dx = -1; this.dy = 0;
    this.direction = 3;
    this.state = 0;
    this.granularity = 15;
    this.step = 0;
    function update(character) {
        if (character.instance.maze[character.x + directions[character.direction].x][character.y + directions[character.direction].y] != -1) {
            character.dx = directions[character.direction].x;
            character.dy = directions[character.direction].y;
        }
        else if (character.instance.maze[character.x + character.dx][character.y + character.dy] == -1) {
            character.dx = 0;
            character.dy = 0;
        }

        //points
        if (character.instance.maze[character.x][character.y] == 2) {
            character.instance.maze[character.x][character.y] = 0;
            character.instance.score += smallScore;
            sendScore (character.instance);
            sendDelete (character.instance, character.x, character.y);
            checkWin (character.instance);
        }
        else if (character.instance.maze[character.x][character.y] == 3) {
            character.instance.maze[character.x][character.y] = 0;
            character.instance.score += bigScore;
            sendScore (character.instance);
            sendDelete (character.instance, character.x, character.y);
            checkWin (character.instance);
            character.instance.imuneTimer = 7000;
            for (var i=1; i<character.instance.characters.length; i++) {
                if (character.instance.characters[i].state == 0)
                    character.instance.characters[i].state = 1;
            }
        }
    }
    this.update = update;
}

function redGhost (instance) {
    this.instance = instance;
    this.x = -10; this.y = -10;
    this.dx = 0; this.dy = 0;
    this.direction = 1;
    this.granularity = 14;
    this.state = 0;
    this.step = 0;
    function update(character) {
        var targetPos;
        if (character.state == 2 &&
            character.x == 1 && character.y == 1)
            character.state = 0;
        if (character.state == 0) {
            targetPos = {x:character.instance.characters[0].x, y:character.instance.characters[0].y};
            character.granularity = 14;
        }
        else {
            targetPos = {x:1, y:1};
            if (character.state == 1)
                character.granularity = 30;
            else
                character.granularity = 20;
        }
        var newDirection = getDirection (character.instance.maze, {x:character.x, y:character.y}, targetPos);
        if (Math.abs(character.direction - newDirection) == 2) {
            if (character.state == 2
                || character.instance.maze[character.x + character.dx][character.y + character.dy] == -1)
                character.direction = newDirection;
        }
        else
            character.direction = newDirection;
        character.dx = directions[character.direction].x;
        character.dy = directions[character.direction].y;
    }
    this.update = update;
}

function pinkGhost (instance) {
    this.instance = instance;
    this.x = -10; this.y = -10;
    this.dx = 0; this.dy = 0;
    this.direction = 1;
    this.granularity = 16;
    this.state = 0;
    this.step = 0;
    function update(character) {
        var targetPos;
        if (character.state == 2 &&
            character.x == 1 && character.y == height-2)
            character.state = 0;
        if (character.state == 0) {
            var player = character.instance.characters[0];
            targetPos = {x:player.x + player.dx * 3, y:player.y + player.dy * 3};
            if (targetPos.x < 0) targetPos.x = 1;
            if (targetPos.x >= width) targetPos.x = width-2;
            if (targetPos.y < 0) targetPos.y = 1;
            if (targetPos.y >= height) targetPos.y = height-2;
            while (character.instance.maze[targetPos.x][targetPos.y] == -1) {
                targetPos.x -= player.dx;
                targetPos.y -= player.dy;
            }
            character.granularity = 16;
        }
        else {
            targetPos = {x:1, y:height-2};
            if (character.state == 1)
                character.granularity = 30;
            else
                character.granularity = 20;
        }
        var newDirection = getDirection (character.instance.maze, {x:character.x, y:character.y}, targetPos);
        if (Math.abs(character.direction - newDirection) == 2) {
            if (character.state == 2
                || character.instance.maze[character.x + character.dx][character.y + character.dy] == -1)
                character.direction = newDirection;
        }
        else
            character.direction = newDirection;
        character.dx = directions[character.direction].x;
        character.dy = directions[character.direction].y;
    }
    this.update = update;
}

function cyanGhost (instance) {
    this.instance = instance;
    this.x = -10; this.y = -10;
    this.dx = 0; this.dy = 0;
    this.direction = 3;
    this.granularity = 16;
    this.state = 0;
    this.step = 0;
    function update(character) {
        var targetPos;
        if (character.state == 2 &&
            character.x == width-2 && character.y == height-2)
            character.state = 0;
        if (character.state == 0) {
            var player = character.instance.characters[0];
            var redGhost = character.instance.characters[1];
            var delta = {x:player.x - redGhost.x, y:player.y - redGhost.y};
            var coef = 1;
            targetPos = {x:-10, y:-10};
            while (coef>=0) {
                targetPos.x = Math.floor(player.x + delta.x * coef);
                targetPos.y = Math.floor(player.y + delta.y * coef);
                if (targetPos.x < 0) targetPos.x = 1;
                if (targetPos.x >= width) targetPos.x = width-2;
                if (targetPos.y < 0) targetPos.y = 1;
                if (targetPos.y >= height) targetPos.y = height-2;
                if (character.instance.maze[targetPos.x][targetPos.y] == 0)
                    break;
                coef -= 0.2;
            }
            character.granularity = 16;
        }
        else {
            targetPos = {x:width-2, y:height-2};
            if (character.state == 1)
                character.granularity = 30;
            else
                character.granularity = 20;
        }
        var newDirection = getDirection (character.instance.maze, {x:character.x, y:character.y}, targetPos);
        if (Math.abs(character.direction - newDirection) == 2) {
            if (character.state == 2
                || character.instance.maze[character.x + character.dx][character.y + character.dy] == -1)
                character.direction = newDirection;
        }
        else
            character.direction = newDirection;
        character.dx = directions[character.direction].x;
        character.dy = directions[character.direction].y;
    }
    this.update = update;
}

function orangeGhost (instance) {
    this.instance = instance;
    this.x = -10; this.y = -10;
    this.dx = 0; this.dy = 0;
    this.direction = 3;
    this.granularity = 12;
    this.state = 0;
    this.step = 0;
    function update(character) {
        var targetPos;
        if (character.state == 2 &&
            character.x == width-2 && character.y == 1)
            character.state = 0;
        if (character.state == 0) {
            var player = character.instance.characters[0];
            if (Math.abs(character.x-player.x) + Math.abs(character.y-player.y) > 6)
                targetPos = {x:player.x, y:player.y};
            else
                targetPos = {x:width-2, y:1};
            character.granularity = 12;
        }
        else {
            targetPos = {x:width-2, y:1};
            if (character.state == 1)
                character.granularity = 30;
            else
                character.granularity = 20;
        }
        var newDirection = getDirection (character.instance.maze, {x:character.x, y:character.y}, targetPos);
        if (Math.abs(character.direction - newDirection) == 2) {
            if (character.state == 2
                || character.instance.maze[character.x + character.dx][character.y + character.dy] == -1)
                character.direction = newDirection;
        }
        else
            character.direction = newDirection;
        character.dx = directions[character.direction].x;
        character.dy = directions[character.direction].y;
    }
    this.update = update;
}

function getDirection (maze, startPos, targetPos) {
    var stack = [];
    var i, x, y;
    var currentPos;
    var mazeClone = new Array (width);
    for (x=0; x<width; x++) {
        mazeClone[x] = new Array (height);
        for (y=0; y<height; y++)
            mazeClone[x][y] = maze[x][y] == -1 ? -1 : 0;
    }
    for (i=0; i<directions.length; i++) {
        x = startPos.x + directions[i].x;
        y = startPos.y + directions[i].y;
        if (mazeClone[x][y] == 0) {
            mazeClone[x][y] = i+1;
            stack.push ({x:x, y:y});
        }
    }
    while (stack.length > 0) {
        currentPos = stack[0];
        stack.splice(0, 1);
        if (currentPos == targetPos)
            break;
        for (i=0; i<directions.length; i++) {
            x = currentPos.x + directions[i].x;
            y = currentPos.y + directions[i].y;
            if (mazeClone[x][y] == 0) {
                mazeClone[x][y] = mazeClone[currentPos.x][currentPos.y];
                stack.push ({x:x, y:y});
            }
        }
    }
    if (mazeClone[targetPos.x][targetPos.y]>=1)
        return mazeClone[targetPos.x][targetPos.y]-1;
    else
        return 0;
}

var instances = [];

var server = ws.createServer (function (socket) {

    console.log("New connection")

    instance = new gameState(socket);
    resetPositions (instance);
    sendInit (instance);
    sendMaze (instance);
    var intervalID = setInterval (sendUpdate, delay, instance);
    instances.push (instance);

    socket.on("text", function (str) {
        if (str.startsWith("dir")) {
            var newDirection = parseInt (str.split(":")[1]);
            if (newDirection < directions.length)
                instance.characters[0].direction = newDirection;
        }
        if (str.startsWith("psd")) {
            instance.paused = 1 - instance.paused;
        }
    });

    socket.on("close", function (code, reason) {
        clearInterval (intervalID);
        var index = instances.indexOf (instance);
        instances.splice (index, 1);
        console.log("Connection closed");
    });

    socket.on("error", function(err) {
        clearInterval (intervalID);
    });

}).listen(8001)

function sendUpdate (instance) {
    if (instance.paused)
        return;
    if (instance.sleep > 0) {
        instance.sleep -= delay;
        return;
    }
    var result = "pos:";
    var i, x, y;
    var character;
    for (i=0; i<instance.characters.length; i++) {
        character = instance.characters[i];
        x = character.x + character.dx * character.step / character.granularity;
        y = character.y + character.dy * character.step / character.granularity;
        result += (Math.floor(x*100)/100).toString() + ";";
        result += (Math.floor(y*100)/100).toString() + ";";
        result += character.state.toString() + ";";
        if (character.step == character.granularity) {
            character.step = 0;
            character.x += character.dx;
            character.y += character.dy;
            character.update(character);
        }
    }
    instance.socket.sendText (result);
    detectCollisions(instance);
    if (instance.imuneTimer > 0) {
        instance.imuneTimer -= delay;
        if (instance.imuneTimer <= 0) {
            instance.combo = 1;
            for (i=1; i<instance.characters.length; i++) 
                if (instance.characters[i].state == 1)
                    instance.characters[i].state = 0;        
        }
    }
    for (i=0; i<instance.characters.length; i++) {
        if (instance.characters[i].dx == 0 && instance.characters[i].dy == 0)
            instance.characters[i].step = instance.characters[i].granularity;
        else
            instance.characters[i].step++;
    }
}

function detectCollisions (instance) {
    var player = instance.characters[0];
    var playerX = player.x + player.dx * player.step / player.granularity;
    var playerY = player.y + player.dy * player.step / player.granularity;
    var enemy, x, y;
    for (var i=1; i<instance.characters.length; i++) {
        enemy = instance.characters[i];
        x = enemy.x + enemy.dx * enemy.step / enemy.granularity;
        y = enemy.y + enemy.dy * enemy.step / enemy.granularity;
        if (Math.abs (playerX - x) < 0.5 && Math.abs (playerY - y) < 0.5) {
            if (enemy.state == 0) {
                instance.sleep = 100000000;
                instance.lives -= 1;
                instance.socket.sendText ("kil:" + i.toString());
                instance.socket.sendText ("lvs:" + instance.lives.toString());
                if (instance.lives > 0) {
                    setTimeout (resetPositions, 1500, instance);
                }
            }
            else if (enemy.state == 1) {
                enemy.state = 2;
                instance.score += instance.combo * enemyScore;
                instance.combo *= 2;
                sendScore (instance);
            }
        }
    }
}

function checkWin (instance) {
    for (var i=0; i<width; i++)
        for (var j=0; j<height; j++)
            if (instance.maze[i][j] == 2 || instance.maze[i][j] == 3)
                return;
    instance.sleep=2000;
    instance.socket.sendText ("win");
    setTimeout (newGame, 1000, instance);
}

function newGame (instance) {
    instance.maze = generateMaze();
    sendMaze (instance);
    resetPositions (instance);
}

function sendScore (instance) {
    instance.socket.sendText ("scr:"+instance.score.toString());
}

function sendDelete (instance, x, y) {
    instance.socket.sendText ("del:"+x.toString()+";"+y.toString()+";");
}

function sendInit (instance) {
    var result = "ini:";
    result += delay.toString() + ";";
    result += width.toString() + ";";
    result += height.toString() + ";";
    instance.socket.sendText (result);
}

function sendMaze (instance) {
    var result = "mze:";
    for (var i=0; i<width; i++)
        for (var j=0; j<height; j++) {
            result+=Math.abs(instance.maze[i][j]).toString();
        }
    instance.socket.sendText (result);
}

function resetPositions (instance) {
    instance.characters[0].x = 16;
    instance.characters[0].y = 9;
    instance.characters[1].x = 1;
    instance.characters[1].y = 1;
    instance.characters[1].direction = 1;
    instance.characters[2].x = 1;
    instance.characters[2].y = height - 2;
    instance.characters[2].direction = 1;
    instance.characters[3].x = width - 2;
    instance.characters[3].y = height - 2;
    instance.characters[3].direction = 3;
    instance.characters[4].x = width - 2;
    instance.characters[4].y = 1;
    instance.characters[4].direction = 3;
    for (var i=0; i<instance.characters.length; i++) {
        instance.characters[i].dx = 0;
        instance.characters[i].dy = 0;
        instance.characters[i].state = 0;
    }
    instance.sleep = 0;
    sendUpdate (instance);
    instance.sleep = 2000;
}

function generateMaze () {
    var maze = new Array (width);
    var i, j;

    //init
    for (i=0; i<width; i++) {
        maze[i] = new Array (height);
        for (j=0; j<height; j++)
            maze[i][j] = 0;
    }

    //outer walls
    for (i=0; i<width; i++) {
        maze[i][0]=-1;
        maze[i][height-1]=-1;
    }
    for (j=0; j<height; j++) {
        maze[0][j]=-1;
        maze[width-1][j]=-1;
    }

    //procedural inner walls
    for (i=2; i<width-1; i+=6) 
        for (j=2; j<height-1; j+=5) {
            if (i == 14 && j == 7) {
                maze[i+0][j+0] = -1;    maze[i+1][j+0] = -1;    maze[i+3][j+0] = -1;    maze[i+4][j+0] = -1;
                maze[i+0][j+3] = -1;    maze[i+1][j+3] = -1;    maze[i+3][j+3] = -1;    maze[i+4][j+3] = -1;
                continue;
            }
            switch (Math.floor (Math.random() * 17)) {

            case 0:
                maze[i+0][j+0] = -1;    maze[i+0][j+1] = -1;    maze[i+0][j+2] = -1;    maze[i+0][j+3] = -1;
                maze[i+1][j+0] = -1;    maze[i+1][j+1] = -1;    maze[i+1][j+2] = -1;    maze[i+1][j+3] = -1;
                maze[i+3][j+0] = -1;    maze[i+3][j+1] = -1;    maze[i+3][j+2] = -1;    maze[i+3][j+3] = -1;
                maze[i+4][j+0] = -1;    maze[i+4][j+1] = -1;    maze[i+4][j+2] = -1;    maze[i+4][j+3] = -1;
                break;

            case 1:
                maze[i+0][j+0] = -1;    maze[i+0][j+1] = -1;    maze[i+0][j+3] = -1;
                maze[i+1][j+0] = -1;    maze[i+1][j+1] = -1;    maze[i+1][j+3] = -1;
                maze[i+2][j+3] = -1;
                maze[i+3][j+0] = -1;    maze[i+3][j+1] = -1;    maze[i+3][j+3] = -1;
                maze[i+4][j+0] = -1;    maze[i+4][j+1] = -1;    maze[i+4][j+3] = -1;
                break;

            case 2:
                maze[i+0][j+0] = -1;    maze[i+0][j+2] = -1;    maze[i+0][j+3] = -1;
                maze[i+1][j+0] = -1;    maze[i+1][j+2] = -1;    maze[i+1][j+3] = -1;
                maze[i+2][j+0] = -1;
                maze[i+3][j+0] = -1;    maze[i+3][j+2] = -1;    maze[i+3][j+3] = -1;
                maze[i+4][j+0] = -1;    maze[i+4][j+2] = -1;    maze[i+4][j+3] = -1;
                break;

            case 3:
                maze[i+0][j+0] = -1;    maze[i+1][j+0] = -1;    maze[i+2][j+0] = -1;    maze[i+3][j+0] = -1;    maze[i+4][j+0] = -1;
                maze[i+0][j+1] = -1;    maze[i+1][j+1] = -1;    maze[i+3][j+2] = -1;    maze[i+4][j+2] = -1;
                maze[i+0][j+3] = -1;    maze[i+1][j+3] = -1;    maze[i+2][j+3] = -1;    maze[i+3][j+3] = -1;    maze[i+4][j+3] = -1;
                break;

            case 4:
                maze[i+0][j+0] = -1;    maze[i+1][j+0] = -1;    maze[i+2][j+0] = -1;    maze[i+3][j+0] = -1;    maze[i+4][j+0] = -1;
                maze[i+0][j+2] = -1;    maze[i+1][j+2] = -1;    maze[i+3][j+1] = -1;    maze[i+4][j+1] = -1;
                maze[i+0][j+3] = -1;    maze[i+1][j+3] = -1;    maze[i+2][j+3] = -1;    maze[i+3][j+3] = -1;    maze[i+4][j+3] = -1;
                break;

            case 5:
                maze[i+0][j+0] = -1;    maze[i+0][j+1] = -1;    maze[i+0][j+2] = -1;    maze[i+0][j+3] = -1;
                maze[i+2][j+0] = -1;    maze[i+2][j+1] = -1;    maze[i+2][j+3] = -1;    maze[i+1][j+3] = -1;    maze[i+3][j+3] = -1;
                maze[i+4][j+0] = -1;    maze[i+4][j+1] = -1;    maze[i+4][j+2] = -1;    maze[i+4][j+3] = -1;
                break;
                
            case 6:
                maze[i+0][j+0] = -1;    maze[i+0][j+1] = -1;    maze[i+0][j+2] = -1;    maze[i+0][j+3] = -1;
                maze[i+2][j+0] = -1;    maze[i+2][j+2] = -1;    maze[i+2][j+3] = -1;    maze[i+1][j+0] = -1;    maze[i+3][j+0] = -1;
                maze[i+4][j+0] = -1;    maze[i+4][j+1] = -1;    maze[i+4][j+2] = -1;    maze[i+4][j+3] = -1;
                break;

            case 7:
                maze[i+0][j+0] = -1;    maze[i+0][j+2] = -1;    maze[i+0][j+3] = -1;
                maze[i+1][j+0] = -1;    maze[i+1][j+2] = -1;    maze[i+1][j+3] = -1;
                maze[i+3][j+0] = -1;    maze[i+3][j+1] = -1;    maze[i+3][j+3] = -1;
                maze[i+4][j+0] = -1;    maze[i+4][j+1] = -1;    maze[i+4][j+3] = -1;
                break;

            case 8:
                maze[i+0][j+0] = -1;    maze[i+0][j+1] = -1;    maze[i+0][j+3] = -1;
                maze[i+1][j+0] = -1;    maze[i+1][j+1] = -1;    maze[i+1][j+3] = -1;
                maze[i+3][j+0] = -1;    maze[i+3][j+2] = -1;    maze[i+3][j+3] = -1;
                maze[i+4][j+0] = -1;    maze[i+4][j+2] = -1;    maze[i+4][j+3] = -1;
                break;

            case 9:
                maze[i+0][j+0] = -1;    maze[i+0][j+1] = -1;    maze[i+0][j+2] = -1;    maze[i+0][j+3] = -1;
                maze[i+1][j+3] = -1;
                maze[i+2][j+0] = -1;    maze[i+2][j+1] = -1;    maze[i+2][j+3] = -1;
                maze[i+3][j+0] = -1;    maze[i+3][j+1] = -1;    maze[i+3][j+3] = -1;
                maze[i+4][j+0] = -1;    maze[i+4][j+1] = -1;    maze[i+4][j+3] = -1;
                break;

            case 10:
                maze[i+0][j+0] = -1;    maze[i+0][j+1] = -1;    maze[i+0][j+3] = -1;
                maze[i+1][j+0] = -1;    maze[i+1][j+1] = -1;    maze[i+1][j+3] = -1;
                maze[i+2][j+0] = -1;    maze[i+2][j+1] = -1;    maze[i+2][j+3] = -1;
                maze[i+3][j+3] = -1;
                maze[i+4][j+0] = -1;    maze[i+4][j+1] = -1;    maze[i+4][j+2] = -1;    maze[i+4][j+3] = -1;
                break;

            case 11:
                maze[i+0][j+0] = -1;    maze[i+0][j+2] = -1;    maze[i+0][j+3] = -1;
                maze[i+1][j+0] = -1;    maze[i+1][j+2] = -1;    maze[i+1][j+3] = -1;
                maze[i+2][j+0] = -1;    maze[i+2][j+2] = -1;    maze[i+2][j+3] = -1;
                maze[i+3][j+0] = -1;
                maze[i+4][j+0] = -1;    maze[i+4][j+1] = -1;    maze[i+4][j+2] = -1;    maze[i+4][j+3] = -1;
                break;

            case 12:
                maze[i+0][j+0] = -1;    maze[i+0][j+1] = -1;    maze[i+0][j+2] = -1;    maze[i+0][j+3] = -1;
                maze[i+1][j+0] = -1;
                maze[i+2][j+0] = -1;    maze[i+2][j+2] = -1;    maze[i+2][j+3] = -1;
                maze[i+3][j+0] = -1;    maze[i+3][j+2] = -1;    maze[i+3][j+3] = -1;
                maze[i+4][j+0] = -1;    maze[i+4][j+2] = -1;    maze[i+4][j+3] = -1;
                break;

            case 13:
                maze[i+0][j+0] = -1;    maze[i+0][j+1] = -1;    maze[i+0][j+2] = -1;    maze[i+0][j+3] = -1;
                maze[i+2][j+2] = -1;    maze[i+2][j+3] = -1;    maze[i+1][j+0] = -1;    maze[i+3][j+0] = -1;
                maze[i+4][j+0] = -1;    maze[i+4][j+1] = -1;    maze[i+4][j+2] = -1;    maze[i+4][j+3] = -1;
                break;

            case 14:
                maze[i+0][j+0] = -1;    maze[i+0][j+1] = -1;    maze[i+0][j+2] = -1;    maze[i+0][j+3] = -1;
                maze[i+2][j+0] = -1;    maze[i+2][j+1] = -1;    maze[i+1][j+3] = -1;    maze[i+3][j+3] = -1;
                maze[i+4][j+0] = -1;    maze[i+4][j+1] = -1;    maze[i+4][j+2] = -1;    maze[i+4][j+3] = -1;
                break;

            case 15:
                maze[i+0][j+0] = -1;    maze[i+0][j+2] = -1;    maze[i+0][j+3] = -1;
                maze[i+1][j+2] = -1;    maze[i+1][j+3] = -1;    maze[i+2][j+3] = -1;
                maze[i+2][j+0] = -1;    maze[i+3][j+0] = -1;    maze[i+3][j+1] = -1;
                maze[i+4][j+0] = -1;    maze[i+4][j+1] = -1;    maze[i+4][j+3] = -1;
                break;
                
            case 16:
                maze[i+0][j+0] = -1;    maze[i+0][j+1] = -1;    maze[i+0][j+3] = -1;
                maze[i+1][j+0] = -1;    maze[i+1][j+1] = -1;    maze[i+2][j+0] = -1;
                maze[i+2][j+3] = -1;    maze[i+3][j+2] = -1;    maze[i+3][j+3] = -1;
                maze[i+4][j+0] = -1;    maze[i+4][j+2] = -1;    maze[i+4][j+3] = -1;
                break;
                
            }
        }

    //points
    for (i=1; i<width-1; i++)
        for (j=1; j<height-1; j++)
            if (maze[i][j] == 0)
                maze[i][j] = 2;
    for (i=15; i<18; i++)
        for (j=8; j<10; j++)
            maze[i][j] = 0;

    maze[2][6] = 3;
    maze[7][15] = 3;
    maze[19][15] = 3;
    maze[30][11] = 3;
    maze[25][2] = 3;
    maze[13][2] = 3;

    return maze;
}
