URLBuilderApp.controller('ListPubTemplatesController', ['$scope', '$http', '$log', '$filter', 'exportQT', function($scope, $http, $log, $filter, exportQT) {
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
                    url : "qb/pubBuilder/getPubTemplateKeys/" + $scope.owner
				}).success(function(data, status, headers, config) {
            		//console.log("In success ");
            		console.log(data);
					$scope.queryTemplateKeysData = data;
                    //$scope.initGrid();
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
			               // $scope.getQueryTemplateKeys();
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
		            exportQT.exportPubTemplate($scope.queryTemplateKeysData); 
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
				               $http.post('qb/pubModify/savePubTemplates' , arrRows
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
}]);