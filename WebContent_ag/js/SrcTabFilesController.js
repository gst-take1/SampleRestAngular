sessionStorage.clickedTabId = 'liMonSrc';
SADiagApp.controller('SrcTabFilesController', ['$scope', '$uibModal', '$http', '$log', function($scope, $uibModal, $http, $log) {
     
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
	                	  $scope.env = env;
	                	  $scope.patternFilter = patternFilter;
	                	  
	  	                  $scope.$watch('dt', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		 $scope.getAllsrcFiles();
	  	                		 sessionStorage.dt = $scope.dt;
	  	                	  }
	  	                  });
	  	                  $scope.$watch('env', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		$scope.getAllsrcFiles();
	  	                		sessionStorage.env = $scope.env;
	  	                	  }
	  	                  });
	  	                  $scope.$watch('patternFilter', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		$scope.getAllsrcFiles();
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
    	                	        $scope.columnDefinitionsSrcFiles =[
    	                	            {
    	                	                Name: 'entity',
    	                	                DisplayName: 'Entity',
    	                	                width: '300px'
    	          
    	                	            },
    	                	            {
    	                	                Name: 'srcPattern',
    	                	                DisplayName: 'Src File Pattern',
    	                	                width: '300px'
    	                	            },
    	                	            {
                                            Name: 'fileNm',
                                            DisplayName: 'Src File Name',
                                            width: '300px'
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
    	                	                FilterGlyphFn: function (c) { return getGlyphClass($scope.getUiStatusFromValue(c.DistinctValue)); }  ,
    	                	                width: '300px'
    	                	            },    	                	            
                                        {
                                            Name: 'generatedAt',
                                            DisplayName : 'Loaded in Warehouse At',
                                            DateFormatFn: function (r) { return IDW_DATE_TIME_FORMAT; },
                                            ColumnType: 'ngNGridDate',
                                            width: '300px'
                                        },
                                        {
                                            Name: 'recordCount',
                                            DisplayName : 'Record Count',
                                            FilterGlyphFn: function (c) { return c.DisplayValue > 0 ? 'text-muted glyphicon-exclamation-sign' : ''; },
                                            GlyphFn: function (r) { return r[this.Name] > 0 ? 'text-muted glyphicon-exclamation-sign' : ''; },
                                            ColumnType: 'ngNGridNumber',
                                            width: '300px'
                                        },
                                       /* {
                                            Name: 'comments',
                                            DisplayName : 'Comments',
                                            ColumnType: 'ngNGridLabel',
                                            ClassFn: function (r) { return getLabelClass($scope.getUiCommentFromValue(r.comments)); },
    	                	                GlyphFn: function (r) { return getGlyphClass($scope.getUiCommentFromValue(r.comments)); },
    	                	                TextFn: function(r){return r.comments;},
    	                	                TooltipFn: function (r) { return r.comments; },                    
    	                	                FilterClassFn: function (c) { return 'label ' + getLabelClass($scope.getUiCommentFromValue(c.DistinctValue)); },
    	                	                FilterGlyphFn: function (c) { return getGlyphClass($scope.getUiCommentFromValue(c.DistinctValue)); },
    	                	                width: '600px'
                                        },*/
                                        {
                                     	   Name: 'errorMsg',
                                     	   DisplayName : 'Error message',
                                     	  width: '600px'
                                        }                                          	                	            
    	                	        ];
    	                	  }
    	                	  
    	                	  $scope.getAllsrcFiles = function () {
    	                		  console.log('in getAllsrcFiles');
    	                		  $scope.srcFiles = [];
    	                		  $scope.srcFilesLoading = true;
    	                          $http({
    	                                  method : 'GET',
    	                                  url : "rest/sa/srcFilesTable/" + $scope.env +'/' + $scope.dt + '/' + $scope.patternFilter
    	                          }).success(function(data, status, headers, config) {
    	                          		//console.log("In success ");
    	                          		//console.log(data);
    	                                  $scope.srcFiles = data;
    	                                  $scope.srcFilesLoading = false;
    	                                  //$scope.initGrid();
    	                          }).error(function(data, status, headers, config) {
    	                        	  console.log('In Error');
    	                        	  //showAlert($scope,'Error!!', 'Failed to get Src data from server.' + data.Message , 'danger');
    	                        	  $scope.error = true;
    	                        	  $scope.srcFilesLoading = false;
    	                          });

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
    		    	             			$scope.getAllsrcFiles();
    		    	             		  }, function errorCallback(response) {
    		    	             		    console.log("error");
    		    	             		    $scope.errorMsg = getErrorMsgResponse(response);
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
    	                	  $scope.getUiCommentFromValue = function(comment) {
    	                			if(comment != null && comment.search('Loaded within Expected Time') != -1) {
    	                				return NG_STATUS_RESOLVED;
    	                			}
    	                			else if(comment != null && comment.search('Loaded beyond Expected Time') != -1) {
    	                				return NG_STATUS_WARNING;
    	                			}
    	                			else if(comment != null && comment.search('could not be resolved') != -1) {
    	                				return NG_STATUS_NEW_WAITING;
    	                			}
    	                			else '';
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