sessionStorage.clickedTabId = 'liTrends';
SADiagApp.controller('SrcTrendBarchartController', ['$scope', '$uibModal', '$http', '$log', function($scope, $uibModal, $http, $log) {
	     $scope.error = false;
	     $scope.loading = false;
	     $scope.selEntities=[];
	     $scope.selSrcPatterns=[];
	     $scope.entities=[];
    	 $scope.xAxisTickFormatFunction = function(){
             return function(d){
                 return d3.time.format('%b')(new Date(d));
             }
         }
    	 		$scope.xFunction = function(){
    	      				return function(d){
    	      					return d[0];
    	      				};
    	      			}

    	                  $scope.xAxisTickFormatFunction = function(){
    	                	  return function(d){
    	                    	  var dplus1 = parseInt(d) + 1;
    	                    	  return (d + ' - ' + dplus1);
    	                      }
    	                  }
    	                  
    	                  $scope.yAxisTickFormatFunction = function(){
    	                      return function(d){
    	                          return d3.format('d')(d);
    	                      }
    	                  }
    	                  
    	                  $scope.yFunction = function(){
        	      				return function(d){
        	      					return parseInt(d[1]) 
        	      				};
        	      		  }

    	                  /*var colorCategory = d3.scale.category20b()
    	                  $scope.colorFunction = function() {
    	                      return function(d, i) {
    	                          return colorCategory(i);
    	                      };
    	                  }*/
    	      			/*var colorArray = ['#1f601f', '#990000', '#595959','#cccccc'];
	   	                  $scope.colorFunction = function() {
	   	                  	return function(d, i) {
	   	                      	return colorArray[i];
	   	                  	};
	   	                  }*/
 	                 

    	                  $scope.toolTipContentFunction = function(){
    	                      return function(key, x, y, e, graph) {
    	                              return  '' +
    	                              '<p>' + key + '</p>' +
    	                              '<p>' +  x + ' : ' + y + '</p>'
    	                      }
    	                  }
    	                  
    	                  $scope.getSrcData = function () {
    	                	  if($scope.selSrcPatterns.length==0) 
    	                		  return;
    	                	  $scope.loading = true;
    	                	  $http({
		            	              method : 'GET',
		            	              url : "rest/sa/getSrcPatternTimeTrend/" + $scope.env +'/'+ $scope.selSrcPatterns + '/' + $scope.fromDt + '/' + $scope.toDt
		            	          }).success(function(data, status, headers, config) {
		            	          		console.log("In success ");
		            	          		console.log(data);
		            	                  $scope.srcData = data;
		            	                  $scope.loading = false;
		            	          }).error(function(data, status, headers, config) {
		            	          	console.log("In Error ");
		            	          	$scope.loading = false;
		            	          	$scope.errorMsg = getErrorMsg(status, data);
		            	          });
    	                  }
    	                  
	                	  $scope.dt = dt;
	                	  $scope.env = env;
	                	  $scope.patternFilter=patternFilter;
	                	  
	                	  var date1 = new Date();
	                	  date1.setDate(date1.getDate() -1);
	                	  var date2 = new Date();
	                	  date2.setDate(date2.getDate() -30);
	                	  
	                	  $scope.fromDt = date2;
	                	  $scope.toDt = date1;
	                	  
	  	                  $scope.$watch('fromDt', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		 $scope.getSrcData();
	  	                	  }
	  	                  });
	  	                  $scope.$watch('toDt', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		 $scope.getSrcData();
	  	                	  }
	  	                  });
	  	                  $scope.$watch('env', function (newValue, oldValue) {
	  	                	  console.log('In env watch');
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		$scope.getSrcData();
	  	                		sessionStorage.env = $scope.env;
	  	                		console.log(sessionStorage.env);
	  	                	  }
	  	                  });
	  	                  $scope.$watch('patternFilter', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		$scope.getSrcData();
	  	                		sessionStorage.patternFilter = $scope.patternFilter;
	  	                	  }
	  	                  });
	  	                $scope.$watch('selEntities', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		$scope.getSrcFilePattern();
	  	                	  }
	  	                  });
	  	                
	  	                $scope.$watch('selSrcPatterns', function (newValue, oldValue) {
	  	                	if(newValue != undefined && oldValue != newValue) {
	  	                		$scope.getSrcData();
	  	                	  }
	  	                });
    	      			var format = d3.format(',.2f');
    	                  $scope.valueFormatFunction = function(){
    	                  	return function(d){
    	                  		return format(d);
    	                  	}
    	                  }
    	                  
    	                 
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
    	                	    console.log('In Opened');
    	                	  };
    	                	  $scope.openTo = function($event) {
     	                		 $event.preventDefault();
     	                	     $event.stopPropagation();
     	                	    $scope.statusTo.opened = true;
     	                	    console.log('In Opened');
     	                	  };
    	                	  
    	                	  $scope.statusFrom = {
    	                		opened: false
    	                	  };
    	                	  $scope.statusTo = {
    	    	                opened: false
    	    	               };
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
  		    	             			$scope.getSrcEntities();
  		    	             		  }, function errorCallback(response) {
  		    	             		     console.log("error")
  		    	             		     console.log(getErrorMsgResponse(response));
  		    	             		  }); 
  	 	                	  }
    	                	  $scope.getSrcEntities = function() {
    	                		  $scope.selSrcPatterns=[];
    	                		  $scope.srcPatterns=[];
    	                		  $http({
    	                			  method: 'GET',
    	                			  url: 'rest/sa/getDistinctSrcEntityTypes/' + $scope.env +'/'+ $scope.patternFilter + '/' + $scope.fromDt + '/' + $scope.toDt
    	                		}).then(function successCallback(response) {
    	                			//console.log(response.data);
    	                			$scope.entities = response.data;
    	                			//console.log($scope.entities.length);
    	                		  }, function errorCallback(response) {
    	                		    console.log("error");
    	                		    $scope.errorMsg = getErrorMsgResponse(response);
    	                		  }); 
    	                	  }
    	                	  
    	                	  $scope.getSrcFilePattern = function() {
    	                		  $scope.selSrcPatterns=[];
    	                		  $http({
    	                			  method: 'GET',
    	                			  url: 'rest/sa/getSrcFilePattern/' + $scope.env +'/'+ $scope.patternFilter + '/'+ $scope.selEntities + '/' + $scope.fromDt + '/' + $scope.toDt
    	                		}).then(function successCallback(response) {
    	                			//console.log(response.data);
    	                			$scope.srcPatterns = response.data;
    	                			//console.log($scope.srcPatterns.length);
    	                		  }, function errorCallback(response) {
    	                		    console.log("error");
    	                		    $scope.errorMsg = getErrorMsgResponse(response);
    	                		  }); 
    	                	  }
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
    	                	        	console.log(getErrorMsg(data, status));
    	                	        });
    	                	    }
    	                	    $scope.getLoggedInUser();
    	                	                          
}]);
