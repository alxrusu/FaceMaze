var ws = require("nodejs-websocket")
console.log(ws)
var server = ws.createServer(function (conn) {
    console.log("New connection")
    var dx=0;
    var dy=0;
    conn.on("text", function (str) {
        console.log("Received "+str)

        if (str.localeCompare("left")==0){
        	dx=-2;
        	dy=0;
        }
        if (str.localeCompare("right")==0){
        	dx=2;
        	dy=0;
        }
        if (str.localeCompare("up")==0){
        	dy=-2;
        	dx=0;
        }
        if (str.localeCompare("down")==0){
        	dx=0;
        	dy=2;
        }


        conn.sendText(dx.toString()+";"+dy.toString())
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(8001)