/* globals directory:false, desc:false, task:false, fail:false, complete:false, jake:false  */

(function () {
    "use strict";
    var jshint = require('simplebuild-jshint');
    var TEMP_TESTFILE_DIR = "generated/test";
    directory(TEMP_TESTFILE_DIR);

    task("default", ["lint", "test"], function () {
        console.log("jake Hello");
    });
    desc("Clean generated dir");
    task("clean", [], function () {
        jake.rmRf("generated");
    });
    desc("Build and test");
    task("test", [TEMP_TESTFILE_DIR], function () {
        var reporter = require("nodeunit").reporters.default;
        reporter.run(["src/server/_server_test.js"], null, function (failures) {
            if (failures) fail("Tests fails");
            complete();
        });
    }, {async: true});
    desc("Integration");
    task("integrate", ["default"], function () {
        console.log("Integrate");
    });
    desc("Linting");
    task("lint", function () {
        process.stdout.write("Javascript linting ");
        jshint.checkFiles({
            files: ["jakefile.js"],
            options: lintOpt(),
            globals: lintGlobals()
        }, complete, fail);
    }, {async: true});

    //desc("Ensure node version is provided");
    //Currently not printing stdout nothing happens so the node task will be remove as dependancy
    task("node", function () {
        var nodeVersion = "v4.1.2\n";
        var cmds = 'node --version';
        console.log("> " + cmds);
        var stdout = "";
        var process = jake.createExec(cmds, {printStdout: true, printStderr: true, stdout: true });
        process.addListener("stdout", function (msg,chunk) {
            stdout += chunk;
        });
        process.addListener("cmdStart", function () {
            //if (stdout != nodeVersion) fail("Incorrect Node version, expected " + nodeVersion);


        });
        process.addListener("cmdEnd", function () {
            //if (stdout != nodeVersion) fail("Incorrect Node version, expected " + nodeVersion);
            console.log("Stdout: " + stdout);
            complete();
        });
        process.run();

    }, {async: true});
    // Linting Options Functions

    function lintOpt() {
        return {
            bitwise: true,
            eqeqeq: true,
            forin: true,
            freeze: true,
            futurehostile: true,
            latedef: "nofunc",
            noarg: true,
            nocomma: true,
            nonbsp: true,
            nonew: true,
            strict: true,
            undef: true,
            node: true,
            browser: true
        };
    }

    function lintGlobals() {
        return {
            //Mocha
            describe: false,
            it: false,
            before: false,
            after: false,
            beforeEach: false,
            afterEach: false
        };
    }
}());
