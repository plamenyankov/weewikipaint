(function () {
    "use strict";
    var http = require("http");
    var server = http.createServer();

    exports.start = function () {
        server.on("request", function (req, res) {
            res.end("Hello World!");
        });
        server.listen(8080);
        console.log("start :)");
    };
    exports.stop = function (callback) {
        server.close(callback);
    }
}());
