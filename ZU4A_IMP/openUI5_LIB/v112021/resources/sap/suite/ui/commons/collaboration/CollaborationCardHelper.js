/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object"],function(t){"use strict";var a="/sap/opu/odata4/sap/aps_ui_card_srv/srvd_a2x/sap/";var e=a+"aps_ui_card/0001/";var n="Card";var r=a+"aps_ui_card/0001/"+n;var o="POST";var i="HEAD";var s=t.extend("sap.suite.ui.commons.collaboration.CollaborationCardHelper");s.fetchCSRFToken=function(){return fetch(e,{method:i,headers:{"X-CSRF-Token":"Fetch"}}).then(function(t){var a=t.headers.get("X-CSRF-Token");if(t.ok&&a){return a}return undefined})};s.postCard=function(t,a){return this.fetchCSRFToken().then(function(e){var n=btoa(JSON.stringify(a));var i=JSON.stringify({content:n,card_id:t});return fetch(r,{method:o,headers:{"X-CSRF-Token":e,"content-type":"application/json;odata.metadata=minimal;charset=utf-8"},body:i}).then(function(t){return t.json()})})};return s});
//# sourceMappingURL=CollaborationCardHelper.js.map