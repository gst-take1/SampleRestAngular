var allValueTypes = [{name:'Hard coded value', value:'hardcoded'},
                                 {name:'Placeholder substituted at run time', value:'arg'}]
var onlyPlaceholder = [{name:'Placeholder substituted at run time', value:'arg'}]
            
var expressionBuilder = angular.module('expressionBuilder', []);
expressionBuilder.directive('expressionBuilder', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            group: '=',
            comparisonOp: '=',
            connectiveOp: '=',
            fields: '=',
            onChangeValueType: '&'
        },
        templateUrl: 'template/expressionBuilderDirective.html',
        compile: function (element, attrs) {
            var content, directive;
            content = element.contents().remove();
            
            return function (scope, element, attrs) {
                scope.addCondition = function () {
                	//console.log(scope.comparisonOp[0]);
                	var valueTypeOptions = scope.fields[0].attrType != 'date' && scope.fields[0].attrType != 'timestamp' ? allValueTypes : onlyPlaceholder;
                    scope.group.rules.push({
                        condition: scope.comparisonOp[0],
                        field: scope.fields[0],
                        data: '',
                        valueType: valueTypeOptions[0].value,
                        valueTypeOptions: valueTypeOptions
                    });
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
                
                scope.changeValueType = function () {
                	console.log("In Change Value Type");
                	//scope.onChangeValueType()
                }
                
                scope.setValueTypeOptions = function (rule) {
                	console.log("In setValueTypeOptions");
                	console.log(rule);
                	var valueTypeOptions = rule.field.attrType != 'date' && rule.field.attrType != 'timestamp' ? allValueTypes : onlyPlaceholder;
                	rule.valueTypeOptions = valueTypeOptions;
                	rule.valueType = valueTypeOptions[0].value;
                	//scope.changeValueType(rule);
                }
                
                directive || (directive = $compile(content));

                element.append(directive(scope, function ($compile) {
                    return $compile;
                }));
            }
        }
    }
}]);

expressionBuilder.factory('selectorProcessor', ['$http', function ($http) {
	return {
		parseSelector: function ($scope) {
			console.log("In Parse Selector factory" + $scope.selector);
			$scope.params = [];
			var tokens = //$scope.selector.match(/(\S+)/g);
			$scope.selector.
			//match(/(\w)+/g);
			match(/([^\(\)!=<>\s]+)/g);
			//var spaceSplt = $scope.selector.match(/(\S+)/g);
			//var equal = $scope.selector.match(/([^\(\)=\s]+)/g);
			
			console.log(tokens);
			var prevAttr;
			for(var i = 0; i<tokens.length; i++) {
				//var parts = tokens[i].match(/(\w)+(>|>=|<=|<|=)(\w)/);
				//(/(\w)+/g);
				//console.log(parts);
				//check it is not in "" and not a number
				//console.log(tokens[i]);
				if(tokens[i].substring(0,1) !='"' && isNaN(tokens[i])) {
					//check if it is a keyword
					var isKeyWord = false;
					var isAttr = false;
					var isFunc = false;
					for(var j = 0; j < $scope.connectiveOp.length; j++) {
						//console.log("connectiveOp check");
						//console.log(tokens[i]+" "+$scope.connectiveOp[j])
						if(tokens[i] === $scope.connectiveOp[j]) {
							//console.log("connectiveOp true");
							console.log(tokens[i]+" "+$scope.connectiveOp[j])
							isKeyWord = true;
							continue;
						}
					}
					for(var j = 0; j < $scope.comparisonOp.length; j++) {
						if(tokens[i] === $scope.comparisonOp[j]) {
							isKeyWord = true;
							continue;
						}
					}
					if (isKeyWord)
						continue;
					//check if it is an Attr
					for(var j = 0; j < $scope.entityAttrs.length; j++) {
						if(tokens[i] === $scope.entityAttrs[j].attrName) {
							prevAttr = $scope.entityAttrs[j];
							isAttr = true;
						}
					}
					if(isAttr)
						continue;
					//check if it is a function
					for(var j = 0; j < $scope.func.length; j++) {
						if($scope.func[j].includes(tokens[i])) {
							isFunc = true;
						}
					}
					if(isFunc)
						continue;
					//lastly - it's a param
					$scope.params.push({dataType:prevAttr.attrType, paramName:tokens[i], argValue:''});
					
				}
			}
	             
		},
		formatSelectorAdv : function (newValue) {
			console.log("In formatSelectorAdv..")
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
		},
		populateQueryTemplateDetails : function ($scope, queryTemplate) {
			$scope.editQT = queryTemplate;
			$scope.origTemplateName = $scope.editQT.templateName;
			$scope.origOwner = $scope.editQT.owner;
			//init with the obj being editedscope vars
			$scope.entity = $scope.editQT.entity;
			$http({
				  method: 'GET',
				  //url: 'qb/builder/getEntityAttrs?/*env=' + $scope.env + '&entity=' +$scope.entity
				  url: 'qb/builder/getEntityAttrs?entity=' +$scope.entity
			}).then(function successCallback(response) {
				//console.log(response.data);
				$scope.entityAttrs = response.data;
				for(var i = 0; i<$scope.entityAttrs.length; i++) {
					if(i == 0)
						$scope.sortAttrName = $scope.entityAttrs[i].attrName
					$scope.selectorAutoSuggest.push($scope.entityAttrs[i].attrName + '[' + $scope.entityAttrs[i].attrType + ']');
					//console.log($scope.entityAttrs[i].attrName);
				}
				
				$scope.selector = $scope.editQT.selector.trim();
				//$scope.parseSelector();
				$scope.selectorToFilter();
				/*for(var i = 0; i< $scope.params.length; i++) {
					for(var j = 0; j<$scope.editQT.paramsList.length; j++) {
						if($scope.params[i].paramName == $scope.editQT.paramsList[j].paramName){
							$scope.params[i].argValue = $scope.editQT.paramsList[j].argValue;
							break;
						}
					}
				}*/
				
				if($scope.editQT.exclList.length > 0 ) 
					$scope.excl = $scope.editQT.exclList;
				else {
					for(var i=0; i<$scope.entityAttrs.length; i++) {
						var found = false;
						for(var j=0; j<$scope.editQT.inclList.length; j++) {					
							if($scope.editQT.inclList[j] == $scope.entityAttrs[i].attrName) {
								found = true;
								break;
							}
						}
						if(!found && $scope.editQT.inclList.length > 0)
							$scope.excl.push($scope.entityAttrs[i].attrName);
					}
				}
				if($scope.editQT.inclList.length > 0 ) 
					$scope.incl = $scope.editQT.inclList;
				else {
					for(var i=0; i<$scope.entityAttrs.length; i++) {
						var found = false;
						for(var j=0; j<$scope.editQT.inclList.length; j++) {					
							if($scope.editQT.inclList[j] == $scope.entityAttrs[i].attrName) {
								found = true;
								break;
							}
						}
						if(!found)
							$scope.incl.push($scope.entityAttrs[i].attrName);
					}
				}
				
			  }, function errorCallback(response) {
				  $scope.step2Error=getErrorMsgResponse(response);
			  }); 
			
			$scope.contentType = $scope.editQT.resultFormat;
			$scope.params = $scope.editQT.paramsList;
			$scope.origParams = $scope.editQT.paramsList;
			$scope.sortBy = $scope.editQT.sortByList;
			$scope.templateName = $scope.editQT.templateName;
			$scope.owner = $scope.editQT.owner;
			$scope.reply = $scope.editQT.reply;
		},		
		selectorToFilter : function ($scope) {
			try{
				if(!$scope.selector)
					$scope.selector = '';
				var origSelector = $scope.selector;
				var selectorCp = $scope.selector;
				
				processGroup1(selectorCp, $scope.filter.group, $scope.connectiveOp, $scope.entityAttrs, $scope.params);
		    	//console.log($scope.filter);
		    	//console.log($scope.selector);
		    	//console.log(origSelector);
		    	if($scope.selector != origSelector) {
		    		console.log('Selector after processGroup1 does not match with origSelector');
		    		console.log($scope.selector);
		    		console.log(origSelector);
		    	}
			} catch (ex) {
				$scope.selector = origSelector;
				$scope.display = 'advanced';
				$scope.basicDisabled = true;
				console.log('Caught exception in selectorToFilter');
				console.error(ex.stack?ex.stack:ex);
			}
			
			if(!$scope.display)
				$scope.display = 'basic';
		}
		
	}
}
]);

function isEdit() {
	return typeof mode != 'undefined'
}

function htmlEntities(str) {
    return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function computed(group, first) {
	console.log("In computed");
	console.log(group);
	console.log(first);
    if (!group) return "";
    for (var str = first ? "" : "(" , i = 0; i < group.rules.length; i++) {
        i > 0 && (str += " <strong>" + group.operator + "</strong> ");
        str += group.rules[i].group ?
            computed(group.rules[i].group, false) :
            computeCondition(group.rules[i])
    }
    
    return first ? str : str + ")";
}

function computeCondition(rule) {
	console.log(rule);
	str = rule.field.attrName + " " + htmlEntities(rule.condition) + " " 
    if(rule.field.attrType == 'string' && rule.valueType =='hardcoded' && rule.data != "null") {
    	if(rule.data.charAt(0) != "\"")
    		str += "\"" + rule.data + "\""
    	else
    		rule.data = rule.data.substring(1, rule.data.length-1)
    } else {
    	str += rule.data
    }
	return str;
}

function processGroup(str, currentgroup, connectiveOp, entityAttrs, params) {
	currentgroup.rules=[];
	if(!str)
		return
	//match the opening and closing parenthesis
	var open = 0; var close = 0;
	for(var i = 0; i< str.length; i++) {
		if(str[i]=='(')
			open++
		else if(str[i]==')')
			close++
	}
	if(open != close)
		throw "Open parenthesis count != close parenthesis count";
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
				currentgroup.rules = currentgroup.rules.concat(processCondition(str.substring(prevGrpEnd+1, i), currentgroup, connectiveOp, entityAttrs, params));
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
			processGroup(str.substring(i+1, j), currentgroup.rules[currentgroup.rules.length - 1].group, connectiveOp, entityAttrs, params);
			prevGrpEnd = j;
			i = j+1;
		} else {
			i++;
		}
	}
	if(!atLeastOneGrp) {
		currentgroup.rules = currentgroup.rules.concat(processCondition(str, currentgroup, connectiveOp, entityAttrs, params));
	} else if((str.length-1 > prevGrpEnd) &&  (prevGrpEnd > -1)) {
		currentgroup.rules = currentgroup.rules.concat(processCondition(str.substring(prevGrpEnd+1), currentgroup, connectiveOp, entityAttrs, params));
	}
	
}

function processCondition(str, currentgroup, connectiveOp, entityAttrs, params) {
	if(!str)
		return;
	console.log('Process Condition ' + str)
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
	
	//var tokens = str.split(currentgroup.operator);
	//var regex = /\b + currentgroup.operator + '/'
	var tokens = str.split(/\b/);
	console.log(tokens);
	
	for(var i = 0; i < tokens.length; i++) {
		console.log(tokens[i]);
		parts = tokens[i].match(/(\S+)/g);
		(console.log("parts" + parts));
		if(!parts)
			continue;
		var rule={};
		for(var j=0; j <entityAttrs.length; j++) {
			if(entityAttrs[j].attrName == parts[0]) {
				rule.field = entityAttrs[j];
				//check if param or hardcoded
				var isParam = false;
				for(var k = 0; k<params.length; k++) {
					if(params[k].paramName == parts[2]) {
						isParam = true;
					}
				}
				rule.valueType = isParam ? 'arg':'hardcoded';
				var valueTypeOptions = entityAttrs[j].attrName.attrType != 'date' && entityAttrs[j].attrName.attrType != 'timestamp' ? allValueTypes : onlyPlaceholder;
				rule.valueTypeOptions = valueTypeOptions;
				rule.condition = parts[1];
				rule.data = parts[2];
			}
		}
		rulesCond.push(rule);
	}
	console.log(rulesCond);
	return rulesCond;
}

function processGroup1(str, currentgroup, connectiveOp, entityAttrs, params) {
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
				processGroup1(subStr.substring(1,subStr.length-1), rule.group, connectiveOp, entityAttrs, params)
			} else {
				processCondition1(subStr, rule, connectiveOp, entityAttrs, params);
			}
			if(i < depth1Opr.length) {
				//reset start index for next iteration
				start = depth1Opr[i].idx + depth1Opr[i].op.length + 1;
			}
		}
	}
}

function processCondition1(subStr, rule, connectiveOp, entityAttrs, params){
	if(!subStr)
		return;
	var parts = subStr.match(/(\w+)\s*(>|>=|<=|<|=|!=)\s*"?(\w+)"?/);
	(console.log("parts " + parts));
	if(!parts)
		return;
	for(var j=0; j <entityAttrs.length; j++) {
		if(entityAttrs[j].attrName == parts[1]) {
			rule.field = entityAttrs[j];
			//check if param or hardcoded
			var isParam = false;
			for(var k = 0; k<params.length; k++) {
				if(params[k].paramName == parts[3]) {
					isParam = true;
				}
			}
			rule.valueType = isParam ? 'arg':'hardcoded';
			var valueTypeOptions = entityAttrs[j].attrName.attrType != 'date' && entityAttrs[j].attrName.attrType != 'timestamp' ? allValueTypes : onlyPlaceholder;
			rule.valueTypeOptions = valueTypeOptions;
			rule.condition = parts[2];
			rule.data = parts[3];
		}
	}
}

function refreshParams($scope){
	$scope.params=[];
	refreshParamsForGroup($scope, $scope.filter.group)
}
function refreshParamsForGroup($scope, group) {
	for(var i =0; i< group.rules.length; i++) {
		var rule = group.rules[i];
		console.log(rule);
		if(rule.valueType == 'arg') {			
			//try getting the argValue from the origParams (for mod screen)
			var argValue = '';
			for(var j = 0; j < $scope.origParams.length; j++) {
				if($scope.origParams[j].paramName == rule.data) {
					argValue = $scope.origParams[j].argValue;
				}
			}
			$scope.params.push({dataType:rule.field.attrType, paramName:rule.data, argValue:argValue});
			console.log($scope.params);
		}
		else if(rule.group) {
			refreshParamsForGroup($scope, rule.group);
		}
	}	
}
function cleanseSelector(selector) {
	//remove one or more space chars with blank
	var cleansed = selector.replace(/s+/g,' ');
	//remove leading and training parentheses. They were explicitly added for click and build UI
	
}