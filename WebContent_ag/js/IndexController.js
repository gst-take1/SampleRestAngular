sessionStorage.clickedTabId = '';
SADiagApp.controller('IndexController', function($scope, $http) {
	$scope.getAllEnvs = function() {
   	 	console.log('getAllEnvs');
    		$http({
    			  method: 'GET',
    			  url: 'rest/sa/getSchedRulesEnvs'
    		}).then(function successCallback(response) {
    			console.log(response.data);
    		  }, function errorCallback(response) {
    		     console.log("error");
    		     console.log(response.data);
    		     console.log(response.status);
    		     $scope.errorMsg = //"<strong>Error!</strong> Action could not be completed. Server responded with error code " + response.status;
    		    	 getErrorMsgResponse(response);
    		  }); 
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
        	$scope.errorMsg = //"<strong>Error!</strong> Action could not be completed. Server responded with error code " + status;
        		getErrorMsg(status, data);
        });
    }
    $scope.getLoggedInUser();
});