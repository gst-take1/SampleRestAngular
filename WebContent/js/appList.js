var URLBuilderApp = angular.module('URLBuilderApp', ['ui.bootstrap','ngSanitize'])
.factory('exportQT', ['$http', function ($http) {

	return {
		exportQueryTemplate: function (tKeys) {
	        var selectedRows = [];
	        for (var i = 0; i < tKeys.length; i++) {
	            if (tKeys[i].isSelected) {
	            	selectedRows.push(tKeys[i]);
	            }
	        }
	        var qtemplates = [];
	        $http.post(
	  			  'qb/builder/getQueryTemplatesFromKeys',
	  			selectedRows
	  		).then(function successCallback(response) {
	  			qtemplates = response.data;
	  			var blobObject = new Blob([angular.toJson(qtemplates)]);
		        window.navigator.msSaveBlob(blobObject, 'QueryTemplates_'+ Date.now() +'.json');      
	  		  }, function errorCallback(response) {
	  		    console.log("error")
	  		  }); 
	             
		},
		exportPubTemplate: function (tKeys) {
	        var selectedRows = [];
	        for (var i = 0; i < tKeys.length; i++) {
	            if (tKeys[i].isSelected) {
	            	selectedRows.push(tKeys[i]);
	            }
	        }
	        var qtemplates = [];
	        $http.post(
	  			  'qb/pubBuilder/getPubTemplatesFromKeys',
	  			selectedRows
	  		).then(function successCallback(response) {
	  			qtemplates = response.data;
	  			var blobObject = new Blob([angular.toJson(qtemplates, true)]);
		        window.navigator.msSaveBlob(blobObject, 'PubTemplates_'+ Date.now() +'.json');      
	  		  }, function errorCallback(response) {
	  		    console.log("error")
	  		  }); 
	             
		},
		toggleSelectAll: function ($scope) {
	    	$scope.anyRowSelected = $scope.selectAll;
	    	for(var i =0; i <$scope.queryTemplateKeysData.length; i++) {
	    		$scope.queryTemplateKeysData[i].isSelected = $scope.selectAll
	    	}
	    	$scope.updateAnyRowSelected();
	    },
	    updateAnyRowSelected: function ($scope) {
	    	var selectedCount = 0; var anySelected = false; $scope.oneRowSelected = false;
	    	$scope.openExecute = false;
	    	$scope.params = '';
	    	$scope.executeErrorMsg = '';
	    	for(var i =0; i <$scope.queryTemplateKeysData.length; i++) {
	    		if($scope.queryTemplateKeysData[i].isSelected) {
	    			anySelected = true;
	    			selectedCount++;
	    		}
	    	}
	    	$scope.anyRowSelected = anySelected;
	    	console.log(selectedCount);
	    	if(selectedCount == 1)
	    		$scope.oneRowSelected = true;
	    }
	}
}
]);

function getErrorMsgResponse(response) {
	return "An Error Occured. Server responded with Status " + response.status + " - " +response.statusText + "<br>" + " Reason: " + response.data
}

function getErrorMsg(status, data) {
	return "An Error Occured. Server responded with Status " + status + "<br>" + " Reason: " + data
}