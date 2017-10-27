var URLBuilderApp = angular.module('URLBuilderApp', ['ui.bootstrap','ngTextcomplete','ngSanitize','expressionBuilder','eventBuilder'])
.directive('textcomplete', ['Textcomplete', function(Textcomplete) {
    return {
        restrict: 'EA',
        scope: {
            members: '=',
            message: '=',
            placeholder: '@',
            ngRequired: '@',
            rows: '@',
            name: '@message'	
        },
        template: '<textarea ng-model=\'message\' type=\'text\' name={{name}} rows={{rows}} class="form-control" placeholder={{placeholder}} ng-required={{ngRequired}}></textarea>',
        link: function(scope, iElement, iAttrs) {
        	//console.log("in link");
            var mentions = scope.members;
            var ta = iElement.find('textarea');
            var textcomplete = new Textcomplete(ta, [
              {
                //match: /(^|\s)@([\w\-]*)$/,
            	  //match: /\b(\S{1,})$/,
            	  //match: /(\S+)$/,
            	  match: /(\w+|=|>|<|!)$/,
            	 // match: /(\w)*(\w{2,})$/,
                search: function(term, callback) {
                	//console.log(term);
                    callback($.map(mentions, function(mention) {
                    	//console.log(mention);
                        return mention.toLowerCase().indexOf(term.toLowerCase()) != -1 ? mention : null;
                    }));
                },
                //index: 2,
                index: 1,
                replace: function(mention) {
                    //return '$1@' + mention + ' ';
                	//console.log("Match REplace " + mention)
                	return mention.indexOf('[') > 0 ? mention.substr(0, mention.indexOf('[')) + ' ' : mention + ' ';
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
}]);

function getErrorMsgResponse(response) {
	return "An Error Occured. Server responded with Status " + response.status + " - " +response.statusText + "<br>" + " Reason: " + response.data
}

function getErrorMsg(status, data) {
	return "An Error Occured. Server responded with Status " + status + "<br>" + " Reason: " + data
}


