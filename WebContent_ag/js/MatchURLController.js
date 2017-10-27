SADiagApp1.controller('MatchURLController',  ['$scope', '$http', '$log', '$filter', 'ngTableParams', function($scope, $http, $log, $filter, ngTableParams) {
	//this.tableParams = new NgTableParams({}, {dataset: $scope.URLData})
	$scope.env='Dev2';
	
	 $scope.getURLData = function () {
   	  $http({
	              method : 'GET',
	              url : "rest/sa/matchURL/" + $scope.env
	          }).success(function(data, status, headers, config) {
	          		//console.log("In success ");
	          		//console.log(data);
	                  $scope.URLData = data;
	          }).error(function(data, status, headers, config) {
	                  // called asynchronously if an error occurs
	                  // or server returns response with an error status.
	          	//console.log("In Error ");
	          	//console.log(data)
	          });
     }
	 $scope.getURLData();
	}]);