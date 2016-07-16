(function () {
    "use strict";
    var http = require("http");
    var server;

    exports.start = function (portNumber) {
        if(!portNumber) throw new Error("port number is required");
        server = http.createServer();
        server.on("request", function (req, res) {
            res.end("Hello World!");
        });
        server.listen(portNumber);
    };
    exports.stop = function (callback) {
        server.close(callback);
    }
}());
