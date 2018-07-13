# parserHTML
JS library to convert HTML Code to JS Object


## Installation
Installation from npm
```js
npm i parser-html
```

For Browser Use
```html
<script src="js/dist/parser-html.js"></script>
```

## Init Parser Object
for Node JS
```js
var parserHtml = require("parser-html");
```
for Browser
```js
var parserHtml = parserHTML;
```

```js
var template = `
    <div class='shadow background box20 white-color relative'>
        <div class='container'>
            <h1>Title of Page</h1>
        </div>
    </div>
`; 

parserHtml.parse(template, function(data) {
  console.log(data);
  // return the Tree Object
});
```
