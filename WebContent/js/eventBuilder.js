var eventBuilder = angular.module('eventBuilder', []);
eventBuilder.directive('eventBuilder', ['$compile', '$filter', function ($compile, $filter) {
    return {
        restrict: 'E',
        scope: {
            group: '=',
            comparisonOp: '=',
            connectiveOp: '=',
            fields: '=',
            daFieldValues: '='
        },
        templateUrl: 'template/eventBuilderDirective.html',
        compile: function (element, attrs) {
            var content, directive;
            content = element.contents().remove();
            
            return function (scope, element, attrs) {
                scope.addCondition = function () {
                	var filtered = $filter('filter')(scope.daFieldValues, {field : scope.fields[0].symbolName}, true);
                	var thisFieldValues = filtered[0].values;
                    scope.group.rules.push({
                        condition: scope.comparisonOp[0],
                        field: scope.fields[0].symbolName,
                        data: thisFieldValues[0],
                        thisFieldValues: thisFieldValues
                    });
                };
                

               scope.changeType = function (rule) {
            	   var filtered = $filter('filter')(scope.daFieldValues, {field : rule.field}, true);
               	   rule.thisFieldValues = filtered[0].values;
               	   rule.data = rule.thisFieldValues[0];
               };

                scope.removeCondition = function (index) {
                    scope.group.rules.splice(index, 1);
                };

                scope.addGroup = function () {
                    scope.group.rules.push({
                        group: {
                            operator: scope.connectiveOp[0],
                            rules: []
                        }
                    });
                };

                scope.removeGroup = function () {
                    "group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
                };
                                
                directive || (directive = $compile(content));

                element.append(directive(scope, function ($compile) {
                    return $compile;
                }));
            }
        }
    }
}]);

eventBuilder.factory('eventProcessor', ['$http', function ($http) {
	return {
		formatEventAdv : function (newValue) {
			console.log("In formatEventAdv..")
			newValue = newValue.replace(/</g, '&lt;');
		  	  newValue = newValue.replace(/>/g, '&gt;'); 		  	 
			  var stack = [];
			  var formatted=''; var count = 0;
		  	  while(count < newValue.length) {
		  		  var ch = newValue.charAt(count);
		  		  if(ch === '(') {
		  			  depth = stack.length;
		  			  stack.push(ch);
		  			  if(formatted.trim().length > 4 && formatted.trim().substr(formatted.trim().length-4) != '<br>') {
		  				  formatted+='<br>';
		  				  //console.log(formatted);
		  			  }
		  			  for(var i =1; i<=depth; i++) {
		  				  formatted+='&nbsp;&nbsp;&nbsp;&nbsp;'
		  			  }
		  			  formatted+= ch;
		  			  if(formatted.trim().substr(formatted.trim().length,4) != '<br>')
		  				  formatted+='<br>';
		  		  }
		  		  else if(ch === ')') {
		  			  stack.pop();
		  			  depth = stack.length;
		  			  if(formatted.trim().substr(formatted.trim().length-4) != '<br>')
		  				  formatted+='<br>';
		  			  for(var i =1; i<=depth; i++) {
		  				  formatted+='&nbsp;&nbsp;&nbsp;&nbsp;'
		  			  }
		  			  formatted+= ch;
		  			  if(formatted.trim().substr(formatted.trim().length,4) != '<br>')
		  				  formatted+='<br>';
		  		  }
		  		  else {
		  			  if(formatted.trim().length > 4 && formatted.trim().substr(formatted.trim().length-4) == '<br>') {
	  		  			 depth = stack.length;
	  		  			 //console.log(depth);
	 		  			 for(var i =1; i<=depth; i++) {
			  				  formatted+='&nbsp;&nbsp;&nbsp;&nbsp;'
			  			 }
		  			  }
		  			 formatted+= ch;
		  		  }
		  			
		  		  count++;
		  	  }
		  	formatted = formatted.replace(/\s+and\s+/g,'<strong> and </strong>');
		  	formatted = formatted.replace(/\s+or\s+/g,'<strong> or </strong>');
		  	
		  	return formatted;
		}
	}
}
]);

function htmlEntities(str) {
    return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function computedEvent(group, first) {
	console.log("In computed");
	console.log(group);
	console.log(first);
    if (!group) return "";
    for (var str = first ? "" : "(" , i = 0; i < group.rules.length; i++) {
        i > 0 && (str += " <strong>" + group.operator + "</strong> ");
        str += group.rules[i].group ?
            computedEvent(group.rules[i].group, false) :
            computeConditionEvent(group.rules[i])
    }
    
    return first ? str : str + ")";
}


function computeConditionEvent(rule) {
	//console.log(rule.field);
	str = rule.field + " " + htmlEntities(rule.condition) + " " ;

	if(rule.data.charAt(0) != "\"")
		str += "\"" + rule.data + "\""
	else {
		rule.data = rule.data.substring(1, rule.data.length-1)
		str += rule.data
	}
    
	return str;
}

function processGroupEvent(str, currentgroup, connectiveOp, daFieldsList, daFieldValues) {
	console.log(connectiveOp);
	currentgroup.rules=[];
	if(!str)
		return;
	console.log('Process Group ' + str);
	console.log(JSON.stringify(currentgroup, null, 2));
	//alert(JSON.stringify(currentgroup));
	var prevGrpEnd = -1;
	var depth = 0; var atLeastOneGrp = false;

	var i =0;
	while(i < str.length) {
		if(str[i]=='(') {
			depth++;
			//console.log('(' + 'found in' + str)
			atLeastOneGrp = true;
			if( (i - (prevGrpEnd+1)) > 0) {
				currentgroup.rules = currentgroup.rules.concat(processConditionEvent(str.substring(prevGrpEnd+1, i), currentgroup, connectiveOp, daFieldsList, daFieldValues));
			}

			var j = i +1;
			while(j < str.length) {
				if(str[j]=='(')
					depth++;
				else if(str[j]==')')
					depth--;
				if(depth == 0) {
					break;
				}
				j++;	
			}

			grpEnd = j;
			data = '{"group": {"operator": "and","rules": []}}'
			currentgroup.rules.push(JSON.parse(data));

			console.log(JSON.stringify(currentgroup, null, 2));
			processGroupEvent(str.substring(i+1, j), currentgroup.rules[currentgroup.rules.length - 1].group, connectiveOp, daFieldsList, daFieldValues);
			prevGrpEnd = j;
			i = j+1;
		} else {
			i++;
		}
	}
	if(!atLeastOneGrp) {
		currentgroup.rules = currentgroup.rules.concat(processConditionEvent(str, currentgroup, connectiveOp, daFieldsList, daFieldValues));
	} else if((str.length-1 > prevGrpEnd) &&  (prevGrpEnd > -1)) {
		currentgroup.rules = currentgroup.rules.concat(processConditionEvent(str.substring(prevGrpEnd+1), currentgroup, connectiveOp, daFieldsList, daFieldValues));
	}
	
}

function processConditionEvent(str, currentgroup, connectiveOp, daFieldsList, daFieldValues) {
	if(!str)
		return;
	console.log('Process Condition ' + str)
	console.log('Process Condition daFieldValues' + daFieldValues)
	console.log(daFieldValues);
	var rulesCond = [];
	//var op = str.includes(' or ') ? 'or ' : ' and ';
	
	var tokensSpace = str.match(/(\S+)/g);
	var found = false; var op='';
	for(var i = 0; i < tokensSpace.length; i++) {
		for(var j = 0; j< connectiveOp.length; j++) {
			if(tokensSpace[i] == connectiveOp[j]) {
				op = connectiveOp[j];
				found = true;
				break;
			}
		}
		if(found)
			break;
	}
	if(found) {
		console.log('operator ' + op);
		currentgroup.operator = op;
	}
	var tokens = str.split(currentgroup.operator);
	for(var i = 0; i < tokens.length; i++) {
		//console.log(tokens[i]);
		parts = tokens[i].match(/(\S+)/g);
		//(console.log("parts" + parts));
		if(!parts)
			continue;
		var rule={};
		for(var j=0; j <daFieldsList.length; j++) {
			if(daFieldsList[j].symbolName == parts[0]) {
				rule.field = daFieldsList[j].symbolName;
				rule.condition = parts[1];
				rule.data = parts[2];
				//var filtered = $filter('filter')(scope.daFieldValues, {field : daFieldsList[j].symbolName}, true);
				console.log("daFieldValues.length " + daFieldValues.length);
				for(var k = 0; k < daFieldValues.length; k++) {
					console.log("daFieldValues[k] " + daFieldValues[k]);
					console.log(daFieldValues[k]);
					console.log(rule.field);
					if(daFieldValues[k].field == rule.field) {
						rule.thisFieldValues = daFieldValues[k].values;
						break;
					}
				}
				
			}
		}
		rulesCond.push(rule);
	}
	console.log(rulesCond);
	return rulesCond;
}

function processGroupEvent1(str, currentgroup, connectiveOp, daFieldsList, daFieldValues) {
	if(!str || !currentgroup)
		return
	str = str.trim();
	currentgroup.rules=[];
	//match the opening and closing parenthesis
	var open = 0; var close = 0; var d0Open = -1, d0Close = -1, depth = 0;
	for(var i = 0; i< str.length; i++) {
		if(str[i]=='(') {
			open++;
			if(depth == 0) 
				d0Open = i;
			depth++;
		}
		else if(str[i]==')') {
			close++;
			if(depth == 0) 
				d0Close = i;
			depth++;			
		}
	}
	if(open != close)
		throw "Open parenthesis count != close parenthesis count";
	if(d0Open == 0 && d0Close == str.length-1) {
		//Remove depth 0 parenthesis if they encapsulate entire str
		str = str.substring(d0Open+1, d0Close)
	}
	console.log('Process Group ' + str);
	var depth1Opr = []
	var depth = 0; 
	var i =0;
	while(i < str.length) {
		if(str[i]=='(') {
			depth++;			
		} else if(str[i]==')'){
			depth--;
		} else if(i+2 < str.length && str[i]=='a' && str[i+1]=='n' && str[i+2]=='d' && str[i-1]==' ' && depth==0) {
			depth1Opr.push({op:'and', idx:i});			
		} else if(i+1 < str.length && str[i]=='o' && str[i+1]=='r' && str[i-1]==' ' && depth==0) {
			depth1Opr.push({op:'or', idx:i});
		}
		i++;
	}
	
	if (depth1Opr.length==0) {
		//default and operator
		console.log("No depth1 op found in str" + str);
		depth1Opr.push({op:'and', idx:str.length});
	}
	var d1Op = depth1Opr[0].op;
	for(var i=1 ; i < depth1Opr.length;i++) {
		if(d1Op != depth1Opr[i].op)
			throw "Depth1 operators are different";
	}
	console.log(depth1Opr);
	currentgroup.operator = d1Op;
	var start = 0;
	for(var i=0 ; i <= depth1Opr.length;i++) {
		//one extra iteration than depth1Opr size to accommodate the substr after last and/or till end ot str
		if(i < depth1Opr.length) {
			end = depth1Opr[i].idx
		} else {
			end = str.length
		}
		
		var subStr = str.substring(start, end).trim();
		console.log(subStr);
		if(subStr) {
			var rule={};
			currentgroup.rules.push(rule);
			if(subStr.charAt(0)=='(' && subStr.charAt(subStr.length-1) == ')') {				
				rule.group={};
				processGroupEvent1(subStr.substring(1,subStr.length-1), rule.group, connectiveOp, daFieldsList, daFieldValues)
			} else {
				processConditionEvent1(subStr, rule, connectiveOp, entityAttrs, daFieldsList, daFieldValues);
			}
			if(i < depth1Opr.length) {
				//reset start index for next iteration
				start = depth1Opr[i].idx + depth1Opr[i].op.length + 1;
			}
		}
	}
}

function processConditionEvent1(subStr, rule, connectiveOp, daFieldsList, daFieldValues){
	if(!subStr)
		return;
	var parts = subStr.match(/(\w+)\s*(>|>=|<=|<|=|!=)\s*"?(\w+)"?/);
	(console.log("parts " + parts));
	if(!parts)
		return;
	for(var j=0; j <daFieldsList.length; j++) {
		if(daFieldsList[j].symbolName == parts[1]) {
			rule.field = daFieldsList[j].symbolName;
			rule.condition = parts[2];
			rule.data = parts[3];
			//var filtered = $filter('filter')(scope.daFieldValues, {field : daFieldsList[j].symbolName}, true);
			console.log("daFieldValues.length " + daFieldValues.length);
			for(var k = 0; k < daFieldValues.length; k++) {
				console.log("daFieldValues[k] " + daFieldValues[k]);
				console.log(daFieldValues[k]);
				console.log(rule.field);
				if(daFieldValues[k].field == rule.field) {
					rule.thisFieldValues = daFieldValues[k].values;
					break;
				}
			}
			
		}
	}
}