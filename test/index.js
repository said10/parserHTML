const test = require("tap").test;
const parserHTML = require('../index');


test('Template HTML test', function(t) {
   const template = 'hello world';
   parserHTML.parse(template, function() {
       
   });
   t.is(typeof template, "string");
   t.ok(template, "string");
    
    t.end();
});