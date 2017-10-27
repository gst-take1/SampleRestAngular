sessionStorage.clickedTabId = 'liTgr';
SADiagApp.controller('PubToSrcPatternController', ['$scope', '$uibModal', '$http', '$log', function($scope, $modal, $http, $log) {
     
						  $scope.srcFilesLoading = false;
						  $scope.initialPageSize = 200;
						  $scope.error = false;

	                	  $scope.env = env;
	                	  $scope.patternFilter = patternFilter;
	                	  $scope.pubsHardCoded = ['Position_CashComponentNetPosition_1.0_YYYYMMDDTHHMISS_Full.dat', 'CorporateAction_CorporateActionEventsCancelled_1.0_YYYYMMDDTHHMISS_Update.dat',
	                	                          'CorporateAction_CorporateActionEventsPosted_1.0_YYYYMMDDTHHMISS_Update.dat', 'Pricing_FXRate_CurrentDayLondon4pmForwardPoints_2.0_YYYYMMDDTHHMISS.dat'];
	  	                  $scope.$watch('env', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		$scope.getPubSrcPattern();
	  	                		sessionStorage.env = $scope.env;
	  	                	  }
	  	                  });
	  	                  
    	                	  $scope.initGrid = function() {
    	                			//console.log('in initGrid')
    	                	        $scope.columnDefinitionsSrcFiles =[
    	                	           
    	                	            {
    	                	                Name: 'pubPattern',
    	                	                DisplayName: 'Publicaton File Pattern',
    	                	                width: '50%'
    	                	            },
    	                	            {
                                            Name: 'srcPattern',
                                            DisplayName: 'Triggered by Source File Pattern',
                                            width: '50%'
                                        },                            	                	            
    	                	        ];
    	                	  }
    	                	  
    	                	  $scope.getPubSrcPattern = function () {
    	                		  console.log('in getPubSrcFiles');
    	                		  $scope.srcFiles = [];
    	                		  $scope.srcFilesLoading = true;
    	                          $http({
    	                                  method : 'GET',
    	                                  url : "rest/sa/pubSrcPattern/" + $scope.env
    	                          }).success(function(data, status, headers, config) {
    	                          		//console.log("In success ");
    	                          		console.log(data);
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
  	    	             			  url: 'rest/sa/getEnvs'
  	    	             		}).then(function successCallback(response) {
  	    	             			//console.log(response.data);
  	    	             			$scope.allEnvs = response.data
  	    	             			if(!$scope.env) 
  	    	             				$scope.env = $scope.allEnvs[0];
  	    	             			$scope.getPubSrcPattern();
  	    	             		  }, function errorCallback(response) {
  	    	             			console.log(getErrorMsgResponse(response));
  	    	             		  }); 
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
    	                	        	console.log(getErrorMsg(data, status));
    	                	        });
    	                	    }
    	                	    $scope.getLoggedInUser();
                                          
}]);