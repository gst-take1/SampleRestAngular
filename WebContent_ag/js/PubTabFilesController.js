sessionStorage.clickedTabId = 'liMonPub';
SADiagApp.controller('PubTabFilesController', ['$scope', '$uibModal', '$http', '$log', function($scope, $uibModal, $http, $log) {
						  $scope.error = false;
						  $scope.pubFilesLoading = false;
						  $scope.initialPageSize = 200;
						  
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
	  	                		$scope.getAllpubFiles();
	  	                		sessionStorage.dt = $scope.dt;
	  	                	  }
	  	                  });
	  	                  $scope.$watch('env', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		  $scope.getAllpubFiles();
	  	                		  sessionStorage.env = $scope.env;
	  	                	  }
	  	                  });
	  	                  $scope.$watch('patternFilter', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		 $scope.getAllpubFiles();
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
    	                	        $scope.columnDefinitionsPubFiles =[
    	                	            {
    	                	                Name: 'entity',
    	                	                DisplayName: 'Entity',
    	                	                width: '300px'
    	          
    	                	            },
    	                	            {
    	                	                Name: 'pubPattern',
    	                	                DisplayName: 'Publication Pattern',
    	                	                width: '300px'
    	                	            },
    	                	            {
                                            Name: 'fileNm',
                                            DisplayName: 'Publication File Name',
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
    	                	                FilterGlyphFn: function (c) { return getGlyphClass($scope.getUiStatusFromValue(c.DistinctValue)); },
    	                	                width: '300px'
    	                	            },    	                	            
                                        {
                                            Name: 'generatedAt',
                                            DisplayName : 'Generated At',
                                            DateFormatFn: function (r) { return IDW_DATE_TIME_FORMAT; },
                                            ColumnType: 'ngNGridDate',
                                            width: '300px'
                                        },
                                        /*{
                                            Name: 'recordCount',
                                            DisplayName : 'Record Count',
                                            FilterGlyphFn: function (c) { return c.DisplayValue > 0 ? 'text-muted glyphicon-exclamation-sign' : ''; },
                                            GlyphFn: function (r) { return r[this.Name] > 0 ? 'text-muted glyphicon-exclamation-sign' : ''; },
                                            ColumnType: 'ngNGridNumber',
                                            width: '10%'
                                        },*/
                                        {
                                     	   Name: 'errorMsg',
                                     	   DisplayName : 'Error message',
                                     	   width: '300px'
                                        },
                                        {
                                            Name: 'showSQL',
                                            DisplayName : 'Show SQL',
                                            ColumnType: 'ngNGridButton',
                                            ClassFn: function (r) { return getLabelClass(NG_STATUS_RESOLVED); },
    	                	                TextFn: function(r){return 'show SQL';},
    	                	                TooltipFn: function (r) { return 'show SQL'; },  
                                            width: '300px',
                                            DisableFilter: true,
                                            ClickFn: function (r) { return /*$scope.showSQL(r);*/ $scope.openSQLURLWin(r) },
    	                	                HideFn: function (r) {return r.status == 'Did not trigger'}
                                        },
    	                	            {
                                     	   Name: 'triggerMode',
                                     	   DisplayName : 'Trigger Mode',
                                     	   width: '300px'
                                        },
                                        {
                                            Name: 'trgBySrcFileNm',
                                            DisplayName : 'Triggered By Src File',
                                            width: '300px'
                                        },
                                        {
                                            Name: 'srcFileGeneratedAt',
                                            DisplayName : 'Src landed in LZ At',
                                            DateFormatFn: function (r) { return IDW_DATE_TIME_FORMAT; },
                                            ColumnType: 'ngNGridDate',
                                            width: '300px'
                                        }/*,
                                        {
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
  	    	             			$scope.getAllpubFiles();
  	    	             		  }, function errorCallback(response) {
  	    	             		     console.log("error");
  	    	             		     console.log(getErrorMsgResponse(response));
  	    	             		  }); 
  	    	             	  }
    	                	  $scope.getAllpubFiles = function () {
    	                		  console.log('in getAllpubFiles');
    	                		  $scope.pubFiles = [];
    	                		  $scope.pubFilesLoading = true;
    	                          $http({
    	                                  method : 'GET',
    	                                  url : "rest/sa/pubFilesTable/" + $scope.env +'/' + $scope.dt + '/' + $scope.patternFilter
    	                          }).success(function(data, status, headers, config) {
    	                          		//console.log("In success ");
    	                          		//console.log(data);
    	                                  $scope.pubFiles = data;
    	                                  $scope.pubFilesLoading = false;
    	                                  //$scope.initGrid();
    	                          }).error(function(data, status, headers, config) {
    	                        	  console.log('In Error');
    	                        	  //showAlert($scope,'Error!!', 'Failed to get Publications data from server.' + data.Message , 'danger');
    	                        	  $scope.errorMsg = getErrorMsg(status, data);
    	                        	  $scope.pubFilesLoading = false;
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
    	                	        case 'Did not trigger':
    	                	            return NG_STATUS_NEW_WAITING;
    	                	            break;
    	                	        case 'Generated 0 records':
    	                	            return NG_STATUS_RUNNING;
    	                	            break;
		    	                	case 'Undefined':
			                	           return NG_STATUS_NEW_WAITING;
			                	           break;
		    	                	}
    	                	  }
    	                	  
    	                	  $scope.getUiCommentFromValue = function(comment) {
  	                			if(comment != null && comment.search('Published within Expected Time') != -1) {
  	                				return NG_STATUS_RESOLVED;
  	                			}
  	                			else if(comment != null && comment.search('Published beyond Expected Time') != -1) {
  	                				return NG_STATUS_WARNING;
  	                			}
  	                			else if(comment != null && comment.search('could not be resolved') != -1) {
	                				return NG_STATUS_NEW_WAITING;
	                			}
	                			else '';
  	                		  }
    	                	  
    	                	  $scope.showSQL = function(r) {
    	                		  $http({
    	            	              method : 'GET',
    	            	              url : "rest/sa/pubFilesTable/showSQL/" + $scope.env +'/' + r.srvAgtExeId
    	            	          }).success(function(data, status, headers, config) {
    	            	          		console.log("In success ");
    	            	          		$scope.loading = false;
    	            	          		console.log(data);
    	            	          		 $scope.items = data;
    	            	          		  
    	            	          		 var modalInstance = $uibModal.open({
    	       	                	      animation: 'true',
    	       	                	      templateUrl: 'myModalContent.html',
    	       	                	      controller: 'ShowSQLModalInstanceCtrl',
    	       	                	      //windowClass: 'app-modal-window',
    	       	                	      size: 'lg',
    	       	                	      resolve: {
    	       	                	        sql: function () {
    	       	                	          return data;
    	       	                	        }
    	       	                	      }
    	       	                	    });

    	       	                	    modalInstance.result.then(function (selectedItem) {
    	       	                	      $scope.selected = selectedItem;
    	       	                	      $scope.loading = false;
    	       	                	    }, function () {
    	       	                	      $log.info('Modal dismissed at: ' + new Date());
    	       	                	    });
    	       	                	    
    	            	          }).error(function(data, status, headers, config) {
    	            	        	  $scope.errorMsg = getErrorMsg(status, data);
    	            	          });
    	                	  }
    	                	  
    	                	  $scope.openSQLURLWin = function (r) {
    	                		  console.log(r.triggerMode);
    	                		  $http({
    	            	              method : 'GET',
    	            	              url : "rest/sa/getPubSQL/" + $scope.env +'/' + r.triggerMode
    	            	          }).success(function(data, status, headers, config) {
    	            	          		console.log("In success ");
    	            	          		$scope.loading = false;
    	            	          		console.log(data);
    	            	          		window.open(data);
    	       	                	    
    	            	          }).error(function(data, status, headers, config) {
    	            	        	  $scope.errorMsg = getErrorMsg(status, data);
    	            	          });
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
    	                	        	console.log(getErrorMsg(status, data))
    	                	        });
    	                	    }
    	                	    $scope.getLoggedInUser();
    	                	 
                                          
}]);

SADiagApp.controller('ShowSQLModalInstanceCtrl', function ($scope, $modalInstance, $http, sql) {
	  $scope.sql = sql
	  
	  $scope.close = function () {
		  $modalInstance.dismiss('cancel');
	  };
});