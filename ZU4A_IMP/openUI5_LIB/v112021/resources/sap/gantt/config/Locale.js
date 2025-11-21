/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element","sap/ui/core/Configuration","sap/gantt/misc/Format","sap/ui/core/format/TimezoneUtil"],function(e,t,i,n){"use strict";var a=e.extend("sap.gantt.config.Locale",{metadata:{library:"sap.gantt",properties:{timeZone:{type:"string"},utcdiff:{type:"string",defaultValue:"000000"},utcsign:{type:"string",defaultValue:"+"},dstHorizons:{type:"object[]",defaultValue:[]}},designtime:"sap/ui/dt/designtime/notAdaptable.designtime"}});a.prototype.getTimeZone=function(){if(i._getEnableDateTimezoneFormatter()){return n.getLocalTimezone()}var e=this.getProperty("timeZone");return e||t.getTimezone()};a.prototype.getFormattedDate=function(e,t){return e.format(t,this.getTimeZone())};return a},true);
//# sourceMappingURL=Locale.js.map