sessionStorage.clickedTabId = 'liMonPub';
SADiagApp.controller('PubBarchartController', ['$scope', '$uibModal', '$http', '$log', function($scope, $uibModal, $http, $log) {
     	 $scope.error = false;
     	 $scope.loading = false;
     	 
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
    	      					return parseInt(d[1]) 
    	      				};
    	      			}

    	      			var colorArray = ['#1f601f','#cc6600', '#990000', '#595959','#cccccc'];
	   	                  $scope.colorFunction = function() {
	   	                  	return function(d, i) {
	   	                  		//console.log(d); console.log(i);
	   	                      	return colorArray[i];
	   	                  	};
	   	                  }
   	                 
    	                  $scope.toolTipContentFunction = function(){
    	                      return function(key, x, y, e, graph) {
    	                              return  '' +
    	                              '<p>' + key + '</p>' +
    	                              '<p>' +  x + ' : ' + y + '</p>'
    	                      }
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
	    	             			$scope.getPubData();
	    	             		  }, function errorCallback(response) {
	    	             		    console.log("error");
	    	             		    console.log(getErrorMsgResponse(response));
	    	             		  }); 
	    	             	  }
    	                  
    	                  $scope.getPubData = function () {
    	                	  $scope.loading = true;
    	                	  $http({
		            	              method : 'GET',
		            	              url : "rest/sa/barchart/" + $scope.env +'/' + $scope.dt + '/' +$scope.patternFilter
		            	          }).success(function(data, status, headers, config) {
		            	          		//console.log("In success ");
		            	          		  console.log(data);
		            	                  $scope.pubData = data;
		            	                  $scope.loading = false;
		            	                  //$scope.initGrid();
		            	          }).error(function(data, status, headers, config) {
		            	        	  $scope.loading = false;
		            	        	  $scope.errorMsg = getErrorMsg(status, data);
		            	          });
    	                  }
    	                  
    	                  $scope.items = ['item1', 'item2', 'item3'];
    	                  
    	                  $scope.$on('elementClick.directive', function(angularEvent, event) {
    	                	  //console.log(angularEvent);
    	                	  console.log(event);
    	                	  $http({
	            	              method : 'GET',
	            	              url : "rest/sa/barchart/pubDataPerSeries?env=" + $scope.env +'&key=' +event.series.key+'&entity='+event.series.values[event.pointIndex][0] + '&dt=' + $scope.dt + '&patternFilter=' +$scope.patternFilter
	            	          }).success(function(data, status, headers, config) {
	            	          		//console.log("In success ");
	            	          		//console.log(data);
	            	          		 $scope.items = data;
	            	          		  
	            	          		 var modalInstance = $uibModal.open({
	       	                	      animation: 'true',
	       	                	      templateUrl: 'myModalContent.html',
	       	                	      controller: 'ModalInstanceCtrl',
	       	                	      windowClass: 'app-modal-window',
	       	                	      //size: 'lg',
	       	                	      resolve: {
	       	                	        items: function () {
	       	                	          return $scope.items;
	       	                	        },
	       	                	        env: function () {
	       	                	        	return $scope.env;
	       	                	        },
	       	                	        dt: function () {
	       	                	        	return $scope.dt;
	       	                	        },
	       	                	        patternFilter: function () {
	       	                	        	return $scope.patternFilter;
	       	                	        }
	       	                	      }
	       	                	    });

	       	                	    modalInstance.result.then(function (selectedItem) {
	       	                	      $scope.selected = selectedItem;
	       	                	    }, function () {
	       	                	      $log.info('Modal dismissed at: ' + new Date());
	       	                	    });
	       	                	    
	            	          }).error(function(data, status, headers, config) {
	            	        	  $scope.errorMsg = getErrorMsg(status, data);
	            	          });
    	                	  
    	                	 
    	                	    
    	                });
    	                  /*$scope.today = function() {
  	                	    $scope.dt = new Date();
  	                	    console.log(dt);
  	                	    console.log($scope.dt);
  	                	    //$scope.dt.setDate($scope.dt);
  	                	  };*/
  	                	  $scope.dt = dt;
  	                	  $scope.env=env;
  	                	  $scope.patternFilter=patternFilter;
  	                	  $scope.getAllEnvs();

    	                  
    	                  
    	                  $scope.$watch('dt', function (newValue, oldValue) {
    	                	  if(newValue != undefined && oldValue != newValue) {
    	                		  $scope.getPubData();
    	                		  sessionStorage.dt = $scope.dt;
    	                	  }
    	                  });
    	                  $scope.$watch('env', function (newValue, oldValue) {
    	                	  if(newValue != undefined && oldValue != newValue) {
    	                		  $scope.getPubData();
    	                		  sessionStorage.env = $scope.env;
    	                	  }
    	                  });
    	                  $scope.$watch('patternFilter', function (newValue, oldValue) {
    	                	  if(newValue != undefined && oldValue != newValue) {
    	                		  $scope.getPubData();
    	                		  sessionStorage.patternFilter = $scope.patternFilter;
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
SADiagApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $http, items, env, dt, patternFilter) {

	  $scope.items = items;
	  $scope.detailOpen = [];
	  $scope.error = false;
	  $scope.relatedPubs = [];
	  
	  for(var i = 0; i < $scope.items.length; i++) {
			$scope.detailOpen[i] = false;
	  }
	  $scope.selected = {
	    item: $scope.items[0]
	  };

	  $scope.ok = function () {
		  $modalInstance.close($scope.selected.item);
	  };

	  $scope.cancel = function () {
		  $modalInstance.dismiss('cancel');
	  };
	  
	  $scope.toggleDetail = function (index) {
 		 //console.log(index);
 		 $scope.detailOpen[index] = !$scope.detailOpen[index];
 		 //console.log($scope.detailOpen[index]);
 		 //console.log($scope.relatedPubs[index]);
 		 if($scope.relatedPubs[index] == null) {
	 		 $http({
	             method : 'GET',
	             url : "rest/sa/barchart/pubsDetails?env=" + env +'&pattern=' +$scope.items[index] + '&dt=' + dt
	         }).success(function(data, status, headers, config) {
	         		//console.log("In success ");
	         		//console.log(data);
	         		 $scope.relatedPubs[index] = data;	          	    
	         }).error(function(data, status, headers, config) {
	                 $scope.errorMsg = getErrorMsg(status, data);
	         });
 		 }
 	 };
	});


