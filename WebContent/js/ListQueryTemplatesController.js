URLBuilderApp.controller('ListQueryTemplatesController', ['$scope', '$http', '$log', '$filter', 'exportQT', function($scope, $http, $log, $filter, exportQT) {
			$scope.queryTemplateKeysData = [];
			
			$scope.imported = false;
			$scope.sortType = '';
			$scope.sortReverse = false;
			$scope.selectAll = false;
			$scope.anyRowSelected = false;
			$scope.oneRowSelected = false;
			
			$scope.getQueryTemplateKeys = function() {
				$http({
                    method : 'GET',
                    url : "qb/builder/getQueryTemplateKeys/" + $scope.owner
				}).success(function(data, status, headers, config) {
					$scope.queryTemplateKeysData = data;
				}).error(function(data, status, headers, config) {
                    $scope.errorMsg = getErrorMsg(status, data);
				});
			}
						
						  
			  $scope.getLoggedInUser = function() {
			  	  $http({
			            method : 'GET',
			            url : "qb/builder/getLoggedInUser"
			        }).success(function(data, status, headers, config) {
			        		console.log("In success ");
			        		console.log(data);
			                $scope.loggedInUser = data;
			                //$scope.getQueryTemplateKeys();
			        }).error(function(data, status, headers, config) {
			        	$scope.errorMsg = getErrorMsg(status, data);
			        });
			    }
			    
			    $scope.setOwnerAsLoggedInUser = function() {
			    	$http({
			            method : 'GET',
			            url : "qb/builder/getLoggedInUser"
			        }).success(function(data, status, headers, config) {
			        		console.log("In success ");
			        		console.log(data);
			                $scope.loggedInUser = data;
			                $scope.owner = $scope.loggedInUser;
			                //$scope.getQueryTemplateKeys();
			        }).error(function(data, status, headers, config) {
			        	$scope.errorMsg = getErrorMsg(status, data);
			        });
			    }
			    
			    $scope.setOwnerAsGroup = function() {
			    	$scope.getLoggedInUser();
					$http({
						  method: 'GET',
						  url: 'qb/builder/getGroupOptions'
					}).then(function successCallback(response) {
						//console.log(response.data);
						$scope.groupOptions = response.data
						$scope.owner = $scope.groupOptions[0];
		                //$scope.getQueryTemplateKeys();
					  }, function errorCallback(response) {
						  console.log(response);
					      $scope.errorMsg = getErrorMsgResponse(response);
					  }); 
				}
			    
			    $scope.$watch('owner', function (newValue, oldValue) {
					if(newValue) {
						$scope.getQueryTemplateKeys();
					}
				})
			 
			    
			  $scope.toggleSelectAll = function () {
			    	exportQT.toggleSelectAll($scope);
			  }
			    
			  $scope.updateAnyRowSelected = function () {
			    	exportQT.updateAnyRowSelected($scope);
			  }
			    
			  $scope.exportSelectedToJson = function () {
				  exportQT.exportQueryTemplate($scope.queryTemplateKeysData); 
		      }
			  
				$scope.onFileUpload = function (element) {
					$scope.importErrorMsg='';
	                $scope.importSuccessMsg='';
					 var reader = new FileReader();
		                reader.readAsText(element.files[0]);
		                reader.onload = function (e) {
		                	try{
				                var arrRows = angular.fromJson(reader.result);
				                console.log(arrRows);
				                $http.post('qb/modify/saveQueryTemplates' , arrRows
			    			    ).success(function(data, status, headers, config) {
			                		console.log("In success ");
			                		console.log(data);
			                		console.log(data[0]);
			                		console.log(data[1]);
			                		$scope.importSuccessMsg = data[0];
			                		$scope.importErrorMsg = data[1];
			                		$scope.getQueryTemplateKeys
			    				}).error(function(data, status, headers, config) {
			    					$scope.importErrorMsg = getErrorMsg(status, data);
			    				});
				                
		                	} catch (ex) {
		                		$scope.importErrorMsg = ex.message;
		                		$scope.$apply();
		                		throw(ex);
		                	}
				        }
		                document.getElementById("fileUploadJson").value='';
				}
				
				$scope.getQueryTemplateFromKey = function(owner, name) {
					$http({
						  method: 'GET',
						  url: 'qb/builder/getQueryTemplateFromKey/' + owner + '/' + name
					}).then(function successCallback(response) {
						console.log(response.data);
						$scope.editQT = response.data;
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
														
							$scope.selector = $scope.editQT.selector;
							//$scope.parseSelector();
							/*for(var i = 0; i< $scope.params.length; i++) {
								for(var j = 0; j<$scope.editQT.paramsList.length; j++) {
									if($scope.params[i].paramName == $scope.editQT.paramsList[j].paramName){
										$scope.params[i].argValue = $scope.editQT.paramsList[j].argValue;
										break;
									}
								}
							}*/						
						  }, function errorCallback(response) {
							  $scope.executeErrorMsg=getErrorMsgResponse(response);
						  }); 
						
						$scope.contentType = $scope.editQT.resultFormat;
						$scope.params = $scope.editQT.paramsList;
						$scope.sortBy = $scope.editQT.sortByList;
						$scope.templateName = $scope.editQT.templateName;
						$scope.owner = $scope.editQT.owner;
						$scope.reply = $scope.editQT.reply;
						
					  }, function errorCallback(response) {
						  $scope.executeErrorMsg=getErrorMsgResponse(response);
					  }); 
				}
								
				$scope.clickExecute = function () {
					$scope.openExecute = true;
					$scope.res = '';
					$scope.resHtml = '';
					
					var selectedQT;
					for(var i =0; i <$scope.queryTemplateKeysData.length; i++) {
						if($scope.queryTemplateKeysData[i].isSelected) {
							selectedQT = $scope.queryTemplateKeysData[i];
						}
					}
					$scope.getQueryTemplateFromKey(selectedQT.owner, selectedQT.name);
				}
				
				$scope.executeTemplate = function () {
					$scope.editQT.paramsList = $scope.params;

					$scope.res = '';
					$scope.resHtml = '';
					$scope.running = true;
					
	    			$http.post('qb/execute/executeQueryTemplate',
	    					$scope.editQT
    			    ).then(function successCallback(response) {
    			    	$scope.running = false;
    			    	if($scope.contentType == 'html') {
    						$scope.resHtml = response.data;
    						var parts = $scope.resHtml.match
    						(/(<table.*<\/table>)/);
    						//console.log(parts);
    						$scope.resHtml = parts[0];
    						$scope.resHtml = $scope.resHtml.replace(/class\="\w*"/, 'class="table table-hover table-condensed table-bordered table-striped"');
    						$scope.resHtml = $scope.resHtml.replace(/<th>/g, '<th class="bg-info">');
    					}
    					else
    						$scope.res = response.data;
    						//$scope.res = $scope.res.replace(/\n/g,"<br>")
    				}, function errorCallback(response) {
    					$scope.running = false;
    					$scope.executeErrorMsg = getErrorMsgResponse(response);
    				 });			    	
				}
				
				
}]);