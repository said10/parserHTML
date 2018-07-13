const parserHTML = require('../index');
import chai, { expect } from 'chai';


describe('Test Function Parse Tag' , () => {
    const parser = parserHTML;
    
    it('Tag is a String', () => {
        let template = "hello world";
        let result_tag = parser.parseTag(template);
        expect(result_tag).to.be.equal(null);
   });
    
  it('Tag is a Number', () => {
        let template = 1;
        parser.reset();
        let result_tag = parser.parseTag(template);
        expect(result_tag).to.be.equal(null);
   });
   it('Tag is a Array', () => {
        let template = ["1", "2"];
        parser.reset();
        let result_tag = parser.parseTag(template);
        expect(result_tag).to.be.equal(null);
   });
    
   it('Tag is a Object', () => {
        let template = {name : "name"};
        parser.reset();
        let result_tag = parser.parseTag(template);
        expect(result_tag).to.be.equal(null);
   });
    
  it('Tag is a HTML Tag', () => {
        let template = "<h1>Hello world</h1>";
        parser.reset();
        let result_tag = parser.parseTag(template);
        expect(result_tag.name).to.be.equal("h1");
   });

});


describe('Test Function createTextNode' , () => {
    const parser = parserHTML;
    
    it('create text node with nor array element', () => {
        let template = "hello world";
        let result_tag = parser.createTextNode(template);
        expect(result_tag).to.be.equal(template);
   });
    
  

});

describe('parse Error for no HTML template' , () => {
  
    const parser = parserHTML;

  it('entry is number', () => {
    let template = 1; 
    parserHTML.parse(template, function(data) {
        expect(data.message).to.be.equal("Error of type in template, Please verify your HTML code");
    });
  });

  it('entry is array', () => {
    let template = ["01", "02", "01"]; 
    parserHTML.parse(template, function(data) {
        expect(data.message).to.be.equal("Error of type in template, Please verify your HTML code");
    });
  });
    
  it('entry is object', () => {
    let template = { "name" : "name" }; 
    parserHTML.parse(template, function(data) {
        expect(data.message).to.be.equal("Error of type in template, Please verify your HTML code");
    });
  });
});

describe('parse HTML template with no html tags' , () => {
  
    const parser = parserHTML;
    const template = "hello world"; 

  it('the result is object array', () => {
    parserHTML.parse(template, function(data) {
        expect(Array.isArray(data) ).to.be.equal(true);
    });
  });

  it('verify if children exist', () => {
    parserHTML.parse(template, function(data) {
        expect(data.length ).to.be.equal(1);
    });
  });
    
  it('verify if Span tag is created ?', () => {
    parserHTML.parse(template, function(data) {
        expect(data[0].name).to.be.equal("span");
    });
  });
});