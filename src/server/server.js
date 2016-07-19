(function () {
    "use strict";
    var http = require("http");
    var fs = require("fs");
    var server;

    exports.start = function (homePageToServe, notFoundPageToServe, portNumber, callback) {
        if (!portNumber) throw new Error("port number is required");
        server = http.createServer();
        server.on("request", function (req, res) {
            if (req.url === "/" || req.url === "/index.html") {
                res.statusCode = 200;
                serveFile(res,homePageToServe);
            } else {
                res.statusCode = 404;
                serveFile(res,notFoundPageToServe);
            }
        });
        server.listen(portNumber, callback);
    };
    function serveFile(res, file){
        fs.readFile(file, function (err, data) {
            if (err) throw err;
            res.end(data);
        });
    }
    exports.stop = function (callback) {
        server.close(callback);
    }
}());
