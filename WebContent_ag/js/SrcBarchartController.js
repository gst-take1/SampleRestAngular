sessionStorage.clickedTabId = 'liMonSrc';
SADiagApp.controller('SrcBarchartController', ['$scope', '$uibModal', '$http', '$log', function($scope, $uibModal, $http, $log) {
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

    	                  /*var colorCategory = d3.scale.category20b()
    	                  $scope.colorFunction = function() {
    	                      return function(d, i) {
    	                          return colorCategory(i);
    	                      };
    	                  }*/
    	      			var colorArray = ['#1f601f', '#990000', '#595959','#cccccc'];
	   	                  $scope.colorFunction = function() {
	   	                  	return function(d, i) {
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
    	                  
    	                 
    	                 /*$scope.getXAxisLabel = function () {
    	                	  return function(index){
    	                		  var entity;
    	                		  switch(index) {
    	                		  case 0:
    	                			  entity = "Classification";
    	                			  break;
    	                		  case 1:
    	                			  entity = "CorporateAction";
    	                			  break;
    	                		  case 2:
    	                			  entity = "Issuer";
    	                			  break;
    	                		  case 3:
    	                			  entity = "Other";
    	                			  break;
    	                		  case 4:
    	                			  entity = "Party";
    	                			  break;
    	                		  case 5:
    	                			  entity = "PortfolioAccount";
    	                			  break;
    	                		  case 6:
    	                			  entity = "Position";
    	                			  break;
    	                		  case 7:
    	                			  entity = "Pricing";
    	                			  break;
    	                		  case 8:
    	                			  entity = "Rating";
    	                			  break;
    	                		  case 9:
    	                			  entity = "SecurityReference";
    	                			  break;
    	                		  case 10:
    	                			  entity = "Transaction";
    	                			  break;
    	                		  default:
    	                			  entity = "DefaultLabel";
    	                		  }
    	                		  return entity;
    	                      }
    	                  }*/
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
	    	             			$scope.getSrcData();
	    	             		  }, function errorCallback(response) {
	    	             		    console.log("error");
	    	             		   getErrorMsgResponse(response)
	    	             		  }); 
 	                	  }
    	                  $scope.getSrcData = function () {
    	                	  $scope.loading = true;
    	                	  $http({
		            	              method : 'GET',
		            	              url : "rest/sa/barchart/src/" + $scope.env +'/' + $scope.dt + '/' + $scope.patternFilter
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
    	                  
    	                  $scope.items = ['item1', 'item2', 'item3'];
    	                  
    	                  $scope.$on('elementClick.directive', function(angularEvent, event) {
    	                	  $scope.loading = true;
    	                	  console.log(angularEvent);
    	                	  console.log(event);
    	                	  $http({
	            	              method : 'GET',
	            	              url : "rest/sa/barchart/srcDataPerSeries?env=" + $scope.env +'&key=' +event.series.key+'&entity='+event.series.values[event.pointIndex][0] + '&dt=' + $scope.dt + '&patternFilter=' +$scope.patternFilter
	            	          }).success(function(data, status, headers, config) {
	            	          		console.log("In success ");
	            	          		$scope.loading = false;
	            	          		console.log(data);
	            	          		 $scope.items = data;
	            	          		  
	            	          		 var modalInstance = $uibModal.open({
	       	                	      animation: 'true',
	       	                	      templateUrl: 'myModalContent.html',
	       	                	      controller: 'SrcBarchartModalInstanceCtrl',
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
	            	                  // called asynchronously if an error occurs
	            	                  // or server returns response with an error status.
	            	          	console.log("In Error ");
	            	          	console.log(data);
	            	          	$scope.errorMsg = getErrorMsg(status, data);
	            	          	$scope.loading=false;
	            	          });
    	                	  
    	                	 
    	                	    
    	                });
    	                  /* $scope.today = function() {
	                	    $scope.dt = new Date();
	                	    console.log(dt);
	                	    console.log($scope.dt);
	                	    //$scope.dt.setDate($scope.dt);
	                	  };*/
    	                  $scope.getAllEnvs();
	                	  $scope.dt = dt;
	                	  console.log(sessionStorage.env);
	                	  $scope.env = env;
	                	  $scope.patternFilter=patternFilter;
	                	  
	  	                  $scope.$watch('dt', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		 $scope.getSrcData();
	  	                		 sessionStorage.dt = $scope.dt;
	  	                	  }
	  	                  });
	  	                  $scope.$watch('env', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		$scope.getSrcData();
	  	                		sessionStorage.env = $scope.env;
	  	                	  }
	  	                  });
	  	                  $scope.$watch('patternFilter', function (newValue, oldValue) {
	  	                	  if(newValue != undefined && oldValue != newValue) {
	  	                		$scope.getSrcData();
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
    	                	    console.log('In Opened');
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
SADiagApp.controller('SrcBarchartModalInstanceCtrl', function ($scope, $modalInstance, $http, items, env, dt) {
	  $scope.error = false;
	  $scope.items = items;
	  $scope.detailOpen = [];
	  $scope.loadingDetail = [];
		 
	  $scope.relatedSrcFiles = [];
	  
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
 		 console.log(index);
 		 $scope.detailOpen[index] = !$scope.detailOpen[index];
 		 console.log($scope.detailOpen[index]);
 		 console.log($scope.relatedSrcFiles[index]);
 		 if($scope.relatedSrcFiles[index] == null) {
 			$scope.loadingDetail[index] = true;
	 		 $http({
	             method : 'GET',
	             url : "rest/sa/barchart/srcDetails/" + env +'/' +$scope.items[index] + '/' + dt
	         }).success(function(data, status, headers, config) {
	         		console.log("In success ");
	         		console.log(data);
	         		 $scope.relatedSrcFiles[index] = data;	
	         		 $scope.loadingDetail[index] = false;
	         }).error(function(data, status, headers, config) {
	                 // called asynchronously if an error occurs
	                 // or server returns response with an error status.
	         	console.log("In Error ");
	         	$scope.errorMsg = getErrorMsg(status, data);
	         	$scope.loadingDetail[index] = false;
	         });
 		 }
 	 };
 	 
	});
