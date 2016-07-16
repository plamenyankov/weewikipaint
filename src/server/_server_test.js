(function () {
    "use strict";
    var server = require("./server.js");
    var http = require("http");
    var fs = require("fs");

    exports.test_serverReturnsHelloWorld = function (test) {
        server.start(8080);

        var request = http.get("http://localhost:8080");
        request.on("response", function (res) {
            res.setEncoding("utf8");
            test.equals(200, res.statusCode, "status");
            res.on("data", function (ch) {
                test.equals("Hello World!", ch, "response msg");
            });
            res.on("end", function () {
                server.stop(function () {
                    test.done();
                });
            });
        });
    };
    exports.test_serverRunsCallbackWhenStopCompletes = function (test) {
        server.start(8080);
        server.stop(function () {
            test.done();
        });
    };
    exports.test_stopCalledTwiceInARowTrowsAnException = function (test) {
        server.stop(function (err) {
            test.notEqual(err, undefined);
            test.done();
        });

    };
    exports.test_serverServesAFile = function (test) {
        var testDir = "generated/test"
        var testFile = testDir + "/test.html"
        fs.writeFile(testFile, "hello");
        test.done();
    };
}());
