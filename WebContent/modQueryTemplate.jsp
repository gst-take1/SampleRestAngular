<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Query Builder</title>
<style>
</style>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./js/ajax/libs/jquery/1.11.3/jquery.min.js"></script> 
<script src="./js/ajax/libs/angular.js/1.5.3/angular.min.js"></script>
<script src="./js/ajax/libs/angular.js/1.5.3/angular-sanitize.min.js"></script>
<!-- angular animate -->
<script src="./js/ajax/libs/angular.js/1.5.0-beta.1/angular-animate.min.js"></script>
 <!-- bootstrap -->
<script src="./bootstrap-3.3.6-dist/js/bootstrap.min.js"></script>
<link rel="stylesheet" href="./bootstrap-3.3.6-dist/css/bootstrap.min.css">
<!-- angular-ui-bootstrap -->
<script src="./js/ajax/libs/angular-ui-bootstrap/0.14.2/ui-bootstrap-tpls.min.js"></script>
<script src="./js/ajax/libs/ng-textcomplete/ng-textcomplete.min.js"></script>

<link rel="stylesheet" href="./css/expressionBuilder.css">
<link rel="stylesheet" href="./css/app.css">
<script src="./js/expressionBuilder.js"></script>
<script src="./js/eventBuilder.js"></script>
<script src="./js/app.js"></script>
<script src="./js/ModQueryTemplateController.js"></script>

<script>
	var name = '<%= request.getParameter("name") %>';
	var owner = '<%= request.getParameter("owner") %>';
	var mode = '<%= request.getParameter("mode") %>';
</script>
<style>
body {
	padding-top:120px;
}
.panel-body {
	background:#F2FCFF;
}
.btn-success {
	background:#009973;
}
</style>
</head>
<body ng-app="URLBuilderApp" ng-controller="ModQueryTemplateController">
	<div ng-include src="'NavQuery.html'"></div>
	<div class="container-fluid">
		<form name="userForm" novalidate>
		<h5>Steps to build a Data Service Query Template and execute it for a sample output</h5>
		<div class="panel-group">
        	<div class="panel panel-info">
	            <div class="panel-heading">
	                <h4 class="panel-title">
	                    <a data-toggle="collapse"  href="#stepOne"><strong>1. Enter the Entity</strong></a>
	                </h4>
	            </div>
	            <div id="stepOne" class="panel-collapse collapse in">
	                <div class="panel-body">
	                    <div class="form-group"  ng-class="{ 'has-error' : userForm.entity.$invalid && !userForm.entity.$pristine }">
							<input type="text" ng-model="entity" name="entity"
								uib-typeahead="pubEntity for pubEntity in pubEntities | filter:$viewValue | limitTo:8"
								class="form-control" placeholder="CIM Publication Entity"
								typeahead-editable="false"
								typeahead-on-select="onSelectPubEntity($item, $model, $label)" required>
								<p ng-show="userForm.entity.$invalid && !userForm.entity.$pristine" class="help-block">Entity is required.</p>
						</div>
						<span class="help-block"><i>Try one of the following keywords:
								{{keywords.join(", ")}}</i></span>
						
						<div class="alert alert-danger ng-cloak" ng-show="step1Error">
							<a href="#" class="close" ng-click="step1Error = null" aria-label="close">&times;</a>
			 				<span ng-bind-html="step1Error"></span>
						</div>
	                </div>
	            </div>	            
	        </div>
		    <div class="panel panel-info">
	            <div class="panel-heading">
	                <h4 class="panel-title">
	                    <a data-toggle="collapse"  href="#stepTwo"><strong>2. Include or Exclude attributes from publication (Optional)</strong></a>
	                </h4>
	            </div>
	            <div id="stepTwo" class="panel-collapse collapse in">
	                <div class="panel-body">
	                    <div class="row">
							<div class="col-md-3">
								<label for="sel1">Include:</label> <select
									ng-model="selectedIncl" multiple class="form-control" size="10">
									<option ng-repeat="attr in incl" value="{{attr}}">{{attr}}</option>
								</select>
							</div>
							<div class="col-md-3">
								<br>
								<br>
								<br>
								<div class="text-center">
									<button class="btn btn-info" ng-click="shiftInclToExcl()">
										<span class="glyphicon glyphicon-circle-arrow-right"></span>
									</button>
								</div>
								<br>
								<div class="text-center">
									<button class="btn btn-info" ng-click="shiftExclToIncl()">
										<span class="glyphicon glyphicon-circle-arrow-left"></span>
									</button>
								</div>
							</div>
							<div class="col-md-3">
								<label for="sel2">Exclude:</label> <select
									ng-model="selectedExcl" multiple class="form-control" size="10">
									<option ng-repeat="attr in excl" value="{{attr}}">{{attr}}</option>
								</select>
							</div>
						</div>
						<p>
						 <div class="alert alert-danger ng-cloak" ng-show="step2Error">
						 	<a href="#" class="close" ng-click="step2Error = null" aria-label="close">&times;</a>
			 				<span ng-bind-html="step2Error"></span>
						 </div>
	                </div>               
	            </div>
	        </div>
	       	<div class="panel panel-info">
	            <div class="panel-heading">
	                <h4 class="panel-title">
	                    <a data-toggle="collapse"  href="#stepThree"><strong>3. Set Filter Conditions</strong></a>
	                </h4>
	            </div>
	            <div id="stepThree" class="panel-collapse collapse in">
	                <div class="panel-body">
	                	<label class="radio-inline"><input type="radio" ng-model="display" value="basic" ng-click='selectorToFilter()' ng-disabled='basicDisabled'>Basic</label>
						<label class="radio-inline"><input type="radio" ng-model="display" value="advanced">Advanced</label>
						<p></p>
	                	<div class="ng-cloak" ng-show="display == 'advanced'">
	                		<i>Selector (indented):</i><br> 
	                		<div class="alert alert-danger">						    	
							    	<span ng-bind-html="selectorFormattedAdv"></span>
								</div>
								 <div class="form-group"  ng-class="{ 'has-error' : userForm.selector.$invalid && !userForm.selector.$pristine }">
								 <textcomplete members='selectorAutoSuggest' message='selector' rows='6' placeholder='Create conditional statements like StringAttr1 = "Value1" AND DateAttr2 = Arg2' ng-required="true"></textcomplete>
									<p ng-show="userForm.selector.$invalid && !userForm.selector.$pristine" class="help-block">Selector is required.</p>
								</div>	
    							
    							<button class="btn btn-primary" name="parse" ng-click="parseSelector()" ng-disabled="!selector">parse</button>
    							<span class="help-block">Parameters</span>
    							<div class="form-group"  ng-show="display == 'advanced'">
								<div class="row">
		    							 	<div class="col-md-5">
		    									<label for="dataType">Data Type:</label> 
		    									<select	ng-model="dataType" class="form-control">
													<option ng-repeat="dataType in dataTypes" value="{{dataType}}">{{dataType}}</option>
												</select>
		    								</div>
		    								<div class="col-md-5">
		    									<label for="paramName">Parameter Name:</label> 
		    									<input type="text" class="form-control" ng-model="paramName" placeholder="Enter parameter Name"/>
		    								</div>
		    								<div class="col-md-1">
		    									<br>
		    									<button class="btn btn-primary" name="save" ng-click="saveArg()" ng-disabled="!paramName">Save</button>
		    								</div>
		    					 </div>
		    					 </div>   
    							<div class="form-group">
    							<table class="table table-hover table-condensed table-bordered table-striped">
                                     <thead>
                                     	<tr class="bg-success">
	                                        <td class="col-md-5">Data Type</td>
	                                        <td class="col-md-5">Parameter Name</td>
	                                        <td class="col-md-2"></td>
	                                         
                                    	</tr> 
                                    </thead>
                                    <tbody>
                                    	<tr ng-repeat="row in params">
								    		<td class="col-md-5">{{row.dataType}}</td>
								    		<td class="col-md-5">{{row.paramName}}</td>	
								    		<td class="col-md-2" ng-show="display == 'advanced'">&nbsp;
								    			<button class="btn btn-primary" ng-click="editArg($index)">Edit</button>&nbsp;
		          								<button class="btn btn-danger" ng-click="removeArg($index)">Delete</button>
								    		</td>
								    	</tr>
                                	</tbody>
                                </table>
                                </div>
                               
                          </div>
                          <div class="ng-cloak" ng-show="display == 'basic'">
                          		<i>Selector:</i><br> 
                                <div class="alert alert-danger">					    	
							    	<span ng-bind-html="selectorFormattedBasic"></span>
								</div>
	
								<expression-builder group="filter.group" fields="entityAttrs" comparison-op="comparisonOp" connective-op="connectiveOp" on-change-value-type="addDeleteParams(rule)"></expression-builder>
								
								<span class="help-block">Parameters</span>
    							<div class="form-group">
    							<table class="table table-hover table-condensed table-bordered table-striped">
                                     <thead>
                                     	<tr class="bg-success">
	                                        <td class="col-md-6">Data Type</td>
	                                        <td class="col-md-6">Parameter Name</td>
                                    	</tr> 
                                    </thead>
                                    <tbody>
                                    	<tr ng-repeat="row in params">
								    		<td class="col-md-5">{{row.dataType}}</td>
								    		<td class="col-md-5">{{row.paramName}}</td>	
								    	</tr>
                                	</tbody>
                                </table>
                                </div>                                
						</div>
						<div class="alert alert-danger ng-cloak" ng-show="step3Error">
                                 		<a href="#" class="close" ng-click="step3Error = null" aria-label="close">&times;</a>
						 				<span ng-bind-html="step3Error"></span>
						</div>
	                </div>
	            </div>	            
	        </div>
	        <div class="panel panel-info">
	            <div class="panel-heading">
	                <h4 class="panel-title">
	                    <a data-toggle="collapse"  href="#stepFour"><strong>4. Define Sort Order <i>(Optional)</i></strong></a>
	                </h4>
	            </div>
	            <div id="stepFour" class="panel-collapse collapse in">
	                <div class="panel-body">
    							<div class="form-group">
    							<div class="row">
    							 	<div class="col-md-5">
    									<label for="sortAttrName">Attribute Name:</label> 
    									<select	ng-model="sortAttrName" class="form-control">
											<option ng-repeat="attr in entityAttrs" value="{{attr.attrName}}">{{attr.attrName}}</option>
										</select>
    								</div>
    								<div class="col-md-5">
    									<label for="sortOrder">Sort Order:</label> 
    									<select	ng-model="sortOrder" class="form-control">
											<option ng-repeat="order in sortOrderTypes" value="{{order}}">{{order}}</option>
										</select>
    								</div>
    								<div class="col-md-2">
    									<br>
    									<button class="btn btn-primary" name="save" ng-click="saveSortBy()" ng-disabled="!sortAttrName">Save</button>
    								</div>
    							</div>
    							</div>
    							<div class="form-group">
    							<table class="table table-hover table-condensed table-bordered table-striped">
                                     <thead>
                                     	<tr class="bg-success">
                                     	 	<td class="col-md-5">Attribute Name</td>
	                                        <td class="col-md-5">Sort Order</td>	                                       
	                                        <td class="col-md-2"></td>
                                    	</tr> 
                                    </thead>
                                    <tbody>
                                    	<tr ng-repeat="row in sortBy">
                                    		<td class="col-md-5">{{row.attrName}}</td>
								    		<td class="col-md-5">{{row.order}}</td>								    		
								    		<td class="col-md-2">&nbsp;
								    			<button class="btn btn-primary" ng-click="editSortBy($index)">Edit</button>&nbsp;
		          								<button class="btn btn-danger" ng-click="removeSortBy($index)">Delete</button>
								    		</td>		
								    	</tr>
                                	</tbody>
                                </table>
                                </div>
                                 <div class="alert alert-danger ng-cloak" ng-show="step4Error">
                                 		<a href="#" class="close" ng-click="step4Error = null" aria-label="close">&times;</a>
						 				<span ng-bind-html="step4Error"></span>
								</div>
	                </div>
	            </div>	            
	        </div>
	        
	        <div class="panel panel-info">
	            <div class="panel-heading">
	                <h4 class="panel-title">
	                    <a data-toggle="collapse"  href="#stepFive"><strong>5. Test Execute the Query</strong></a>
	                </h4>
	            </div>
	            <div id="stepFive" class="panel-collapse collapse in">
	                <div class="panel-body">
						<span class="help-block">Arguments</span>
						<div class="form-group">
    							<table class="table table-hover table-condensed table-bordered table-striped">
                                     <thead>
                                     	<tr class="bg-success">
	                                        <td class="col-md-4">Data Type</td>
	                                        <td class="col-md-4">Argument Name</td>
	                                        <td class="col-md-4">Argument Value</td>
                                    	</tr> 
                                    </thead>
                                    <tbody>
                                    	<tr ng-repeat="row in params">
								    		<td class="col-md-4">{{row.dataType}}</td>
								    		<td class="col-md-4">{{row.paramName}}</td>
								    		<td class="col-md-4">
								    			<input type="text" class="form-control" ng-model="row.argValue" placeholder="Enter a test value"/>
								    		</td>			
								    	</tr>
                                	</tbody>
                                </table>
                        </div>              
	                	 <div class="form-group">
	                	 	<span class="help-block">Result Format</span>
							<div class="row">
								<div class="col-md-2">
									<select ng-model="contentType" class="form-control">
				                    	<option value="html">html</option>
				                    	<option value="xml">xml</option>
				                    	<option value="csv">csv</option>
				                    </select>
								</div>
							</div>
						</div>                              	  
						<div class="form-group">
							<button ng-click="executeQuery()" class="btn btn-primary" ng-disabled="!entity">Test Execute</button>
						</div>
						<span class="help-block"><em>Results will be limited to 10 rows. This is only for sample testing</em></span>
						<uib-progressbar class="active progress-striped" ng-show="running" value="100" type="primary">
				            <b><i>Fetching...</i></b>
				    	</uib-progressbar>
						<div ng-bind-html="resHtml" ng-show="contentType=='html'"></div>
						<pre ng-show="contentType !='html'">{{res}}</pre>
						<div class="alert alert-danger ng-cloak" ng-show="step5Error">
							<a href="#" class="close" ng-click="step5Error = null" aria-label="close">&times;</a>
						 	<span ng-bind-html="step5Error"></span>
						</div>
					</div>
	            </div>	            
	        </div>
	        <div class="panel panel-info">
	            <div class="panel-heading">
	                <h4 class="panel-title">
	                    <a data-toggle="collapse"  href="#stepSix"><strong>6. Save the Query Template</strong></a>
	                </h4>
	            </div>
	            <div id="stepSix" class="panel-collapse collapse in">
	                <div class="panel-body">
						<span class="help-block">Override Arguments</span>
						<div class="form-group">
    							<table class="table table-hover table-condensed table-bordered table-striped">
                                     <thead>
                                     	<tr class="bg-danger">
	                                        <td class="col-md-4">Data Type</td>
	                                        <td class="col-md-4">Argument Name</td>
	                                        <td class="col-md-4">Argument Value</td>
                                    	</tr> 
                                    </thead>
                                    <tbody>
                                    	<tr ng-repeat="row in params">
								    		<td class="col-md-4">{{row.dataType}}</td>
								    		<td class="col-md-4">{{row.paramName}}</td>
								    		<td class="col-md-4">
								    			<input type="text" class="form-control" ng-model="row.argValue" placeholder="Enter a value to save"/>
								    		</td>		
								    	</tr>
                                	</tbody>
                                </table>
                        </div>
                        <div class="form-group">
	                	 	<span class="help-block">Result Format</span>
							<div class="row">
								<div class="col-md-2">
									<select ng-model="contentType" class="form-control">
				                    	<option value="html">html</option>
				                    	<option value="xml">xml</option>
				                    	<option value="csv">csv</option>
				                    </select>
								</div>
							</div>
						</div> 
						<div class="form-group">
	                	 	<span class="help-block">Reply</span>
							<div class="row">
								<div class="col-md-2">
									<select ng-model="reply" class="form-control">
				                    	<option value="DIRECT">DIRECT</option>
				                    	<option value="INDIRECT">INDIRECT</option>
				                    </select>
								</div>
							</div>
						</div>   
						<div class="form-group">
							<span class="help-block">Template Name</span>
							<input type="text" ng-model="origTemplateName" class="form-control" readonly/>
						</div>
						<div class="form-group">
							<span class="help-block">Owner</span>
							<input type="text" ng-model="origOwner" class="form-control" readonly/>							
						</div>
						<div class="form-group">
							<button ng-click="saveQuery()" class="btn btn-primary" ng-show="mode != 'readonly'" ng-disabled="userForm.$invalid">Save</button>
							<button ng-click="openSaveAs = !openSaveAs" class="btn btn-primary" >Copy</button>
							<button ng-click="deleteQuery()" class="btn btn-danger" ng-show="mode != 'readonly'">Delete</button>
						</div>
						<div class="form-group"  ng-show="openSaveAs" ng-class="{ 'has-error' : userForm.templateName.$invalid && !userForm.templateName.$pristine }">
							<span class="help-block">Template Name</span>
							<input type="text" ng-model="templateName" name="templateName" class="form-control" required/>
							 <p ng-show="userForm.templateName.$invalid && !userForm.templateName.$pristine" class="help-block">Template Name is required.</p>
						</div>
						<div class="form-group" ng-show="openSaveAs">
							<span class="help-block">Owner</span>
							<select ng-model="owner" class="form-control">
									<option ng-repeat="option in ownerOptions" value="{{option}}">{{option}}</option>
							</select>
						</div>
						<div class="form-group">
						<button ng-click="saveQuery()" class="btn btn-primary" ng-show="openSaveAs" ng-disabled="userForm.$invalid">Save</button>
						</div>
						</div>
						<div class="form-group">
						<p>
						<div class="alert alert-success ng-cloak" ng-show="successMsg">
						  <a href="#" class="close" ng-click="successMsg = null" aria-label="close">&times;</a>
						   <span ng-bind-html="successMsg"></span>
						</div>
						<div class="alert alert-danger ng-cloak" ng-show="errorMsg">
						  <a href="#" class="close" ng-click="errorMsg = null" aria-label="close">&times;</a>
						  <span ng-bind-html="errorMsg"></span>
						</div>
				    	</div>
					</div>
	            </div>
	    </div>
		</form>	            
	</div>
</body>
</html>