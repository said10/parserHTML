/**
* $ParserHTML library (v0.0.1) copyright 2018 Said Bensamdi
* Licensed under the MIT License.
* 
*
* Copyright 2018 Said Bensamdi
* Licensed under the MIT License
* https://github.com/said10
*/ 
/**
* JS library to convert HTML Code to JS Object
*/ 

class ParserHTML {
	constructor(params) {
		if (typeof params === "undefined") {
			params = {nom : "", template : "", data : null};
		}
		this.nom = params.nom || "";
		this.template = params.template || "";
		this.attrRE = /([\w-]+)|['"]{1}([^'"]*)['"]{1}/g;
		this.tagRE = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>|{%(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+?%}/g; 
        ///<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>|{%(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+%}/g
		this.lookup = {area : true,base : true, br : true, col : true, embed : true, hr : true, img : true, input : true, keygen : true, link : true, menuitem : true, meta : true, param : true, source : true, track : true, wbr : true};
	    this.counter_tags_type = { tags : 0, closed : 0 };
		this.data = params.data || {};
		this.tree = [];
		this.index = 0;
        this.index_tree = 0;
        this.total_tags = 0;
        this.tags_closed = 0;
	}
    /**
	 * Reset The Global Variables of the Parser
	 * @reset
	 * @param {}
	 */
    reset() {
        this.nom = "";
		this.template =  "";
        this.lookup = {area : true,base : true, br : true, col : true, embed : true, hr : true, img : true, input : true, keygen : true, link : true, menuitem : true, meta : true, param : true, source : true, track : true, wbr : true};
        this.counter_tags_type = { tags : 0, closed : 0 };
        this.tree = [];
		this.index = 0;
        this.index_tree = 0;
        this.total_tags = 0;
        this.tags_closed = 0;
    }
    
    /**
	 * parseTag for Compile String Tag HTML to JS Object
	 * @parseTag
	 * @param {tag} String - The Tag for test and compile
	 */
	parseTag(tag){
        if (typeof tag === "string" || tag instanceof String  && typeof tag !== "boolean") {
            var test_tag = tag.match(this.tagRE);
            if (test_tag !== null) {
                var i = 0,key,state_tag = tag.indexOf("</"),self_tag = tag.indexOf("/>"),self_closed = false,state = true,type = "tag", self = this, render = true;
                if( tag.indexOf("{{") !== -1 ) {
                    //type = "variable";
                }
                if( tag.indexOf("{%") !== -1 ) {
                    var regx_operation = /if|for|endif|endfor|else/g;
                    var match = tag.split(" ")[1].match(regx_operation);
                    if (match === null) {
                        type = "component";
                        self_closed = true;
                        render = false;
                    }
                    else {
                        type = "operation";
                        render = false;
                    }
                }

                this.counter_tags_type.tags +=1;
                if( state_tag !== -1 || tag.indexOf("%end") !== -1 || tag.indexOf("% end") !== -1 ) {
                    state = false;
                    this.counter_tags_type.tags -=1;
                }

                if( self_tag !== -1 ) {

                    this.counter_tags_type.closed +=1;
                    this.counter_tags_type.tags -=1;
                    self_closed = true;
                    this.tags_closed +=1;
                }
                var res = {type: type,name: '',tag : tag,parent : false,open : state,parent_name : "",closed : self_closed,data : "",attrs: {}, render : render, runing: true, children: []};
                tag.replace(self.attrRE, function (match) {
                    if (i % 2) {
                        key = match;
                    } else {
                        if (i === 0) {
                            if (self.lookup[match] || tag.charAt(tag.length - 2) === '/') {
                                res.voidElement = true;
                            }
                            if( type === "operation" && !state ) {
                                 res.name = match.substring(3,match.length);
                            }
                            else {
                                 res.name = match;
                            }

                        } else {
                            if (key === "root") {
                                //self.counter_tags_type.tags -=1;
                            }
                            res.attrs[key] = match.replace(/['"]/g, '');
                        }
                    }
                    i++;
                });
                return res;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
	}
    
    /**
	 * Main function to parse HTML Code
	 * @parse
	 * @param {template} String - The Template to convert
	 * @param {callback} Function - The Callback runing when the compilation is finished
	 */
	parse(template, callback) {
		if (typeof template === "string" || template instanceof String  && typeof template !== "boolean") {
            this.reset();
            template = "<div root='root'>"+template+"</div>";
            var result = [],arr = [], self = this;
            template = self.cleanTemplateOperators(template);
            template.replace(self.tagRE, function (tag, index) {
                var current = self.parseTag(tag);
                if (current !== null) {
                    var index_start_text = parseInt(index)+parseInt(current.tag.length);
                    var index_end_text = template.substring(index_start_text, template.length);

                    var text = index_end_text.substring(0, index_end_text.indexOf("<"));
                    var regx_variable = /if\s|for\s|{%\s/g;
                    if(text.match(regx_variable) !== null) {
                        text = "";
                    }
                    current.data = text;
                    arr.push(current);
                }
            });
            
            if ((self.counter_tags_type.tags * 2) + self.counter_tags_type.closed !== arr.length) {
                if (typeof callback !== "undefined") {
                    callback.call(this, { "type" : "error", "message" : "Error in closed, Please Verify your HTML code and Close the tag opened" });
                }
                //throw new Error("Error in closed, Please Verify your HTML code and Close the tag opened" );
            }
            else {
                if (arr.length <= 2) {
                    arr = self.createTextNode(arr);
                }
                this.total_tags = arr.length;
                result = self.createTree(arr, arr[0]).children;
                if (typeof callback !== "undefined") {
                    callback.call(this, result, arr);
                }
                return result;
		  }
        }
        else {
            if (typeof callback !== "undefined") {
                callback.call(this, { "type" : "error", "message" : "Error of type in template, Please verify your HTML code" });
                //throw new Error("Error of type in template, Please verify your HTML code" );
            }
        }
	}
    
    /**
	 * Return the SPAN Element if Template is not HTML code but String
	 * @createTextNode
	 * @param {arr} Array - Array of JS Object returned by the Parser
	 */
    createTextNode(arr) {
        if (Array.isArray(arr)) {
            var self = this;
            var close_root = arr[1];
            var text_node = "<span></span>";
            text_node.replace(self.tagRE, function (tag) {
                var current = self.parseTag(tag);
                if (current.open) {
                    current.data = arr[0].data;
                }
                arr.push(current);
            });
            arr.splice(1,1);
            arr.push(close_root);
            return arr;
        }
        else {
            return arr;
        }
        
    }
    
    /**
	 * Return the new Template after processing key words
	 * @cleanTemplateOperators
	 * @param {template} String - Template of HTML Code
	 */
    
	cleanTemplateOperators(template) {
		var regex_operations = /{([^}]+)?}?}/g;
		template = template.replace(regex_operations, function(operation) {
			var debut_tag = operation.substring(2, 7);
			if (debut_tag.indexOf("if") > -1) {
				var reg_calcul = /(>=|<=|=|>|<|!=)/g;
				var match_calcul= operation.match(reg_calcul);
				if(match_calcul !== null) {
					for (var m = 0; m < match_calcul.length; m++) {
						var operator = match_calcul[m];
						var operator_string = "";
						switch(operator) {
							case "=":
								operator_string = "eq";
							break;
							case ">" :
								operator_string = "gt";
							break;
							case "<" :
								operator_string = "lt";
							break;
							case ">=":
								operator_string = "gte";
							break;
							case "<=":
								operator_string = "lte";
							break;
							case "!=":
								operator_string = "neq";
							break;
						}
						operation = operation.replace(operator, operator_string);
					}
				}
			}
			return operation;
		});
		return template;
	}
    
    
    /**
	 * Return the Tree Object after the compilation is finished 
	 * @createTree
	 * @param {array} Array - Array of the tags
	 * @param {parent} Object - The initial Parent of the current tag
	 */
	createTree(array, parent) {
		var length = array.length;
		for (var index =0; index < length; index++) {
			var node = array[index];
			var next = array[index+1] || {  open : false, name : '' };
			//var prev = array[index-1] || {  open : false, name : '' };
			if (!node.open) {
				parent = this.getParent(array,index, node);
			}
			if (node.open && next.open && !node.closed ) {
				//console.log(node);
				node.children.push(next);
				next.parent_name = node;
				if (index > 0 && node.parent_name === "" ) {
					parent.children.push(node);
					node.parent_name = parent;
				}
				parent = node;
				array[index+1] = next;
			}
			if (node.closed ) {
				if (index > 0 && node.parent_name === "" ) {
					parent.children.push(node);
					node.parent_name = parent;
				}
			}
			if (node.open && !next.open && node.name === next.name && typeof node.parent_name.tag === "undefined") {
				parent.children.push(node);
				node.parent_name = parent;
			}
			array[index] = node;
		}
		this.tree = array[0];
		return array[0];
	}
    
    /**
	 * Return the parent of current Tag
	 * @getParent
	 * @param {array} Array - Array of the tags
	 * @param {index} Number - Index of the the children
	 * @param {tag} Object - The current Tag
	 */
	getParent(array, index, tag) {
		var counter = 0;
		for (var j = index; j > 0; j--) {
			var node = array[j];
			if (node.name === tag.name && !node.open) {
				counter++;
			}
			if (node.name === tag.name && counter > 0 && node.open) {
				counter--;
			}
			if (node.name === tag.name && node.open && counter === 0 ) {
				j = 0;
				return node.parent_name;
			}
		}
	}

	
}


const parserHTML = new ParserHTML(); 
module.exports = parserHTML;