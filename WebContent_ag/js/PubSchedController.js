sessionStorage.clickedTabId = 'liPubSched';
var schedRulesEnv= sessionStorage.schedRulesEnv;
var date1 = new Date();
date1.setDate(date1.getDate() -1);
var dt = sessionStorage.dt!=null?new Date(sessionStorage.dt):date1;

var app = angular.module('myApp',['xeditable','ngSanitize']);
app.run(function(editableOptions) {
	  editableOptions.theme = 'bs3';
	});
app.controller('PubSchedController', function($scope, $http, $log, $filter) {
			$scope.errorMsg = '';
			$scope.pubSchedData = [];
			$scope.schedRulesEnv=schedRulesEnv;
			$scope.sevList=['Error','Warning'];
			$scope.pubFilePatterns = [];
			$scope.selectAll = false;
			$scope.anyRowSelected = false;
			$scope.imported = false;
			$scope.sortType = '';
			$scope.sortReverse = false;
			$scope.updatePanelOpened = false;
			$scope.updSchedBgnTime;
			$scope.updSchedEndTime;
			$scope.updSeverity = '';
			
			$scope.$watch('schedRulesEnv', function (newValue, oldValue) {
          	  if(newValue != undefined && oldValue != newValue) {
          		  sessionStorage.schedRulesEnv = $scope.schedRulesEnv;
          		  $scope.getPubSched();
          	  }
            });
			 $scope.getAllEnvs = function() {
           	 	console.log('getAllEnvs');
            		$http({
            			  method: 'GET',
            			  url: 'rest/sa/getSchedRulesEnvs'
            		}).then(function successCallback(response) {
            			console.log(response.data);
            			$scope.allEnvs = response.data
            			if(!$scope.schedRulesEnv) 
            				$scope.schedRulesEnv = $scope.allEnvs[0];
            			$scope.getPubSched();
            			$scope.getPubFilePatterns();
            		  }, function errorCallback(response) {
            		    console.log("error");
            		    console.log(getErrorMsgResponse(response));
            		  }); 
            }
			 
			$scope.getPubFilePatterns = function() {
				$http({
      			  method: 'GET',
      			  url: 'rest/sa/getDistinctPubSchedPatterns/' + $scope.schedRulesEnv
	      		}).then(function successCallback(response) {
	      			//console.log(response.data);
	      			$scope.pubFilePatterns = response.data;
	      		  }, function errorCallback(response) {
	      		    console.log("error");
	      		    $scope.errorMsg = getErrorMsgResponse(response);
	      		  }); 
			}
			$scope.getPubSched = function() {
				$http({
                    method : 'GET',
                    url : "rest/sa/pubSched/" + $scope.schedRulesEnv
				}).success(function(data, status, headers, config) {
            		//console.log("In success ");
            		console.log(data);
					$scope.pubSchedData = data;
                    //$scope.initGrid();
				}).error(function(data, status, headers, config) {
                     $scope.errorMsg = //"<strong>Error!</strong> Server responded with error code " + status;
                    	 getErrorMsg(status, data);
				});
			}
						
			$scope.savePubSched = function(data, pubSched) {
			    //$scope.user not updated yet
			    //angular.extend(data, {id: id})
				data.schedRulesEnv = $scope.schedRulesEnv;
				pubSched.schedRulesEnv = $scope.schedRulesEnv;
				console.log(data);
				console.log(pubSched);
				//var dataJSON = JSON.parse(data);
				//console.log(dataJSON);
			    $http.post('rest/admin/savePubSched' , pubSched
			    ).success(function(data, status, headers, config) {
            		//console.log("In success ");
            		console.log(data);
					//$scope.pubSchedData = data;
            	  for(var i = 0; i < $scope.pubSchedData.length; i++) {
        			if($scope.pubSchedData[i].filePattern == data.filePattern 
        					&& $scope.pubSchedData[i].schedBeginTime == data.schedBeginTime && $scope.pubSchedData[i].schedEndTime == data.schedEndTime) {
        				 $scope.pubSchedData[i].lastModBy = data.lastModBy;
                         $scope.pubSchedData[i].lastModAt = data.lastModAt;
                         if(!$scope.pubSchedData[i].createdBy)
                       	  $scope.pubSchedData[i].createdBy = data.createdBy;
                         if(!$scope.pubSchedData[i].createdAt)
                       	  $scope.pubSchedData[i].createdAt = data.createdAt;
                         $scope.pubSchedData[i].origSchedBeginTime = data.schedBeginTime;
                         $scope.pubSchedData[i].origSchedEndTime = data.schedEndTime;
                         $scope.pubSchedData[i].origFilePattern = data.filePattern;
                         break;
        			}
            	  }
                 
				}).error(function(data, status, headers, config) {
					 $scope.pubSchedData.pop();
					 $scope.errorMsg = //"<strong>Error!</strong> Action could not be completed. Server responded with error code " + status;
						 getErrorMsg(status, data);
				});
				//console.log(data);
			  };
			  
			  $scope.removePubSched = function(index) {
					 if(confirm("Sure you want to delete it?")) {
						 if($scope.filteredPubSched.length > 0) {
							 for(var i = 0; i < $scope.pubSchedData.length; i++) {
								 if($scope.pubSchedData[i].filePattern == $scope.filteredPubSched[index].filePattern 
				        					&& $scope.pubSchedData[i].schedBeginTime == $scope.filteredPubSched[index].schedBeginTime && $scope.pubSchedData[i].schedEndTime == $scope.filteredPubSched[index].schedEndTime) {
									 index = i;
									 break;
								 }
							 }
						 }						 
						 console.log($scope.pubSchedData[index]);
						 if(!$scope.pubSchedData[index].filePattern && !$scope.pubSchedData[i].schedBeginTime && !$scope.pubSchedData[i].schedEndTime) {
							 $scope.pubSchedData.splice(index, 1);
							 return;
						 }
						 $scope.pubSchedData[index].schedRulesEnv = $scope.schedRulesEnv;
						 $http.post('rest/admin/deletePubSched', $scope.pubSchedData[index]
						 ).then(function successCallback(response) {
							 console.log("In success");
							 $scope.pubSchedData.splice(index, 1);
						 }, function errorCallback(response) {
							$scope.errorMsg = //"<strong>Error!</strong> Action could not be completed. Server responded with error code " + response.status;
								getErrorMsg(status, data);
						});
									
					 }
				  };

			  // add new Pub Sched
			  $scope.addPubSched = function() {
			    $scope.inserted = {
			      //id: $scope.pubSchedData.length+1,
			      filePattern: $scope.pubFilePatterns[0],
			      schedBeginTime: '',
			      schedEndTime: '',
			      severity: 'Error'
			    };
			    $scope.pubSchedData.push($scope.inserted);
			  };
			  
			  $scope.getAllEnvs();
			  
			  $scope.getLoggedInUser = function() {
			  	  $http({
			            method : 'GET',
			            url : "rest/sa/getLoggedInUser"
			        }).success(function(data, status, headers, config) {
			        		//console.log("In success ");
			        		//console.log(data);
			                $scope.loggedInUser = data;
			        }).error(function(data, status, headers, config) {
			        	//console.log("In Error ");
			        	$scope.errorMsg = "<strong>Error!</strong> Logged in User could not be determined";
			        });
			    }
			    $scope.getLoggedInUser();
			  $scope.removeEmptyRow = function (pubSched) {
				  //console.log("InRemove Empty Row");
				  //console.log(pubSched);
				  if(!pubSched.schedBeginTime && !pubSched.schedEndTime) {
					  $scope.pubSchedData.pop();
				  }
			  }
			  $scope.toggleSelectAll = function () {
			    	$scope.anyRowSelected = $scope.selectAll;
			    	for(var i =0; i <$scope.filteredPubSched.length; i++) {
			    		$scope.filteredPubSched[i].isSelected = $scope.selectAll
			    	}
			    }
			    $scope.updateAnyRowSelected = function () {
			    	for(var i =0; i <$scope.pubSchedData.length; i++) {
			    		if($scope.pubSchedData[i].isSelected) {
			    			$scope.anyRowSelected = true;
			    			return;	
			    		}
			    	}
			    	$scope.anyRowSelected = false;
			    }
			  $scope.exportSelectedToJson = function () {
		            var cancel = false;
		            var selectedRows = [];
		            for (var i = 0; i < $scope.pubSchedData.length; i++) {
		                if ($scope.pubSchedData[i].isSelected) {
		                	var ruleObj =  {
		          			      filePattern: $scope.pubSchedData[i].filePattern,
		          			      schedBeginTime: $scope.pubSchedData[i].schedBeginTime,
		          			      schedEndTime:  $scope.pubSchedData[i].schedEndTime,
		          			      severity: $scope.pubSchedData[i].severity
		          			    };
		                    selectedRows.push(ruleObj);
		                }
		            }
		            
	                var blobObject = new Blob([angular.toJson(selectedRows)]);
	                window.navigator.msSaveBlob(blobObject, 'PubSchedRules_'+ $scope.schedRulesEnv +'.json'); 
		            
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
				                for(var i = 0; i<arrRows.length; i++) {
				                	arrRows[i].schedRulesEnv = $scope.schedRulesEnv;
				                }
				                $http.post('rest/admin/saveMultiplePubSched' , arrRows
			    			    ).success(function(data, status, headers, config) {
			                		console.log("In success ");
			                		console.log(data);
			                		$scope.importSuccessMsg = "<strong>" + data[0] + "</strong> row(s) inserted successfully ";
			                		$scope.importErrorMsg = "<strong>" + data[1] + "</strong> row(s) had errors ";
			                		$scope.getPubSched();
			    				}).error(function(data, status, headers, config) {
			    					$scope.importErrorMsg = //"<strong>Error!</strong> Action could not be completed. Server responded with error code " + status;
			    						getErrorMsg(status, data);
			    				});
				                
		                	} catch (ex) {
		                		$scope.importErrorMsg = ex.message;
		                		$scope.$apply();
		                		throw(ex);
		                	}
				        }
		                document.getElementById("fileUploadJson").value='';
				}
				$scope.updateSelected = function () {
					$scope.importErrorMsg='';
	                $scope.importSuccessMsg='';
	                copyPubSchArr = [];
		            for (var i = 0; i < $scope.pubSchedData.length; i++) {
		                if ($scope.pubSchedData[i].isSelected) {
		                	var copyPubSch = angular.copy($scope.pubSchedData[i]);
		                	copyPubSch.schedRulesEnv = $scope.schedRulesEnv;
		                	if($scope.updSchedBgnTime)
		                		copyPubSch.schedBeginTime = $scope.updSchedBgnTime;
		                	if($scope.updSchedEndTime)
		                		copyPubSch.schedEndTime = $scope.updSchedEndTime;
		                	if($scope.updSeverity)
		                		copyPubSch.severity = $scope.updSeverity;
		                	copyPubSchArr.push(copyPubSch);
		                	$scope.pubSchedData[i].isSelected = false;
		                }
		            }
		            $scope.anyRowSelected = false;
                	$http.post('rest/admin/saveMultiplePubSched' , copyPubSchArr
					).success(function(data, status, headers, config) {
						//console.log("In success ");
						console.log(data);
						//$scope.pubSchedData = data;
						$scope.importSuccessMsg = "<strong>" + data[0] + "</strong> row(s) updated successfully ";
                		$scope.importErrorMsg = "<strong>" + data[1] + "</strong> row(s) had errors ";
						$scope.getPubSched();
					}).error(function(data, status, headers, config) {
						$scope.importErrorMsg = //"<strong>Error!</strong> Action could not be completed. Server responded with error code " + status;
							getErrorMsg(status, data);
					});
		                
                	$scope.updatePanelOpened = false; 
				}
});

function getErrorMsgResponse(response) {
	return "An Error Occured. Server responded with Status " + response.status + " - " +response.statusText + "<br>" + " Reason: " + response.data
}

function getErrorMsg(status, data) {
	return "An Error Occured. Server responded with Status " + status + "<br>" + " Reason: " + data
}