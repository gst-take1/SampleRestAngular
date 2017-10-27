URLBuilderApp.controller('ModQueryTemplateController', ['$scope', '$http', 'selectorProcessor', function($scope, $http, selectorProcessor) {
	$scope.entity = undefined;
	$scope.pubEntities=[];
	$scope.keywords=[];
	$scope.entityAttrs=[];
	/*$scope.connectiveOp=[];
	$scope.comparisonOp=[];
	$scope.func=[];*/
	$scope.connectiveOp=['and', 'or'];
	$scope.comparisonOp=['=', '!=', '<', '<=', '>', '>='];
	$scope.func=['string Uppercase(string target)',
	                 'decimal Round(decimal num, int scale)',
	                 'date DatetimeToDate(datetime target)',
	                 'date TimestampToDate(timestamp target)',
	                 'date AddMonths(date target, int months)'];
	$scope.selectorAutoSuggest=[];
	$scope.selector='';
	$scope.selectorFormattedAdv=''
	$scope.selectorFormattedBasic=''
	$scope.incl=[];
	$scope.excl=[];
	$scope.selectedIncl=[];
	$scope.selectedExcl=[];
	$scope.contentType="html";
	$scope.dataTypes=['date','string','timestamp','decimal'];
	$scope.URL='';
	$scope.editingArgIdx=-1;
	//$scope.args=[];
	$scope.params=[];
	$scope.res='';
	$scope.resHtml='';
	$scope.sortBy=[];
	$scope.sortOrder='ascending';
	$scope.sortOrderTypes=['ascending', 'descending'];
	$scope.sortAttrName='';
	$scope.editingSortByIdx=-1;
	
	$scope.errorStep1=false;
	
	$scope.ownerOptions=[];
	$scope.reply = 'DIRECT';
	
	$scope.filter;
	$scope.display = isEdit() ? '' : 'basic';
	$scope.basicDisabled = false;
	
	
	$scope.initFilter = function() {
    	var data = '{"group": {"operator": "and","rules": []}}';
    	$scope.filter = JSON.parse(data);
    }

	$scope.selectorToFilter = function () {
		selectorProcessor.selectorToFilter($scope);
	}
		
   $scope.$watch('filter', function (newValue) {
	    if(newValue){
		    try{	
		        $scope.json = JSON.stringify(newValue, null, 2);
		        console.log($scope.json);
		        $scope.selectorFormattedBasic = computed(newValue.group, true);
		        $scope.selector = $scope.selectorFormattedBasic.replace(/<strong>/g,'').replace(/<\/strong>/g,'');
		    } catch (ex) {
				$scope.display = 'advanced';
				$scope.basicDisabled = true;
				console.log('Caught exception in watch filter');
				console.error(ex.stack?ex.stack:ex);
			}
		    refreshParams($scope);
	    }
    }, true);
    
	$scope.getLoggedInUser = function() {
	  	  $http({
	            method : 'GET',
	            url : "qb/builder/getLoggedInUser"
	        }).success(function(data, status, headers, config) {
	        		console.log("In success ");
	        		console.log(data);
	                $scope.loggedInUser = data;
	        }).error(function(data, status, headers, config) {
	        	//console.log("In Error ");
	        	//console.log(data)
	        });
	 }
	
	$scope.getPubEntities = function() {
		console.log('Start');
		$scope.keywords=[];
		$scope.entityAttrs=[];
		$scope.incl=[];
		$scope.excl=[];
		$scope.selectedIncl=[];
		$scope.selectedExcl=[];
		$scope.params=[];
		$scope.res='';
		$scope.resHtml='';
		$scope.orderBy=[];
		$http({
            method : 'GET',
            url : "qb/builder/getPubEntities" /*+ $scope.env*/
		    }).success(function(data, status, headers, config) {
		    		console.log("Success")
		    		$scope.errorStep1=false;
		    		//console.log(data)
		    		$scope.pubEntities = data;
		    		for(var i =0; i<data.length; i++) {
		    			//console.log(data[i]);
		    			var cap = data[i].match(/^([A-Z]+[a-z]*)[A-Z]\w*/);
		    			//console.log(cap);
		    			if(cap.length > 1 ) {
		    				if ($scope.keywords.length == 0)
		    					$scope.keywords.push(cap[1])
		    				else if ($scope.keywords[$scope.keywords.length -1] != cap[1])
		    					$scope.keywords.push(cap[1])
		    			}
		    				
		    		}
		    		//console.log($scope.keywords);
		    }).error(function(data, status, headers, config) {
		    	$scope.step1Error=getErrorMsg(status, data);
		    });
	}
	
	$scope.getEntityAttrs = function() {
		//$scope.keywords=[];
		$scope.entityAttrs=[];
		$scope.incl=[];
		$scope.excl=[];
		$scope.selectedIncl=[];
		$scope.selectedExcl=[];
		$scope.params=[];
		$scope.res='';
		$scope.resHtml='';
		$scope.orderBy=[];
		$scope.selector='';
		$scope.initFilter();
		$http({
			  method: 'GET',
			  //url: 'qb/builder/getEntityAttrs?/*env=' + $scope.env + '&entity=' +$scope.entity
			  url: 'qb/builder/getEntityAttrs?entity=' +$scope.entity
		}).then(function successCallback(response) {
			//console.log(response.data);
			$scope.entityAttrs = response.data
			for(var i = 0; i<$scope.entityAttrs.length; i++) {
				if(i == 0)
					$scope.sortAttrName = $scope.entityAttrs[i].attrName
				$scope.incl.push($scope.entityAttrs[i].attrName);
				$scope.selectorAutoSuggest.push($scope.entityAttrs[i].attrName + '[' + $scope.entityAttrs[i].attrType + ']');
				//console.log($scope.entityAttrs[i].attrName);
			}
		  }, function errorCallback(response) {
			  $scope.step2Error=getErrorMsgResponse(response);
		  }); 
	}
	
	$scope.$watch('selector', function (newValue, oldValue) {
  	  if(newValue != undefined) {
  		  	 
  		  	$scope.selectorFormattedAdv = selectorProcessor.formatSelectorAdv(newValue);
  	  }
	});
	$scope.onSelectPubEntity = function (item, model, label) {
		$scope.getEntityAttrs();
	}
	
	$scope.init = function() {
		if(isEdit())
			$scope.mode = mode;
		$scope.initFilter();
		$scope.getLoggedInUser();

		$scope.dataType = $scope.dataTypes[0];
		$scope.getPubEntities();
				
		$scope.selectorAutoSuggest = $scope.selectorAutoSuggest.concat($scope.connectiveOp);
		$scope.selectorAutoSuggest = $scope.selectorAutoSuggest.concat($scope.comparisonOp);
		$scope.selectorAutoSuggest = $scope.selectorAutoSuggest.concat($scope.func);
		
		$scope.getOwnerOptions();
		
		if(isEdit()) {
			//populate the input values with edited Obj
			$scope.getQueryTemplateFromKey(owner, name);
		}
	}
        
	$scope.shiftInclToExcl = function() {
		for(var i =0; i<$scope.selectedIncl.length; i++) {
			for(var j = 0; j<$scope.incl.length; j++) {
				if($scope.incl[j] == $scope.selectedIncl[i]) {
						$scope.incl.splice(j,1);
						break;
				}
			}
			var found = false;
			for(var j = 0; j<$scope.excl.length; j++) {
				if($scope.excl[j] == $scope.selectedIncl[i]) {
					found = true;
					break;
				}
			}
			if(!found)
				$scope.excl.push($scope.selectedIncl[i]);			
		}
	}
	
	$scope.shiftExclToIncl = function() {
		for(var i =0; i<$scope.selectedExcl.length; i++) {
			for(var j = 0; j<$scope.excl.length; j++) {
				if($scope.excl[j] == $scope.selectedIncl[i]) {
						$scope.excl.splice(j,1);
						break;
				}
			}
			var found = false;
			for(var j = 0; j<$scope.incl.length; j++) {
				if($scope.incl[j] == $scope.selectedExcl[i]) {
					found = true;
					break;
				}
			}
			if(!found)
				$scope.incl.push($scope.selectedExcl[i]);	
		}
	}
	
	$scope.executeURL = function() {
		window.open($scope.URL);
	}
		
	$scope.editArg = function(index) {
		$scope.editingArgIdx = index;
		$scope.dataType = $scope.params[index].dataType; 
		$scope.paramName = $scope.params[index].paramName; 
		$scope.argValue = $scope.params[index].argValue; 
	}
	
	$scope.removeArg = function(index) {
		$scope.params.splice(index, 1);
	}
	
	$scope.saveArg = function() {
		if($scope.editingArgIdx != -1) {
			$scope.params[$scope.editingArgIdx].dataType = $scope.dataType;
			$scope.params[$scope.editingArgIdx].paramName = $scope.paramName;
			$scope.params[$scope.editingArgIdx].argValue = $scope.argValue;
		}
		else
			$scope.params.push({ dataType: $scope.dataType, paramName: $scope.paramName, argValue: $scope.argValue  });
		$scope.dataType=$scope.dataTypes[0];
		$scope.paramName='';
		$scope.argValue='';
		$scope.editingArgIdx=-1;
			
	}
	
	$scope.parseSelector = function() {
		$scope.step3Error = '';
		try
		{
		selectorProcessor.parseSelector($scope);
		}catch(ex) {
			$scope.step3Error = 'Error occured in parsing: ' + ex.message;
    		throw(ex);
		}
		//console.log($scope.params);
	}
		
	$scope.editParam = function(index) {
		$scope.editingArgIdx = index;
		$scope.dataType = $scope.args[index].dataType; 
		$scope.argName = $scope.args[index].argName; 
		$scope.argValue = $scope.args[index].argValue; 
	}
	
	$scope.removeParam = function(index) {
		$scope.args.splice(index, 1);
	}
	
	$scope.executeQuery = function () {
		$scope.step5Error = '';
		$scope.res = '';
		$scope.resHtml = '';
		$scope.running = true;
		var data = {
				entity : $scope.entity,
				selector : $scope.selector.trim(),
				resultFormat : $scope.contentType,
				exclList : $scope.excl,
				inclList : $scope.incl,
				paramsList : $scope.params,
				sortByList : $scope.sortBy,
				templateName : $scope.templateName,
				owner : $scope.owner,
				reply : $scope.reply
		};
		$http.post('qb/execute/testExecuteDSQuery',
			  data
		).then(function successCallback(response) {
			$scope.running = false;
			if($scope.contentType == 'html') {
				$scope.resHtml = response.data;
				var parts = $scope.resHtml.match
				(/(<table.*<\/table>)/);
				//console.log(parts);
				$scope.resHtml = parts[0];
				$scope.resHtml = $scope.resHtml.replace(/class\="\w*"/, 'class="table table-hover table-condensed table-bordered table-striped"');
				$scope.resHtml = $scope.resHtml.replace(/<th>/g, '<th class="bg-primary">');
			}
			else
				$scope.res = response.data;
				//$scope.res = $scope.res.replace(/\n/g,"<br>")
		  }, function errorCallback(response) {
			    $scope.running = false;
		   		$scope.step5Error = getErrorMsgResponse(response);
		  }); 
		//$scope.res= '<html><head><style type="text/css">table.grid {font-family: verdana,arial,sans-serif; font-size:11px; color:#333333; border-width: 1px; border-color: #666666; border-collapse: collapse;} table.grid th {border-width: 1px; padding: 8px; border-style: solid; border-color: #666666; background-color: #cfcfcf;} table.grid td {border-width: 1px; padding: 8px; border-style: solid; border-color: #666666;} table.grid tr:nth-child(even) {background-color: #ffffff;} table.grid tr:nth-child(odd) {background-color: #dfdfdf;}</style><title>SecurityReferenceMasterPublication 3.0</title></head><body><table class="table table-hover table-condensed table-bordered table-striped"><tr><th>1<br>BNYMEagleHubSecurityAliasIdentifier</th><th>2<br>EagleSecurityAliasIdentifier</th><th>3<br>HiNetSmsecidIdentifier</th><th>4<br>SecurityName</th><th>5<br>SecurityDescription2Text</th><th>6<br>SecurityTypeCode</th><th>7<br>ActiveIndicator</th><th>8<br>Form13FIndicator</th><th>9<br>Schedule13GIndicator</th><th>10<br>ADRConversionRate</th><th>11<br>ADWSecurityTypeCode</th><th>12<br>AlternativeMinimumTaxIndicator</th><th>13<br>AmountIssuedNumber</th><th>14<br>AmountOutstandingNumber</th><th>15<br>AssetBackedSecurityIndicator</th><th>16<br>AssetCategoryName</th><th>17<br>AssetOrderNumber</th><th>18<br>BankDebtIndicator</th><th>19<br>BankDebtStrippedIndicator</th><th>20<br>BloombergADRSponsorshipTypeCode</th><th>21<br>BloombergADRTradingLevelCode</th><th>22<br>BloombergBCTrancheIndicator</th><th>23<br>BloombergBondwithWarrantIndicator</th><th>24<br>BloombergCalcTypeName</th><th>25<br>BloombergCapitalContingentConversionIndicator</th><th>26<br>BloombergCollateralTypeName</th><th>27<br>BloombergCounterpartyIssuerIdentifier</th><th>28<br>BloombergCountryofDomicileCode</th><th>29<br>BloombergCountryofDomicileName</th><th>30<br>BloombergCountryofIncorporationCode</th><th>31<br>BloombergCountryofIncorporationName</th><th>32<br>BloombergCouponTypeCode</th><th>33<br>BloombergDefaultedIndicator</th><th>34<br>BloombergEquityDividendFrequencyCode</th><th>35<br>BloombergEquityPrimaryExchangeCode</th><th>36<br>BloombergEquityPrimarySecurityCompositeExchangeCode</th><th>37<br>BloombergEquityPrimarySecurityPrimaryExchangeCode</th><th>38<br>BloombergExchangeCode</th><th>39<br>BloombergExchangeName</th><th>40<br>BloombergExtendibleBondIndicator</th><th>41<br>BloombergFloatingRateIndicator</th><th>42<br>BloombergFundAssetClassFocusCode</th><th>43<br>BloombergFundedAmount</th><th>44<br>BloombergFuturesCategoryName</th><th>45<br>BloombergHybridIndicator</th><th>46<br>BloombergIssuerIdentifier</th><th>47<br>BloombergIsTraceIndicator</th><th>48<br>BloombergLIBORFloorAmount</th><th>49<br>BloombergLoanCovenantLiteIndicator</th><th>50<br>BloombergLoanTrancheLetterIdentifier</th><th>51<br>BloombergLoanTrancheSizeAmount</th><th>52<br>BloombergLongCompanyName</th><th>53<br>BloombergMainObligorTypeName</th><th>54<br>BloombergMarketSectorCode</th><th>55<br>BloombergMortgageTrancheTypeCode</th><th>56<br>BloombergMultipleShareIndicator</th><th>57<br>BloombergPerpetualIndicator</th><th>58<br>BloombergPreviousCouponDate</th><th>59<br>BloombergPutDaysNoticeNumber</th><th>60<br>BloombergRefixFrequencyNumber</th><th>61<br>BloombergSEC2A7Date</th><th>62<br>BloombergSecRestrictIndicator</th><th>63<br>BloombergSecondLienIndicator</th><th>64<br>BloombergStructuredNoteIndicator</th><th>65<br>BloombergThirdLienIndicator</th><th>68<br>BloombergTransferAgentName</th><th>69<br>BloombergTrustPreferredIndicator</th><th>70<br>BondEquivalentFrequencyName</th><th>71<br>BondEquivalentYieldName</th><th>72<br>BondIssueTypeCode</th><th>73<br>BridgeLoanIndicator</th><th>74<br>Callable</th><th>75<br>CallPutIndicator</th><th>76<br>CDIFXConversionIndicator</th><th>77<br>CometSecurityTypeCode</th><th>78<br>ComplianceRestrictionCode</th><th>79<br>ComplianceRestrictionDate</th><th>80<br>ComplianceRestrictionName</th><th>81<br>ComplianceRestrictionPercentage</th><th>82<br>ContinuousCallIndicator</th><th>83<br>ContractSizeNumber</th><th>84<br>ConversionRatioNumber</th><th>85<br>CountryCode</th><th>86<br>CountryName</th><th>87<br>CountryofIssueCurrencyCode</th><th>88<br>CountryofPrimaryExchangeCode</th><th>89<br>CountryofPrimaryExchangeName</th><th>90<br>CountryofTaxationCode</th><th>91<br>CountryofTaxationName</th><th>92<br>CountryRegion</th><th>93<br>CouponRate</th><th>94<br>CouponTypeCode</th><th>95<br>CouponsPerYearCode</th><th>96<br>CouponsPerYearName</th><th>97<br>CoveredbyBenchmarkFeedIndicator</th><th>98<br>CreditEnhancementName</th><th>99<br>CurrencyPrecisionNumber</th><th>100<br>CurrentLoanModificationCountQuantity</th><th>101<br>DataQualityLevelName</th><th>102<br>SecurityReleaseStatusCode</th><th>103<br>DayCountBasisCode</th><th>104<br>DayCountName</th><th>105<br>DebtorInPossessionIndicator</th><th>106<br>DeliveryTypeCode</th><th>107<br>DeliveryTypeName</th><th>108<br>DerivativeIndicator</th><th>109<br>DerivativeRollDate</th><th>110<br>DimSumIndicator</th><th>111<br>DividendExDate</th><th>112<br>DividendPayDate</th><th>113<br>DividendRate</th><th>114<br>DividendRecordDate</th><th>115<br>DTCRegisteredIndicator</th><th>116<br>EquityAnalystCode</th><th>117<br>EquityDividendTypeLastCode</th><th>118<br>EstimatedAnnualIncomeAmount</th><th>119<br>ExchangeRICReutersExchangeCode</th><th>120<br>ExcludeFromBloombergIndicator</th><th>121<br>ExDividendCouponDateNumber</th><th>122<br>ExDividendIndicator</th><th>123<br>ExercisePrice</th><th>124<br>ExpirationDate</th><th>125<br>FactoratSetUpRate</th><th>126<br>FirstAccrualDate</th><th>127<br>FirstLienIndicator</th><th>128<br>FirstPaymentDate</th><th>129<br>FirstRateResetDate</th><th>130<br>FixedIncomeAnalystCode</th><th>131<br>FourTwoCommercialPaperIndicator</th><th>132<br>FromCurrencyCode</th><th>133<br>GIPSFirmCode</th><th>134<br>HedgeFundCommittedCashIndicator</th><th>135<br>HeldIndicator</th><th>136<br>HighYieldSecurityIndicator</th><th>137<br>HiNetOverrideResetDate</th><th>138<br>IlliquidIndicator</th><th>139<br>IncomeCurrencyCode</th><th>140<br>IncomeCurrencyName</th><th>141<br>IndexDelayMonthsNumber</th><th>142<br>IndexIdentifier</th><th>143<br>IndexRatioRoundingFactorNumber</th><th>144<br>InformalName</th><th>145<br>InitialMarginFactorHedgerAmount</th><th>146<br>InitialMarginFactorSpeculatorAmount</th><th>147<br>InvestmentTypeCode</th><th>148<br>InvestmentTypeName</th><th>149<br>IsStockMarginableIndicator</th><th>150<br>IssueCurrencyCode</th><th>151<br>IssueCurrencyName</th><th>152<br>IssueDate</th><th>153<br>IssuePrice</th><th>154<br>IssueSizeNumber</th><th>155<br>IssuerAliasIdentifier</th><th>156<br>JPMorganCountryofIssueCode</th><th>157<br>LastReceivedDate</th><th>158<br>LeverageFactorRate</th><th>159<br>LeverageIndicator</th><th>160<br>MandatoryOptionalPutIndicator</th><th>161<br>MatureYearsNumber</th><th>162<br>MaturityDate</th><th>163<br>MaturityPrice</th><th>164<br>MinimumIncrementAmount</th><th>165<br>MinimumTradeAmount</th><th>166<br>MortgageAmortizationTypeName</th><th>167<br>MortgageCMOGroupIdentifier</th><th>168<br>MortgageCollateralTypeCode</th><th>169<br>MortgageDealName</th><th>170<br>MortgageDebtServiceCoverageRatioWeightedAverage</th><th>171<br>MortgageDelinquent60PLUSDaysPercentage</th><th>172<br>MortgageFactoratSetupDate</th><th>173<br>MortgageInterestDistributedAmount</th><th>174<br>MortgageInterestShortfallAmount</th><th>175<br>MortgageLoanAgeNumber</th><th>176<br>MortgageOriginalFaceAmount</th><th>177<br>MortgageOriginalFaceValueAmount</th><th>178<br>MortgageOriginalTermYearsNumber</th><th>179<br>MortgagePrincipalDistributedAmount</th><th>180<br>MortgageServicerCode</th><th>181<br>MortgageTypeCode</th><th>182<br>MortgageWholeLoan30DaysDelinquentPercentage</th><th>183<br>MortgageWholeLoanCreditSupportPercentage</th><th>184<br>MSCICountryCode</th><th>185<br>MSCIIssuerCountryCode</th><th>186<br>MultilistedIndicator</th><th>187<br>MultipleCusipsforSameSecurityIdentifier</th><th>188<br>NextCallDate</th><th>189<br>NextCallPrice</th><th>190<br>NextCallPreRefundDate</th><th>191<br>NextCallPreRefundPrice</th><th>192<br>NextParCallDate</th><th>193<br>NextPremiumCallDate</th><th>194<br>NextPremiumCallPrice</th><th>195<br>NextPutDate</th><th>196<br>NextPutPrice</th><th>197<br>NextRefundingDate</th><th>198<br>NextResetDate</th><th>199<br>NonStandardPayDateIndicator</th><th>200<br>OptionStyleCode</th><th>201<br>OptionTickSizeNumber</th><th>202<br>OriginalCreditSupportPercentage</th><th>203<br>OriginalIssueDiscountIndicator</th><th>204<br>OriginalIssueDiscountPrice</th><th>205<br>OriginalIssueDiscountSaleDate</th><th>206<br>OriginalIssueDiscountYieldPercentage</th><th>207<br>OvertheCounterIndicator</th><th>208<br>ParValueAmount</th><th>209<br>ParValueCurrencyCode</th><th>210<br>ParValueCurrencyName</th><th>211<br>PayDateMethodCalculatorIndicator</th><th>212<br>PaymentRankName</th><th>213<br>PreRefundedDate</th><th>214<br>PreRefundIndicator</th><th>215<br>PreviousInterestPaymentDate</th><th>216<br>PriceatSetUpAmount</th><th>217<br>PrimaryAssetIdentifier</th><th>218<br>PrimaryAssetIdentifierType</th><th>219<br>PrimarySecurityIndicator</th><th>220<br>PrincipalPayDate</th><th>221<br>PrivateFundIndicator</th><th>222<br>PrivatePlacementIndicator</th><th>223<br>ProductionYearNumber</th><th>224<br>ProjectName</th><th>225<br>PutableIndicator</th><th>226<br>PutText</th><th>227<br>RateIndex1Name</th><th>228<br>ReceiptDelayNumber</th><th>229<br>ReferenceIndexValueatIssueNumber</th><th>230<br>RegSIndicator</th><th>231<br>ReportingDescriptionText</th><th>232<br>ResetRateFrequencyCode</th><th>233<br>ResetRateFrequencyName</th><th>234<br>RollingPutFrequencyNumber</th><th>235<br>Rule144ARegistrationDate</th><th>236<br>Rule144AStatusCode</th><th>237<br>Rule144AStatusCodeName</th><th>238<br>Absolute144AIndicator</th><th>239<br>Rule144Aindicator</th><th>240<br>SEC2A7TierCode</th><th>241<br>SECRule2A7CategoryName</th><th>242<br>SecurityBeginDate</th><th>243<br>SecurityEndDate</th><th>244<br>SecurityLastUpdateDate</th><th>245<br>SecurityTypeName</th><th>246<br>SeriesName</th><th>247<br>SettlementDaysNumber</th><th>248<br>SharesOutstandingNumber</th><th>249<br>SharesperRightWarrantNumber</th><th>250<br>ShortTermInvestmentFundIndicator</th><th>251<br>SICName</th><th>252<br>SinkTypeName</th><th>253<br>SinkableIndicator</th><th>254<br>SovereignIndicator</th><th>255<br>SpreadatIssueNumber</th><th>256<br>StateCode</th><th>257<br>StateName</th><th>258<br>StrikePrice</th><th>259<br>SwapLinktoOffsetSecurityIdentifier</th><th>260<br>TaxableIndicator</th><th>261<br>ToCurrencyCode</th><th>262<br>TradeLotSizeAmount</th><th>263<br>TRPBondCalcTypeCode</th><th>264<br>TRPBondCalcTypeName</th><th>265<br>TRPCompositedIssuerName</th><th>266<br>TRPDefaultDate</th><th>267<br>TRPDefaultStatusCode</th><th>268<br>TRPExchangeCode</th><th>269<br>TRPExchangeCodeName</th><th>270<br>TRPFloatingRateIndicator</th><th>271<br>TRPIssuerIdentifier</th><th>272<br>TRPMarketCode</th><th>273<br>TRPMarketName</th><th>274<br>TRPSecurityTypeCode</th><th>275<br>TRPSecurityTypeName</th><th>276<br>UBTIAlertCode</th><th>277<br>UnderlyingSecurityName</th><th>278<br>UnderlyingSecurityTypeCode</th><th>279<br>UnderlyingTickerIdentifier</th><th>280<br>UnderwriterName</th><th>281<br>UnitofCalculationNumber</th><th>282<br>UnitTradedConversionRatio</th><th>283<br>UnitTradedIndicator</th><th>284<br>ValuationRuleCode</th><th>285<br>VariableRateIndicator</th><th>286<br>VariableRateResetDayofWeek</th><th>287<br>VendorSourceCode</th><th>288<br>VendorSourceInsurer</th><th>289<br>VendorSourceMarketSectorCode</th><th>290<br>VendorSourceObligorName</th><th>291<br>VendorSourceSecurityTypeCode</th><th>292<br>VisionSecurityDate</th><th>293<br>VotingRightsMultipleIndicator</th><th>294<br>WhenIssuedIndicator</th><th>295<br>UnderlyingCouponRate</th><th>296<br>UnderlyingHiNetCUSIPIdentifier</th><th>297<br>UnderlyingHiNetSMSECIDIdentifier</th><th>298<br>UnderlyingISINIdentifier</th><th>299<br>UnderlyingEagleSecurityAliasIdentifier</th><th>300<br>UnderlyingSecurityMaturityDate</th><th>301<br>DataEffectiveDate</th><th>302<br>RecycleHiNetSmsecidIdentifier</th><th>303<br>DeleteIndicator</th></tr><tr><td></td><td>495788</td><td></td><td>GOLDMAN SACHS GROUP INC</td><td>20160225 2.875% 20210225</td><td>BMSC</td><td>ACTIVE</td><td></td><td></td><td></td><td>TXBLIB</td><td></td><td>1250000000</td><td>1250000000</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>N</td><td></td><td></td><td>SR UNSECURED</td><td>348768</td><td>US</td><td>United States</td><td>US</td><td>United States</td><td></td><td></td><td></td><td></td><td></td><td></td><td>NEW YORK</td><td>NEW YORK</td><td></td><td>N</td><td></td><td></td><td></td><td></td><td>348768</td><td></td><td></td><td></td><td></td><td></td><td>Goldman Sachs Group Inc/The</td><td></td><td>Corp</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>N</td><td></td><td>N</td><td></td><td></td><td></td><td></td><td></td><td></td><td>Y</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>US</td><td>United States</td><td>US</td><td></td><td></td><td></td><td></td><td></td><td>2.875</td><td>F</td><td>2</td><td>Semi-Annual</td><td>Y</td><td></td><td></td><td></td><td>BMSC</td><td></td><td>1</td><td>30/360</td><td>N</td><td></td><td></td><td></td><td></td><td>N</td><td></td><td></td><td></td><td></td><td>Y</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>N</td><td>2016-08-25</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>N</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>FI</td><td>Fixed Income</td><td></td><td>USD</td><td>US DOLLAR</td><td>2016-02-25</td><td>99.834</td><td>1250000000</td><td>147590</td><td></td><td>2016-04-07</td><td></td><td></td><td></td><td>4.890410958904</td><td>2021-02-25</td><td></td><td>1000</td><td>2000</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>0</td><td></td><td></td><td>Not Classified</td><td>Not Classified</td><td></td><td></td><td>2021-01-25</td><td>100</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>N</td><td></td><td></td><td></td><td></td><td>Sr Unsecured</td><td></td><td></td><td></td><td></td><td>38143U8F1</td><td>CUSIP</td><td></td><td></td><td></td><td></td><td></td><td></td><td>N</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>N</td><td></td><td></td><td></td><td></td><td>2016-04-07T01:13:15</td><td>Benchmark Security</td><td></td><td></td><td>1250000000</td><td></td><td></td><td></td><td>NOSINK</td><td>N</td><td></td><td></td><td></td><td></td><td></td><td></td><td>Y</td><td></td><td></td><td>3</td><td>Periodic Constant Cash Bond</td><td>Goldman Sachs Group Inc/The</td><td></td><td>N</td><td>XOTC</td><td>OTCBB</td><td></td><td>GOLDMAN SACHS GROUP INC</td><td>M</td><td>OVER-THE-COUNTER EXCHANGE</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>IDW</td><td></td><td>FIN</td><td></td><td>GLOBAL</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>N</td></tr></table></body></html>';
	}
	
	$scope.editSortBy = function(index) {
		$scope.editingSortByIdx = index;
		$scope.sortOrder = $scope.sortBy[index].order; 
		$scope.sortAttrName = $scope.sortBy[index].attrName;
	}
	
	$scope.removeSortBy = function(index) {
		$scope.sortBy.splice(index, 1);
	}
	
	$scope.saveSortBy = function() {
		if($scope.editingSortByIdx != -1) {
			$scope.sortBy[$scope.editingSortByIdx].order = $scope.sortOrder;
			$scope.sortBy[$scope.editingSortByIdx].attrName = $scope.sortAttrName;
		}
		else
			$scope.sortBy.push({ order: $scope.sortOrder, attrName: $scope.sortAttrName  });
		$scope.sortOrder='ascending';
		$scope.sortAttrName=$scope.entityAttrs[0].attrName;
		
		$scope.editingSortByIdx=-1;			
	}
	
	$scope.getOwnerOptions = function() {
		$http({
			  method: 'GET',
			  url: 'qb/builder/getOwnerOptions'
		}).then(function successCallback(response) {
			//console.log(response.data);
			$scope.ownerOptions = response.data
			if(!$scope.owner)
				$scope.owner = $scope.ownerOptions[0];
		  }, function errorCallback(response) {
			  console.log("error in getOwnerOptions")
		  }); 
	}
	
	$scope.saveQuery = function() {
		$scope.successMsg = '';
		$scope.errorMsg = '';
		var data = {
				entity : $scope.entity,
				selector : $scope.selector,
				resultFormat : $scope.contentType,
				exclList : $scope.excl,
				inclList : $scope.incl,
				paramsList : $scope.params,
				sortByList : $scope.sortBy,
				templateName : $scope.templateName,
				owner : $scope.owner,
				reply : $scope.reply
		};
		$http.post(
			  'qb/modify/saveQuery',
			  data
		).then(function successCallback(response) {
			$scope.successMsg = "Query Template was Saved Successfully"
		  }, function errorCallback(response) {
			  console.log(response);
			  $scope.errorMsg = getErrorMsgResponse(response);
		  }); 
	}
	
	$scope.getQueryTemplateFromKey = function(owner, name) {
		$http({
			  method: 'GET',
			  url: 'qb/builder/getQueryTemplateFromKey/' + owner + '/' + name
		}).then(function successCallback(response) {
			selectorProcessor.populateQueryTemplateDetails($scope, response.data);
		}, function errorCallback(response) {
			  $scope.step1Error=getErrorMsgResponse(response);
		  });
	}
	
	$scope.deleteQuery = function() {
		$scope.successMsg = '';
		$scope.errorMsg = '';
		var data = {
				entity : $scope.entity,
				selector : $scope.selector,
				resultFormat : $scope.contentType,
				exclList : $scope.excl,
				inclList : $scope.incl,
				paramsList : $scope.params,
				sortByList : $scope.sortBy,
				templateName : $scope.templateName,
				owner : $scope.owner,
				reply : $scope.reply
		};
		$http.post(
			  'qb/modify/deleteQuery',
			  data
		).then(function successCallback(response) {
			//console.log(response.data);
			$scope.successMsg = "Query Template was Deleted Successfully"
		  }, function errorCallback(response) {
			 $scope.errorMsg = getErrorMsgResponse(response);
		  }); 
	}
	
	$scope.addDeleteParams = function (rule) {
		$scope.addDeleteParams = function () {
			$scope.params = [];
			selectorProcessor.refreshParams($scope, $scope.filter.group)
		}
	}
        $scope.init();

}]);