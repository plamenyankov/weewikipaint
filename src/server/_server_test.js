(function () {
    "use strict";
    var server = require("./server.js");
    var http = require("http");
    var fs = require("fs");
    var assert = require("assert");
    var TEST_HOME_PAGE = "generated/test/testHome.html";
    var TEST_404_PAGE = "generated/test/test404.html";

    exports.tearDown = function (done) {
        cleanUpFile(TEST_HOME_PAGE);
        cleanUpFile(TEST_404_PAGE);

            done();
    };

    exports.test_runsCallbackWhenStopCompletes = function (test) {
        server.start(TEST_HOME_PAGE, TEST_404_PAGE, 8080);
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

    exports.test_returns404ErrorForEverythingExceptHomePage = function (test) {
        var expectedData = "This is 404 file";
        fs.writeFile(TEST_404_PAGE, expectedData);
        httpGet("http://localhost:8080/error", function (response, responseData) {
            test.equals(404, response.statusCode, "status");
            test.equals(expectedData, responseData, "response data");
            test.done();

        });

    };
    exports.test_servesHomepageFromFile = function (test) {
        var testData = "hello";
        fs.writeFile(TEST_HOME_PAGE, testData);
        httpGet("http://localhost:8080", function (response, responseData) {
            test.equals(200, response.statusCode, "status");
            test.equals(testData, responseData, "response msg");
            test.done();
        });

    };
    exports.test_returnsHomepageWhenAskedForIndex = function (test) {
        var testData = "hello";
        fs.writeFile(TEST_HOME_PAGE, testData);
        httpGet("http://localhost:8080/index.html", function (response, responseData) {
            test.equals(200, response.statusCode, "status");
            test.done();
        });
    };
    exports.test_requiresHomePageParameter = function(test){
        test.throws(function(){
            server.start();
        });
        test.done();
    };
    exports.test_requires404PageParameter = function(test){
        test.throws(function(){
            server.start(TEST_HOME_PAGE);
        });
        test.done();
    };
    exports.test_requiresPortParameter = function(test){
        test.throws(function(){
            server.start(TEST_HOME_PAGE, TEST_404_PAGE);
        });
        test.done();
    };
    function httpGet(url, callback) {
        server.start(TEST_HOME_PAGE, TEST_404_PAGE, 8080);
        var request = http.get(url);
        request.on("response", function (res) {
            res.setEncoding("utf8");
            var resData = "";
            res.on("data", function (ch) {
                resData += ch;
            });
            res.on("end", function () {
                server.stop(function () {
                    callback(res, resData);
                });
            });
        });
    }
    function cleanUpFile(file){
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            assert.ok(!fs.existsSync(file), "could not deleted test file [" + file + "]");
        }
    }
}());
