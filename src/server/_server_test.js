(function () {
    "use strict";
    var server = require("./server.js");
    var http = require("http");
    exports.tearDown = function (done) {
        server.stop(function () {
            done();
        })
    };
   
    exports.test_serverReturnsHelloWorld = function (test) {
        server.start();
        var request = http.get("http://localhost:8080");
        request.on("response", function (res) {
            res.setEncoding("utf8");
            test.equals(200, res.statusCode, "status");
            res.on("data", function (ch) {
                test.equals("Hello World!", ch, "response msg");
            });
            res.on("end", function () {
                test.done();
            });
        });
    };
}());
