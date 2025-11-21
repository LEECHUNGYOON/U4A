/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./DateUtils","sap/ui/core/date/UI5Date","sap/ui/core/Core","sap/ui/core/Lib"],function(e,t,i,r){"use strict";var a=function(){throw new Error};a.calculateFeedItemAge=function(a){var s="";if(!e.isValidDate(a)){return s}var g=t.getInstance();a.setMilliseconds(0);g.setMilliseconds(0);var T=i.getConfiguration().getLanguage();var n=r.getResourceBundleFor("sap.suite.ui.commons",T);var E=6e4;var u=E*60;var o=u*24;if(g.getTime()-a.getTime()>=o){var c=parseInt((g.getTime()-a.getTime())/o,10);if(c===1){s=n.getText("FEEDTILE_DAY_AGO",[c])}else{s=n.getText("FEEDTILE_DAYS_AGO",[c])}}else if(g.getTime()-a.getTime()>=u){var l=parseInt((g.getTime()-a.getTime())/u,10);if(l===1){s=n.getText("FEEDTILE_HOUR_AGO",[l])}else{s=n.getText("FEEDTILE_HOURS_AGO",[l])}}else{var I=parseInt((g.getTime()-a.getTime())/E,10);if(I===1){s=n.getText("FEEDTILE_MINUTE_AGO",[I])}else{s=n.getText("FEEDTILE_MINUTES_AGO",[I])}}return s};return a},true);
//# sourceMappingURL=FeedItemUtils.js.map