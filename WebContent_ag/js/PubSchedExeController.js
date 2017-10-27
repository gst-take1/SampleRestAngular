sessionStorage.clickedTabId = 'liPubSched';
var schedRulesEnv= sessionStorage.schedRulesEnv;
SADiagApp.controller('PubSchedExeController', ['$scope', '$uibModal', '$http', '$log', function($scope, $uibModal, $http, $log) {
     
						  $scope.srcFilesLoading = true;
						  $scope.initialPageSize = 200;
						  $scope.error = false;
						  
						  /* $scope.today = function() {
	                	    $scope.dt = new Date();
	                	    console.log(dt);
	                	    console.log($scope.dt);
	                	    //$scope.dt.setDate($scope.dt);
	                	  };*/
	                	  $scope.dt = dt;
	                	  $scope.schedRulesEnv = schedRulesEnv;
	                	  $scope.patternFilter = patternFilter;
	                	  
	                	  
	                	  var date1 = new Date();
	                	  date1.setDate(date1.getDate());
	                	  var date2 = new Date();
	                	  date2.setDate(date2.getDate()-1);
	                	  
	                	  $scope.fromDt = (sessionStorage.rulesFromDt!=null) ? new Date(sessionStorage.rulesFromDt) :new Date(date2);
	                	  sessionStorage.rulesFromDt = $scope.fromDt;
	                	  $scope.toDt = (sessionStorage.rulesToDt!=null) ? new Date(sessionStorage.rulesToDt) :new Date(date1);
	                	  sessionStorage.rulesToDt = $scope.toDt;
	                	  
	                	 	                	  
	  	                  $scope.$watch('fromDt', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		 $scope.getPubSchedExe();
	  	                		 sessionStorage.rulesFromDt = newValue;
	  	                	  }
	  	                  });
	  	                  $scope.$watch('toDt', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		 $scope.getPubSchedExe();
	  	                		 sessionStorage.rulesToDt = newValue;
	  	                	  }
	  	                  });
	  	                  $scope.$watch('schedRulesEnv', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		$scope.getPubSchedExe();
	  	                		sessionStorage.schedRulesEnv = $scope.schedRulesEnv;
	  	                	  }
	  	                  });
	  	                 /* $scope.$watch('patternFilter', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		$scope.getPubData();
	  	                		sessionStorage.patternFilter = $scope.patternFilter;
	  	                	  }
	  	                  });*/
	  	                  
	  	                $scope.clear = function () {
	                	    $scope.dt = null;
	                	  };

	                	  // Disable weekend selection
	                	  $scope.disabled = function(date, mode) {
	                	    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	                	  };

	                	  $scope.toggleMin = function() {
	                	    $scope.minDate = $scope.minDate ? null : new Date();
	                	  };
	                	  $scope.toggleMin();
	                	  $scope.maxDate = new Date(2020, 5, 22);

	                	  $scope.openFrom = function($event) {
	                		 $event.preventDefault();
	                	     $event.stopPropagation();
	                	    $scope.statusFrom.opened = true;
	                	    //console.log('In Opened');
	                	  };
	                	  $scope.openTo = function($event) {
 	                		 $event.preventDefault();
 	                	     $event.stopPropagation();
 	                	    $scope.statusTo.opened = true;
 	                	    //console.log('In Opened');
 	                	  };
	                	  
	                	  $scope.statusFrom = {
	                		opened: false
	                	  };
	                	  $scope.statusTo = {
	    	                opened: false
	    	               };

    	                	  $scope.setDate = function(year, month, day) {
    	                	    $scope.dt = new Date(year, month, day);
    	                	  };
    	                  
    	                	  $scope.initGrid = function() {
    	                			//console.log('in initGrid')
    	                	        $scope.columnDefinitionsSrcFiles =[
    	                	            {
    	                	                Name: 'filePattern',
    	                	                DisplayName: 'Publication File Pattern',
    	                	                width: '28%'
    	                	            },
                                        {
                                            Name: 'schedBeginTime',
                                            DisplayName: 'Scheduled Begin Time',
                                            width: '12%'
                                        },
                                        {
                                            Name: 'schedEndTime',
                                            DisplayName: 'Scheduled End Time',
                                            width: '12%'
                                        },
                                        {
                                            Name: 'rlvdSchedBeginTime',
                                            DisplayName : 'Begin Time Resolved As',
                                            DateFormatFn: function (r) { return SCHED_EXE_DATE_TIME_FORMAT; },
                                            ColumnType: 'ngNGridDate',
                                            width: '12%'
                                        },
                                        {
                                            Name: 'rlvdSchedEndTime',
                                            DisplayName : 'End Time Resolved As',
                                            DateFormatFn: function (r) { return SCHED_EXE_DATE_TIME_FORMAT; },
                                            ColumnType: 'ngNGridDate',
                                            width: '12%'
                                        },
                                        {
    	                	                Name: 'exeSts',
    	                	                DisplayName: 'Status',   
    	                	                ColumnType: 'ngNGridLabel',
    	                	                ClassFn: function (r) { return getLabelClass($scope.getUiStatusFromValue(r.exeSts)); },
    	                	                GlyphFn: function (r) { return getGlyphClass($scope.getUiStatusFromValue(r.exeSts)); },
    	                	                TextFn: function(r){return r.exeSts;},
    	                	                TooltipFn: function (r) { return r.exeSts; },                    
    	                	                FilterClassFn: function (c) { return 'label ' + getLabelClass($scope.getUiStatusFromValue(c.DistinctValue)); },
    	                	                FilterGlyphFn: function (c) { return getGlyphClass($scope.getUiStatusFromValue(c.DistinctValue)); }  ,
    	                	                width: '6%'
    	                	            },    	                	            
                                        /*{
                                            Name: 'ruleExecutedAt',
                                            DisplayName : 'Rule Executed At',
                                            DateFormatFn: function (r) { return SCHED_EXE_DATE_TIME_FORMAT; },
                                            ColumnType: 'ngNGridDate',
                                            width: '12%'
                                        },*/
                                        {
                                     	   Name: 'errorDsc',
                                     	   DisplayName : 'Error',
                                     	   width: '12%'
                                        }, 
                                        {
                                      	   Name: 'severity',
                                      	   DisplayName : 'Severity',
                                      	   ColumnType: 'ngNGridLabel',
                                      	   ClassFn: function (r) { return getLabelClass($scope.getUiSeverityFromValue(r.severity)); },
                                      	   GlyphFn: function (r) { return getGlyphClass($scope.getUiSeverityFromValue(r.severity)); },
                                      	   TextFn: function(r){return r.severity;},
                                      	   TooltipFn: function (r) { return r.severity; },                    
                                      	   FilterClassFn: function (c) { return 'label ' + getLabelClass($scope.getUiSeverityFromValue(c.DistinctValue)); },
                                      	   FilterGlyphFn: function (c) { return getGlyphClass($scope.getUiSeverityFromValue(c.DistinctValue)); }  ,
                                      	   width: '6%'
                                         }                                          	                	            
    	                	        ];
    	                	  }
    	                	  
    	                	  $scope.getPubSchedExe = function () {
    	                		  console.log('in getPubSchedExe');
    	                		  $scope.srcFiles = [];
    	                		  $scope.srcFilesLoading = true;
    	                          $http({
    	                                  method : 'GET',
    	                                  url : "rest/sa/getPubSchedExe/" + $scope.schedRulesEnv +'/' + $scope.fromDt + '/' + $scope.toDt
    	                          }).success(function(data, status, headers, config) {
    	                          		//console.log("In success ");
    	                          		//console.log(data);
    	                                  $scope.srcFiles = data;
    	                                  $scope.srcFilesLoading = false;
    	                                  //$scope.initGrid();
    	                          }).error(function(data, status, headers, config) {
    	                        	  console.log('In Error');
    	                        	  //showAlert($scope,'Error!!', 'Failed to get Src data from server.' + data.Message , 'danger');
    	                        	  $scope.errorMsg = getErrorMsg(status, data);
    	                        	  $scope.srcFilesLoading = false;
    	                          });

    	                	  }
    	                	  
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
    		    	             			$scope.getPubSchedExe();
    		    	             		  }, function errorCallback(response) {
    		    	             		    console.log("error");
    		    	             		    console.log(getErrorMsgResponse(response));
    		    	             		  }); 
    	 	                	  }
    	                	      	                	  
    	                	  $scope.getUiStatusFromValue = function(status) {
    	                			switch (status) {
    	                	        case 'PASSED':
    	                	            return NG_STATUS_SUCCESS;
    	                	            break;
    	                	        case 'FAILED':
    	                	            return NG_STATUS_ERROR;
    	                			}
    	                		}
    	                	  
    	                	  $scope.getUiSeverityFromValue = function(severity) {
  	                			switch (severity) {
  	                	        case 'Error':
  	                	            return NG_STATUS_ERROR;
  	                	            break;
  	                	        case 'Warning':
  	                	            return NG_STATUS_WARNING;
  	                			}
  	                		  }
    	                	     	                		
    	                	  $scope.init = function () {
	    	                	  $scope.initGrid();  
	    	                	  $scope.getAllEnvs();
    	                	  }
    	                	  
    	                	  $scope.init();
    	                	 
    	                	  $scope.getLoggedInUser = function() {
    	                	  	  $http({
    	                	            method : 'GET',
    	                	            url : "rest/sa/getLoggedInUser"
    	                	        }).success(function(data, status, headers, config) {
    	                	        		//console.log("In success ");
    	                	        		//console.log(data);
    	                	                $scope.loggedInUser = data;
    	                	        }).error(function(data, status, headers, config) {
    	                	        	console.log(getErrorMsg(status, data));
    	                	        });
    	                	    }
    	                	    $scope.getLoggedInUser();
                                          
}]);