# parserHTML
JS library to convert HTML Code to JS Object


## Installation
Installation from npm
```js
npm i parser-html
```

OR use JS File in dist/parser-html.js
```html
<script src="js/dist/parser-html.js"></script>
```

## parse
Parse the HTML Code to JS Object 
```js
var template = `
    <div class='shadow background box20 white-color relative'>
        <div class='container'>
            <h1>Title of Page</h1>
        </div>
    </div>
`; 
var parser = new ParserHTML();
parser.parse(template, function(data) {
  console.log(data);
  // return the Tree Object
});
```
