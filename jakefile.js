/* globals directory:false, desc:false, task:false, fail:false, complete:false, jake:false  */

(function(){
   "use strict";
   var jshint = require('simplebuild-jshint');

   task("default",["lint"],function(){
      console.log("jake Hello");
   });
   desc("Integration");
   task("integrate",["default"], function(){
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
