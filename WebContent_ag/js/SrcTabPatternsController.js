sessionStorage.clickedTabId = 'liMonSrc';
SADiagApp.controller('SrcTabPatternsController', ['$scope', '$uibModal', '$http', '$log', function($scope, $uibModal, $http, $log) {
						  $scope.error = false;
						  $scope.srcPatternsLoading = true;
						  $scope.intialPageSize = 200;
						  $scope.intialSortColumn = 'entity';
				          //$scope.intialSortDesc = true;
						  
						  /* $scope.today = function() {
	                	    $scope.dt = new Date();
	                	    console.log(dt);
	                	    console.log($scope.dt);
	                	    //$scope.dt.setDate($scope.dt);
	                	  };*/
						  $scope.dt = dt;
  	                	  $scope.env = env;
  	                	  $scope.patternFilter=patternFilter;
  	                	  
	  	                  $scope.$watch('dt', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		  $scope.getAllSrcPatterns();
	  	                		  sessionStorage.dt = $scope.dt;
	  	                	  }
	  	                  });
	  	                  $scope.$watch('env', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		  $scope.getAllSrcPatterns();
	  	                		  sessionStorage.env = $scope.env;
	  	                	  }
	  	                  });
		  	              $scope.$watch('patternFilter', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		  $scope.getAllSrcPatterns();
	  	                		  sessionStorage.patternFilter = $scope.patternFilter;
	  	                	  }
	  	                  });
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

    	                	  $scope.open = function($event) {
    	                		 $event.preventDefault();
    	                	     $event.stopPropagation();
    	                	    $scope.status.opened = true;
    	                	    //console.log('In Opened');
    	                	  };

    	                	  $scope.setDate = function(year, month, day) {
    	                	    $scope.dt = new Date(year, month, day);
    	                	  };
    	                  
    	                	  $scope.status = {
    	                		opened: false
    	                	  };
    	                	  
    	                	  
    	                	  $scope.initGrid = function() {
    	                			//console.log('in initGrid')
    	                	        $scope.columnDefinitionsSrcPatterns =[
    	                	            {
    	                	                Name: 'entity',
    	                	                DisplayName: 'Entity',
    	                	                //ColumnType: 'ngNGridLink',      
    	                	               // CellClassFn: function (r) {return 'drag'},
    	                	                //ClassFn: function (r) {return 'drag'},
    	                	               // UrlFn: function (r) { return '/ServiceAgentCreateMvc?ExistingAgentName='+ r.Name+'&Version='+ r.Version +'&Copy=false'; }
    	                	                width: '34%'
    	                	            },
    	                	            {
    	                	                Name: 'pubFilePattern',
    	                	                DisplayName: 'Src Pattern',
    	                	                width: '44%'
    	                	            },
    	                	            {
    	                	                Name: 'status',
    	                	                DisplayName: 'Status',   
    	                	                ColumnType: 'ngNGridLabel',
    	                	                ClassFn: function (r) { return getLabelClass($scope.getUiStatusFromValue(r.status)); },
    	                	                GlyphFn: function (r) { return getGlyphClass($scope.getUiStatusFromValue(r.status)); },
    	                	                TextFn: function(r){return r.status;},
    	                	                TooltipFn: function (r) { return r.status; },                    
    	                	                FilterClassFn: function (c) { return 'label ' + getLabelClass($scope.getUiStatusFromValue(c.DistinctValue)); },
    	                	                FilterGlyphFn: function (c) { return getGlyphClass($scope.getUiStatusFromValue(c.DistinctValue)); } ,
    	                	                width: '20%'
    	                	            }
    	                	            
    	                	        ];
    	                			$scope.columnDefinitionSrcPatternDetails =[
    	                			                                           {
    	                			                                               Name: 'fileNm',
    	                			                                               DisplayName: 'Src File Name'
    	                			                                           },
    	                			                                           {
    	                			       	                	                Name: 'status',
    	                			       	                	                DisplayName: 'Status',   
    	                			       	                	                ColumnType: 'ngNGridLabel',
    	                			       	                	                ClassFn: function (r) { return getLabelClass($scope.getUiStatusFromValue(r.status)); },
    	                			       	                	                GlyphFn: function (r) { return getGlyphClass($scope.getUiStatusFromValue(r.status)); },
    	                			       	                	                TextFn: function(r){return r.status;},
    	                			       	                	                TooltipFn: function (r) { return r.status; },                    
    	                			       	                	                FilterClassFn: function (c) { return 'label ' + getLabelClass($scope.getUiStatusFromValue(c.DistinctValue)); },
    	                			       	                	                FilterGlyphFn: function (c) { return getGlyphClass($scope.getUiStatusFromValue(c.DistinctValue)); }  
    	                			       	                	            	},    	                			       	                	            
    	                			                                           {
    	                			                                               Name: 'generatedAt',
    	                			                                               DisplayName : 'Generated At',
    	                			                                               DateFormatFn: function (r) { return IDW_DATE_TIME_FORMAT; },
    	                			                                               ColumnType: 'ngNGridDate'
    	                			                                           },
    	                			                                           {
    	                			                                               Name: 'recordCount',
    	                			                                               DisplayName : 'Record Count',
    	                			                                               FilterGlyphFn: function (c) { return c.DisplayValue > 0 ? 'text-muted glyphicon-exclamation-sign' : ''; },
    	                			                                               GlyphFn: function (r) { return r[this.Name] > 0 ? 'text-muted glyphicon-exclamation-sign' : ''; },
    	                			                                               ColumnType: 'ngNGridNumber'
    	                			                                           },
    	                			                                           {
    	                			                                        	   Name: 'errorMsg',
    	                			                                        	   DisplayName : 'Error message',
    	                			                                           }    	                			                                           
    	                			                                       ];
    	                	  }
    	                	  

    	                	  $scope.getAllEnvs = function() {
    	   	                	 	console.log('getAllEnvs');
    		    	             		$http({
    		    	             			  method: 'GET',
    		    	             			  url: 'rest/sa/getEnvs'
    		    	             		}).then(function successCallback(response) {
    		    	             			//console.log(response.data);
    		    	             			$scope.allEnvs = response.data
    		    	             			if(!$scope.env) 
    		    	             				$scope.env = $scope.allEnvs[0];
    		    	             			$scope.getAllSrcPatterns();
    		    	             		  }, function errorCallback(response) {
    		    	             			 console.log(getErrorMsgResponse(response));
    		    	             		  }); 
    	 	                	  }
    	                	      	
    	                	  
    	                	  $scope.getAllSrcPatterns = function () {
    	                		  console.log('in getAllSrcPatterns');
    	                		  $scope.srcPatterns = [];
    	                		  $scope.srcPatternsLoading = true;
    	                          $http({
    	                                  method : 'GET',
    	                                  url : "rest/sa/srcPatternTable/" + $scope.env +'/' + $scope.dt + '/' + $scope.patternFilter
    	                          }).success(function(data, status, headers, config) {
    	                          		//console.log("In success ");
    	                          		//console.log(data);
    	                                  $scope.srcPatterns = data;
    	                                  $scope.srcPatternsLoading = false;
    	                                  //$scope.initGrid();
    	                          }).error(function(data, status, headers, config) {
    	                        	  console.log('In Error');
    	                        	  //showAlert($scope,'Error!!', 'Failed to get Srclications data from server.' + data.Message , 'danger');
    	                        	  $scope.errorMsg = getErrorMsg(status, data);
    	                        	  $scope.srcPatternsLoading = false;
    	                          });

    	                	  }
    	                	  
    	                	  $scope.expandSrcPattern = function(row) {
    	                			//console.log(row.srcPattern);
    	                			$http({
    	                	            method : 'GET',
    	                	            url : "rest/sa/barchart/srcDetails/" + $scope.env +'/' +row.pubFilePattern + '/' + $scope.dt
    	                			    }).success(function(data, status, headers, config) {
    	                			    		//console.log(data);
    	                			    		row.srcPatternDetails = data;
    	                			    }).error(function(data, status, headers, config) {
    	                			    	$scope.errorMsg = getErrorMsg(status, data);
    	                			    });
    	                		}
    	                	  
    	                	  $scope.getUiStatusFromValue = function(status) {
  	                			switch (status) {
  	                	        case 'Successful':
  	                	            return NG_STATUS_SUCCESS;
  	                	            break;
  	                	        case 'Errored':
  	                	            return NG_STATUS_ERROR;
  	                	            break;
  	                	        case 'Not loaded':
  	                	            return NG_STATUS_NEW_WAITING;
  	         
  	                			}
  	                		}
    	                		
    	                	  $scope.init = function () {
    	                		  $scope.getAllEnvs();
	    	                	  $scope.initGrid();  
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