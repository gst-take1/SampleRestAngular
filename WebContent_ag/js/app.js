var IDW_DATE_TIME_FORMAT = 'MM/dd/yyyy HH:mm:ss:sss';

var NG_STATUS_SUCCESS  =  "success";
var NG_STATUS_WARNING = "warning";
var NG_STATUS_ERROR = "error";
var NG_STATUS_MANUAL = "manual";
var NG_STATUS_RESOLVED = "resolved";
var NG_STATUS_NEW_WAITING =  "new_waiting";
var NG_STATUS_RUNNING = "running";

var RESET_LOADERGROUP_STATUS = "READY TO LOAD";

var SCHED_EXE_DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';

//Logging functions
function formatMessage(message) {
    return '[' + new Date() + '] ' + message;
};

function logDebug(message) {    
    console.log(formatMessage(message));
};

function logInfo(message) {    
    console.info(formatMessage(message));
};

function logWarn(message) {    
    console.warn(formatMessage(message));
}
function logError(message) {    
    console.error(formatMessage(message));
}

function formatJson(jsonObject) {
    return JSON.stringify(jsonObject, null, 4)
}

String.prototype.indexOfEx = function (str) {
    return this.toLowerCase().indexOf(str.toLowerCase());
}

function setStorage(key, data) {
    if (typeof data == 'object') {
        //logDebug('SetStorage()  Key:' + key + '  Value(Original): ' + data);
        data = JSON.stringify(data);
    }
    //logDebug('SetStorage()  Key:' + key + '  Value(Stringified): ' + data);
    sessionStorage.setItem(key, data)
}

function getStorageOrDefault(key, defaultData) {
    var savedData = sessionStorage.getItem(key);
    //logDebug('GetStorage()  Key:' + key + '  Value(Stringified): ' + savedData);
    if (savedData == null) {
        setStorage(key, defaultData);
        //logDebug('GetStorage()  Key:' + key + '  Value(Default): ' + defaultData);
        return defaultData;
    }
    else {

        try {
            savedData = JSON.parse(savedData)
        }
        catch (e) {
            //not a json object return simple type
        }
        //logDebug('GetStorage()  Key:' + key + '  Value(Original): ' + savedData);
        return savedData;
    }
}

function removeStorage(key) {
    sessionStorage.removeItem(key);
}

//Date Functions
//function to return the date time in locale format (for alerts)
function dateTimeNow() {
    var now = new Date();
    return now.toLocaleString();
};

//add days to a given date 
function addDays(dateObj, days) {
    return new Date(dateObj.getTime() + (days * 24 * 60 * 60 * 1000));
};

//Gets the date in the standard MM/DD/YYYY format to pass to the API
function formatDate(dateObj) {
    if (dateObj != null) {
        return (dateObj.getMonth() + 1) + "/" + dateObj.getDate() + "/" + dateObj.getFullYear();
    }
    else {
        return "";
    };

};

function dateDiff(date1, date2) {
    var dt1 = new Date(date1);
    var dt2 = new Date(date2);
    return Math.abs(dt1 - dt2) / 1000;
};


function truncateStartDate(dateObj) {
    if (dateObj != null) {
        return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    }
    else {
        return null;
    };
};

function truncateEndDate(dateObj) {
    if (dateObj != null) {
        return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 23, 59, 59);
    }
    else {
        return null;
    };
};


function getRowCellClass(NgStatus) {
    
    switch (NgStatus) {
        case NG_STATUS_SUCCESS:
            return "success";
            break;
        case NG_STATUS_WARNING:
            return "warning"
            break;
        case NG_STATUS_ERROR:
            return "danger";
            break;
        case NG_STATUS_MANUAL:
        case NG_STATUS_RESOLVED:
            return "info";
            break;
        case NG_STATUS_NEW_WAITING:
            return "";
            break;
        case NG_STATUS_RUNNING:
            return "active";
            break;        
        default:
            return "";
    }
}


function getGlyphClass(NgStatus) {
    
    switch (NgStatus) {
        case NG_STATUS_RESOLVED:
        case NG_STATUS_SUCCESS:
            return "glyphicon-ok-sign";
            break;
        case NG_STATUS_WARNING:
            return "glyphicon-exclamation-sign"
            break;
        case NG_STATUS_ERROR:
            return "glyphicon-remove-sign";
            break;
        case NG_STATUS_MANUAL:
            return "glyphicon-user";
            break;
        case NG_STATUS_NEW_WAITING:
            return "glyphicon-pause";
            break;        
        case NG_STATUS_RUNNING:
            return "glyphicon-play";
            break;
        default:
            return "";
    }
}


function getLabelClass(NgStatus) {
    switch (NgStatus) {
        case NG_STATUS_SUCCESS:
            return "label-success";
            break;
        case NG_STATUS_WARNING:
            return "label-warning"
            break;
        case NG_STATUS_ERROR:
            return "label-danger";
            break;
        case NG_STATUS_MANUAL:
        case NG_STATUS_RESOLVED:
            return "label-info";
            break;
        case NG_STATUS_NEW_WAITING:
            return "label-default";
            break;
        case NG_STATUS_RUNNING:
            return "label-primary";
            break;
        default:
            return "";
    }
}



function getButtonClass(NgStatus) {
    switch (NgStatus) {
        case NG_STATUS_SUCCESS:
            return "btn-success";
            break;
        case NG_STATUS_WARNING:
            return "btn-warning"
            break;
        case NG_STATUS_ERROR:
            return "btn-danger";
            break;
        case NG_STATUS_MANUAL:
        case NG_STATUS_RESOLVED:
            return "btn-info";
            break;
        case NG_STATUS_NEW_WAITING:
            return "btn-default";
            break;
        case NG_STATUS_RUNNING:
            return "btn-primary";
            break;
        default:
            return "btn-default";
    }
}


function getTextForegroundClass(NgStatus) {
    switch (NgStatus) {
        case NG_STATUS_SUCCESS:
            return "text-success";
            break;
        case NG_STATUS_WARNING:
            return "text-warning"
            break;
        case NG_STATUS_ERROR:
            return "text-danger";
            break;
        case NG_STATUS_MANUAL:
        case NG_STATUS_RESOLVED:
            return "text-info";
            break;
        case NG_STATUS_NEW_WAITING:
            return "text-muted";
            break;
        case NG_STATUS_RUNNING:
            return "text-primary";
            break;
        default:
            return "text-muted";
    }
}


function getTextBackgroundClass(NgStatus) {
    switch (NgStatus) {
        case NG_STATUS_SUCCESS:
            return "bg-success";
            break;
        case NG_STATUS_WARNING:
            return "bg-warning"
            break;
        case NG_STATUS_ERROR:
            return "bg-danger";
            break;
        case NG_STATUS_MANUAL:
        case NG_STATUS_RESOLVED:
            return "bg-info";
            break;
        case NG_STATUS_NEW_WAITING:
            return "";
            break;
        case NG_STATUS_RUNNING:
            return "bg-primary";
            break;
        default:
            return "";
    }
}

function setTopBottomMargins(topElementIds, bottomElementIds) {    
    var topPosition = 0;
    var bottomPosition = 0;
    if (topElementIds != null) {
        for (var i = 0; i < topElementIds.length ; i++) {
            topPosition += document.getElementById(topElementIds[i]).getBoundingClientRect().bottom;
        }
    }
    if (bottomElementIds != null) {

        for (var i = 0; i < bottomElementIds.length ; i++) {
            bottomPosition += document.getElementById(bottomElementIds[i]).getBoundingClientRect().height;
        }
    }
    //logDebug('Top:' + topPosition + ' Bottom:' + bottomPosition);
    return { top: topPosition + 'px', bottom: bottomPosition + 'px' };
};


function showAlert(scope, caption, message, type) {
    scope.AlertStatus = type;
    scope.AlertMessage = message;
    scope.AlertCaption = caption
    scope.isAlertVisible = true;    
    scope.$apply();
    console.log('in showAlert')
};

function hideAlert (scope) {
    scope.isAlertVisible = false;   
    scope.$apply();    
};

function resetAnimateObject(scope, objModel) {
    //This is a fix for a bug in angular for handling keyframe animations
    scope.$apply(function () {
        objModel.isNgNgridUpdated = false;
    });
}

function animateObject(scope, objModel) {
    if (areNotificationsEnabled == '1') {
        resetAnimateObject(scope, objModel);
        scope.$apply(function() {
            objModel.isNgNgridUpdated = true;
            setTimeout(function () {
                objModel.isNgNgridUpdated = false;
            }, 5000);
        });        
    }
}



function toggleNotifications(enabled) {    
    setStorage('AllowNotifications',  enabled);
    areNotificationsEnabled = enabled;
}

var areNotificationsEnabled = getStorageOrDefault('AllowNotifications', '1');

var env= sessionStorage.env;
var date1 = new Date();
date1.setDate(date1.getDate() -1);
var dt = sessionStorage.dt!=null?new Date(sessionStorage.dt):date1;
var patternFilter = sessionStorage.patternFilter!=null?sessionStorage.patternFilter:'all';

var SADiagApp = angular.module("SADiagApp", ['nvd3ChartDirectives','ui.bootstrap','ngSanitize', 'ngNgridTrowe']);
SADiagApp.filter('offset', function () {
    return function (input, start) {
        return input.slice(start);
    };
});
var SADiagApp1 = angular.module("SADiagApp1",['ngTable','ui.bootstrap', 'ngSanitize', 'ngNgridTrowe']);

function getErrorMsgResponse(response) {
	return "An Error Occured. Server responded with Status " + response.status + " - " +response.statusText + "<br>" + " Reason: " + response.data
}

function getErrorMsg(status, data) {
	return "An Error Occured. Server responded with Status " + status + "<br>" + " Reason: " + data
}