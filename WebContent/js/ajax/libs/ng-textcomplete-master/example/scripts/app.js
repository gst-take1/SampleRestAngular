angular.module('textcompleteApp', ['ngTextcomplete'])

.controller('textcompleteCtrl', ['$scope', function($scope) {
  $scope.members = ['fraserxu', 'Fraser', 'github', 'ng-textcomplete', 'jquery', 'wiredcraft', 'devops'];
}])

.directive('textcomplete', ['Textcomplete', function(Textcomplete) {
    return {
        restrict: 'EA',
        scope: {
            members: '=',
            message: '='
        },
        template: '<textarea ng-model=\'message\' type=\'text\'></textarea>',
        link: function(scope, iElement, iAttrs) {
        	console.log("in link");
            var mentions = scope.members;
            var ta = iElement.find('textarea');
            var textcomplete = new Textcomplete(ta, [
              {
                //match: /(^|\s)@([\w\-]*)$/,
            	  match: /\b(\w{2,})$/,
            	 // match: /(\w)*(\w{2,})$/,
                search: function(term, callback) {
                	console.log(term);
                    callback($.map(mentions, function(mention) {
                    	console.log(mention);
                        return mention.toLowerCase().indexOf(term.toLowerCase()) != -1 ? mention : null;
                    }));
                },
                //index: 2,
                index: 1,
                replace: function(mention) {
                    //return '$1@' + mention + ' ';
                	return mention + ' ';
                }
              }
            ]);

            $(textcomplete).on({
              'textComplete:select': function (e, value) {
            	  console.log("in textComplete:select");
                scope.$apply(function() {
                  scope.message = value
                })
              },
              'textComplete:show': function (e) {
            	  console.log("in textComplete:show");
                $(this).data('autocompleting', true);
              },
              'textComplete:hide': function (e) {
            	  console.log("in textComplete:hide");
                $(this).data('autocompleting', false);
              }
            });
        }
    }
}])

;