sessionStorage.clickedTabId = '';
URLBuilderApp.controller('IndexController', function($scope, $http) {
	$scope.getLoggedInUser = function() {
  	  $http({
            method : 'GET',
            url : "qb/builder/getLoggedInUser"
        }).then(function successCallback(response) {
                $scope.loggedInUser = response.data;
        	}, function errorCallback(response) {
        	getErrorMsgResponse(response);
        });
    }
    $scope.getLoggedInUser();
});