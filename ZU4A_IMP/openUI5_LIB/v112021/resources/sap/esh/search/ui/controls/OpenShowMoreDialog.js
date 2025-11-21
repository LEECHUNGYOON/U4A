/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){function e(e,t,n){if(n){return t?t(e):e}if(!e||!e.then){e=Promise.resolve(e)}return t?e.then(t):e}function t(e){return function(){for(var t=[],n=0;n<arguments.length;n++){t[n]=arguments[n]}try{return Promise.resolve(e.apply(this,t))}catch(e){return Promise.reject(e)}}}sap.ui.define(["../SearchFacetDialogModel","./SearchFacetDialog","../eventlogging/UserEvents"],function(n,r,o){function a(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const i=t(function(t,n){var r=new c({searchModel:t});return e(r.initAsync(),function(){r.setData(t.getData());r.config=t.config;r.sinaNext=t.sinaNext;r.prepareFacetList();var e={selectedAttribute:n?n:"",selectedTabBarIndex:0};var o=new u("".concat(t.config.id,"-SearchFacetDialog"),e);o.setModel(r);o.setModel(t,"searchModel");o.open();t.eventLogger.logEvent({type:s.FACET_SHOW_MORE,referencedAttribute:n})})});var c=a(n);var u=a(r);var s=o["UserEventType"];var l={__esModule:true};l.openShowMoreDialog=i;return l})})();
//# sourceMappingURL=OpenShowMoreDialog.js.map