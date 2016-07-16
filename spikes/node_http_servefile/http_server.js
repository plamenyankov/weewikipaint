var http = require("http");

var server = http.createServer();
var fs = require("fs");
server.on("request", function(req, res){
console.log("recieved req");
fs.readFile("file.html", function(err, data){
    res.end(data);

});

});

server.listen(8080);

console.log("server started");

