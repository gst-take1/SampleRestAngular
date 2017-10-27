sessionStorage.clickedTabId = 'liEnv';
SADiagApp.controller('MonitorController', ['$scope', '$uibModal', '$http', '$log', '$interval', function($scope, $uibModal, $http, $log,  $interval) {
		 $scope.graphDataRows = [];
    	 $scope.xAxisTickFormatFunction = function(){
             return function(d){
                 return d3.time.format('%b')(new Date(d));
             }
         }
    	 $scope.noDataData = [
    	                      {
    	                          "key": "Series 1",
    	                          "values": [ ]
    	                      }
    	                  ];

    	                 
    	      			$scope.xFunction = function(){
    	      				return function(d){
    	      					return d[0];
    	      				};
    	      			}

    	                  $scope.xAxisTickFormatFunction = function(){
    	                      return function(d){
    	                          return d3.time.format('%b')(new Date(d));
    	                      }
    	                  }
    	                  
    	                  $scope.yAxisTickFormatFunction = function(){
    	                      return function(d){
    	                          return d3.format('d')(d);
    	                      }
    	                  }

    	      			$scope.yFunction = function(){
    	      				return function(d){
    	      					var intD = parseInt(d[1]);
    	      					if(intD > 1440)
    	      						return 1440;
    	      					return intD;
    	      				};
    	      			}

    	                  var colorCategory = d3.scale.category20b()
    	                  $scope.colorFunction = function() {
    	                      return function(d, i) {
    	                          return colorCategory(i);
    	                      };
    	                  }

    	                  $scope.toolTipContentFunction = function(){
    	                      return function(key, x, y, e, graph) {
    	                              return  '' +
    	                              '<p>' + key + '</p>' +
    	                              '<p>' +  x + ' : ' + y + '</p>'
    	                      }
    	                  }
    	                  
    	                  
    	                 $scope.getXAxisLabel = function () {
    	                	  return function(index){
    	                		  var entity;
    	                		  switch(index) {
    	                		  case "0":
    	                			  entity = "Identity New Src File (lmag)";
    	                			  break;
    	                		  case "1":
    	                			  entity = "Start Adapter (gtln)";
    	                			  break;
    	                		  case "2":
    	                			  entity = "Run Adapter (informatica)";
    	                			  break;
    	                		  case "3":
    	                			  entity = "Run Adapter (universal)";
    	                			  break;
    	                		  case "4":
    	                			  entity = "Direct Load (iib)";
    	                			  break;
    	                		  case "5":
    	                			  entity = "Indirect Load (iib)";
    	                			  break;
    	                		  case "6":
    	                			  entity = "Loader Service (warehouse)";
    	                			  break;
    	                		  case "7":
    	                			  entity = "Publish (iib)";
    	                			  break;    	             
    	                		  default:
    	                			  entity = "DefaultLabel";
    	                		  }
    	                		  return entity;
    	                      }
    	                  }
    	                  
    	                  
    	                  $scope.items = ['item1', 'item2', 'item3'];
    	                  
    	                  $scope.$on('elementClick.directive', function(angularEvent, event) {
    	                	  console.log(angularEvent);
    	                	  console.log(event);
    	                	  
    	                	  /*$http({
	            	              method : 'GET',
	            	              url : "rest/sa/barchart/pubs/"+event.series.key+'/'+event.pointIndex
	            	          }).success(function(data, status, headers, config) {
	            	          		console.log("In success ");
	            	          		console.log(data);
	            	          		 $scope.items = data;
	            	          		 
	            	          		/* var modalInstance = $modal.open({
	       	                	      animation: 'true',
	       	                	      templateUrl: 'myModalContent.html',
	       	                	      controller: 'ModalInstanceCtrl',
	       	                	      size: 'lg',
	       	                	      resolve: {
	       	                	        items: function () {
	       	                	          return $scope.items;
	       	                	        }
	       	                	      }
	       	                	    });

	       	                	    modalInstance.result.then(function (selectedItem) {
	       	                	      $scope.selected = selectedItem;
	       	                	    }, function () {
	       	                	      $log.info('Modal dismissed at: ' + new Date());
	       	                	    });*/
	       	                	    
	            	          /*}).error(function(data, status, headers, config) {
	            	                  // called asynchronously if an error occurs
	            	                  // or server returns response with an error status.
	            	          	console.log("In Error ");
	            	          	console.log(data)
	            	          });*/
    	                	  
    	                	 
    	                	    
    	                });
    	                  
    	      			var format = d3.format(',.2f');
    	                  $scope.valueFormatFunction = function(){
    	                  	return function(d){
    	                  		return format(d);
    	                  	}
    	                  }
    	                  
    	                  $scope.getLoggedInUser = function() {
    	                	  $http({
	            	              method : 'GET',
	            	              url : "rest/sa/getLoggedInUser"
	            	          }).success(function(data, status, headers, config) {
	            	          		//console.log("In success ");
	            	          		console.log(data);
	            	                  $scope.loggedInUser = data;
	            	                  //$scope.initGrid();
	            	          }).error(function(data, status, headers, config) {
	            	          	console.log("In Error ");
	            	          	console.log(data);
	            	          	console.log(getErrorMsg(status, data));
	            	          });
    	                  }
    	                  $scope.getAllEnvs = function() {
    	                	 	console.log('getAllEnvs');
	    	             		$http({
	    	             			  method: 'GET',
	    	             			  url: 'rest/sa/getEnvs'
	    	             		}).then(function successCallback(response) {
	    	             			console.log(response.data);
	    	             			$scope.allEnvs = response.data;
	    	             			var sqRoot = Math.sqrt($scope.allEnvs.length);
	    	             			$scope.rows = Math.round(sqRoot);
	    	             			$scope.cols = Math.ceil(sqRoot);
	    	             			$scope.tdWidth = $scope.cols > 1 ? Math.round(1800/$scope.cols) : 1200;
	    	             			$scope.tdHeight = $scope.rows> 1 ? Math.round(700/$scope.rows) : 700;
	    	             			
	    	             			$scope.graphDataRows = new Array();
	    	             			//$scope.graphData = new Array($scope.cols);
	    	             			for(var i =0; i < $scope.rows; i++) {
	    	             				$scope.graphDataRows[i] = new Array();
	    	             			}
	    	             			console.log($scope.graphDataRows);
	    	             			for(var i =0; i < $scope.rows; i++) {
	    	             				//$scope.graphDataRows[i] = [];
	    	             				console.log($scope.graphDataRows[i]);
	    	             				for(var j =0; j < $scope.cols; j++) {	    	             					
	    	             					var index = i*$scope.cols + j;    	             					
	    	             					if(index < $scope.allEnvs.length) {
	    	             						console.log($scope.allEnvs[index]);
	    	             						console.log(" I " +i + " J " + j);
	    	             						$scope.getGraphData($scope.allEnvs[index], i, j)
	    	        
	    	             						
	    	             					}
	    	             					
	    	    	    	             					
	    	             				}
	    	             			}
	    	             			
	    	             		  }, function errorCallback(response) {
	    	             		    console.log("error");
	    	             		   console.log(getErrorMsgResponse(response));
	    	             		  }); 
	    	              }
    	                  
    	                  $scope.getGraphData = function (env, i, j) {
    	                	  console.log(env);
    	                	  $http({
		            	              method : 'GET',
		            	              url : "rest/sa/monitor/getEnvData/" + env
		            	          }).success(function(data, status, headers, config) {
		            	          		console.log("In success ");
		            	          		console.log(data);
		            	          		$scope.graphDataRows[i][j] = data
		            	                  //$scope.initGrid();
		            	          }).error(function(data, status, headers, config) {
		            	                  // called asynchronously if an error occurs
		            	                  // or server returns response with an error status.
		            	          	console.log("In Error ");
		            	          	console.log(data);
		            	          	console.log(getErrorMsg(status, data));
		            	          });
    	                  }
    	                  $scope.getLoggedInUser();
    	                  $scope.getAllEnvs();
}]);