sessionStorage.clickedTabId = 'liSrcSched';
var schedRulesEnv= sessionStorage.schedRulesEnv;
var date1 = new Date();
date1.setDate(date1.getDate() -1);
var dt = sessionStorage.dt!=null?new Date(sessionStorage.dt):date1;

var app = angular.module('myApp',['xeditable','ngSanitize']);
app.run(function(editableOptions) {
	  editableOptions.theme = 'bs3';
	});
app.controller('SrcSchedController', function($scope, $http, $log, $filter) {
			$scope.errorMsg = '';
			$scope.srcSchedData = [];
			$scope.schedRulesEnv=schedRulesEnv;
			$scope.sevList=['Error','Warning'];
			$scope.srcFilePatterns = [];
			$scope.selectAll = false;
			$scope.anyRowSelected = false;
			$scope.sortType = '';
			$scope.sortReverse = false;
			$scope.updatePanelOpened = false;
			$scope.updSchedBgnTime;
			$scope.updSchedEndTime;
			$scope.updSeverity = '';
			
			$scope.$watch('schedRulesEnv', function (newValue, oldValue) {
	          	  if(newValue != undefined && oldValue != newValue) {
	          		  sessionStorage.schedRulesEnv = $scope.schedRulesEnv;
	          		  $scope.getSrcSched();
	          	  }
	            });
			 $scope.getAllEnvs = function() {
	           	 	console.log('getAllEnvs');
	            		$http({
	            			  method: 'GET',
	            			  url: 'rest/sa/getSchedRulesEnvs'
	            		}).then(function successCallback(response) {
	            			//console.log(response.data);
	            			$scope.allEnvs = response.data
	            			if(!$scope.schedRulesEnv) 
	            				$scope.schedRulesEnv = $scope.allEnvs[0];
	            			$scope.getSrcSched();
	            			$scope.getSrcFilePatterns();
	            		  }, function errorCallback(response) {
	            			  console.log(getErrorMsgResponse(response));
	            		  }); 
	         }
			 
			 $scope.getSrcFilePatterns = function() {
					$http({
	      			  method: 'GET',
	      			  url: 'rest/sa/getDistinctSrcPatterns/' + $scope.schedRulesEnv
		      		}).then(function successCallback(response) {
		      			console.log(response.data);
		      			$scope.srcFilePatterns = response.data;
		      		  }, function errorCallback(response) {
		      		     console.log("error")
		      		     console.log(getErrorMsgResponse(response));
		      		  }); 
				}
			$scope.getSrcSched = function() {
				$http({
                    method : 'GET',
                    url : "rest/sa/srcSched/" + $scope.schedRulesEnv
				}).success(function(data, status, headers, config) {
            		//console.log("In success ");
            		console.log(data);
					$scope.srcSchedData = data;
                    //$scope.initGrid();
				}).error(function(data, status, headers, config) {
					$scope.errorMsg = getErrorMsg(status, data);
				});
			}
			
			$scope.saveSrcSched = function(data, srcSched) {
			    //$scope.user not updated yet
			    //angular.extend(data, {id: id})
				data.schedRulesEnv = $scope.schedRulesEnv;
				srcSched.schedRulesEnv = $scope.schedRulesEnv;
				console.log(data);
				console.log(srcSched);
				//var dataJSON = JSON.parse(data);
				//console.log(dataJSON);
				$http.post('rest/admin/saveSrcSched' , srcSched
			    ).success(function(data, status, headers, config) {
            		//console.log("In success ");
            		console.log(data);
					//$scope.pubSchedData = data;
            		for(var i = 0; i < $scope.srcSchedData.length; i++) {
            			if($scope.srcSchedData[i].filePattern == data.filePattern 
            					&& $scope.srcSchedData[i].schedBeginTime == data.schedBeginTime && $scope.srcSchedData[i].schedEndTime == data.schedEndTime) {
			                  $scope.srcSchedData[i].lastModBy = data.lastModBy;
			                  $scope.srcSchedData[i].lastModAt = data.lastModAt;
			                  if(!$scope.srcSchedData[i].createdBy)
			                	  $scope.srcSchedData[i].createdBy = data.createdBy;
			                  if(!$scope.srcSchedData[i].createdAt)
			                	  $scope.srcSchedData[i].createdAt = data.createdAt;
			                  $scope.srcSchedData[i].origSchedBeginTime = data.schedBeginTime;
		                      $scope.srcSchedData[i].origSchedEndTime = data.schedEndTime;
		                      $scope.srcSchedData[i].origFilePattern = data.filePattern;
			                  break;
            			}
            		}
				}).error(function(data, status, headers, config) {
					 $scope.srcSchedData.pop();
					 $scope.errorMsg = getErrorMsg(status, data);
				});
				//console.log(data);
			  };

			  // remove Src Sched
			  $scope.removeSrcSched = function(index) {
				 if(confirm("Sure you want to delete it?")) {
					 if($scope.filteredSrcSched.length > 0) {
						 for(var i = 0; i < $scope.srcSchedData.length; i++) {
							 if($scope.srcSchedData[i].filePattern == $scope.filteredSrcSched[index].filePattern 
			        					&& $scope.srcSchedData[i].schedBeginTime == $scope.filteredSrcSched[index].schedBeginTime && $scope.srcSchedData[i].schedEndTime == $scope.filteredSrcSched[index].schedEndTime) {
								 index = i;
								 break;
							 }
						 }
					 }		
					 console.log($scope.srcSchedData[index]);
					 if(!$scope.srcSchedData[index].filePattern && !$scope.srcSchedData[i].schedBeginTime && !$scope.srcSchedData[i].schedEndTime) {
						 $scope.srcSchedData.splice(index, 1);
						 return;
					 }
					 $scope.srcSchedData[index].schedRulesEnv = $scope.schedRulesEnv;
					 $http.post('rest/admin/deleteSrcSched', $scope.srcSchedData[index]
					 ).then(function successCallback(response) {
						 console.log("In success");
						 $scope.srcSchedData.splice(index, 1);
					 }, function errorCallback(response) {
						 $scope.errorMsg = getErrorMsg(status, data);
					});
								
				 }
			  };
			  
			  $scope.getAllEnvs();

			  // add new Src Sched
			  $scope.addSrcSched = function() {
			    $scope.inserted = {
			      //id: $scope.srcSchedData.length+1,
			      filePattern: $scope.srcFilePatterns[0],
			      schedBeginTime: '',
			      schedEndTime: '',
			      severity: 'Error'
			    };
			    $scope.srcSchedData.push($scope.inserted);
			  };
			  
			  $scope.getLoggedInUser = function() {
			  	  $http({
			            method : 'GET',
			            url : "rest/sa/getLoggedInUser"
			        }).then(function successCallback(response) {
						 console.log(response.data);
						 $scope.loggedInUser=response.data
					 }, function errorCallback(response) {
						 console.log(response);
						 $scope.errorMsg = "<strong>Error!</strong> Logged in User could not be determined";
					});
			    }
			    $scope.getLoggedInUser();
			    $scope.removeEmptyRow = function (srcSched) {
					  //console.log("InRemove Empty Row");
					  //console.log(pubSched);
					  if(!srcSched.schedBeginTime && !srcSched.schedEndTime) {
						  $scope.srcSchedData.pop();
					  }
				  }
			    $scope.toggleSelectAll = function () {
			    	$scope.anyRowSelected = $scope.selectAll;
			    	for(var i =0; i <$scope.filteredSrcSched.length; i++) {
			    		$scope.filteredSrcSched[i].isSelected = $scope.selectAll
			    	}
			    }
			    $scope.updateAnyRowSelected = function () {
			    	for(var i =0; i <$scope.srcSchedData.length; i++) {
			    		if($scope.srcSchedData[i].isSelected) {
			    			$scope.anyRowSelected = true;
			    			return;	
			    		}
			    	}
			    	$scope.anyRowSelected = false;
			    }
			    $scope.exportSelectedToJson = function () {
		            var cancel = false;
		            var selectedRows = [];
		            for (var i = 0; i < $scope.srcSchedData.length; i++) {
		                if ($scope.srcSchedData[i].isSelected) {
		                	var ruleObj =  {
		          			      filePattern: $scope.srcSchedData[i].filePattern,
		          			      schedBeginTime: $scope.srcSchedData[i].schedBeginTime,
		          			      schedEndTime:  $scope.srcSchedData[i].schedEndTime,
		          			      severity: $scope.srcSchedData[i].severity
		          			    };
		                    selectedRows.push(ruleObj);
		                }
		            }
		            
	                var blobObject = new Blob([angular.toJson(selectedRows)]);
	                window.navigator.msSaveBlob(blobObject, 'SrcSchedRules_'+ $scope.schedRulesEnv +'.json');           
		            
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
				                $http.post('rest/admin/saveMultipleSrcSched' , arrRows
			    			    ).success(function(data, status, headers, config) {
			                		console.log("In success ");
			                		console.log(data);
			                		$scope.importSuccessMsg = "<strong>" + data[0] + "</strong> row(s) inserted successfully ";
			                		$scope.importErrorMsg = "<strong>" + data[1] + "</strong> row(s) had errors ";
			                		$scope.getSrcSched();
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
				$scope.updateSelected = function () {
					$scope.importErrorMsg='';
	                $scope.importSuccessMsg='';
	                copySrcSchArr = [];
		            for (var i = 0; i < $scope.srcSchedData.length; i++) {
		                if ($scope.srcSchedData[i].isSelected) {
		                	var copySrcSch = angular.copy($scope.srcSchedData[i]);
		                	copySrcSch.schedRulesEnv = $scope.schedRulesEnv;
		                	if($scope.updSchedBgnTime)
		                		copySrcSch.schedBeginTime = $scope.updSchedBgnTime;
		                	if($scope.updSchedEndTime)
		                		copySrcSch.schedEndTime = $scope.updSchedEndTime;
		                	if($scope.updSeverity)
		                		copySrcSch.severity = $scope.updSeverity;
		                	copySrcSchArr.push(copySrcSch);
		                	$scope.srcSchedData[i].isSelected = false;
		                  }
		             }
		             $scope.anyRowSelected = false;      
		             $http.post('rest/admin/saveMultipleSrcSched' , copySrcSchArr
					 ).success(function(data, status, headers, config) {
						//console.log("In success ");
						console.log(data);
						//$scope.pubSchedData = data;
						$scope.importSuccessMsg = "<strong>" + data[0] + "</strong> row(s) updated successfully ";
                		$scope.importErrorMsg = "<strong>" + data[1] + "</strong> row(s) had errors ";
						$scope.getSrcSched();
					}).error(function(data, status, headers, config) {
						$scope.importErrorMsg = getErrorMsg(status, data);
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