(function () {
    "use strict";
    var child_process = require("child_process");
    var http = require("http");
    var fs = require('fs');
    var child;
    exports.setUp = function (done) {
        runServer(done);
    };
    exports.tearDown = function (done) {
        child.on("exit", function (err, data) {
            done();
        });
        child.kill();
    };
    exports.test_canGetHomePage = function (test) {
        httpGet("http://localhost:5000", function (response, recievedData) {
            var homePage = recievedData.indexOf("Weeeikipaint Homepage") !== -1;
            test.ok(homePage, "homepage should have contained test marker");
            test.done();
        });
    };
    exports.test_canGet404Page = function (test) {
        httpGet("http://localhost:5000/error", function (response, recievedData) {
            var homePage = recievedData.indexOf("Page Not Found 404") !== -1;
            test.ok(homePage, "404 page should have contained test marker");
            test.done();
        });
    };
    function runServer(callback) {
        var args = parseProcfile();

        child = child_process.spawn(args[0], [args[1], args[2]]);
        child.stdout.setEncoding("utf8");
        child.stdout.on('data', function (data) {
            if (data.trim() === "server started") callback();
        });

    }

    function parseProcfile() {
        var content = fs.readFileSync('procfile', 'utf8');

        var obj = content.trim().match(/^web:\s(.*)$/)[1];
        var match = obj.split(" ");
        match = match.filter(function (el) {
            if (el.trim() !== "") return el;
        });
        match = match.map(function (el) {
            if (el === '$PORT') {
                return 5000;
            } else {
                return el;
            }
        });
        return match;
    }

    function httpGet(url, callback) {
        var request = http.get(url);
        request.on("response", function (res) {
            res.setEncoding("utf8");
            var resData = "";
            res.on("data", function (ch) {
                resData += ch;
            });
            res.on("end", function () {
                callback(res, resData);
            });
        });
    }
}());
