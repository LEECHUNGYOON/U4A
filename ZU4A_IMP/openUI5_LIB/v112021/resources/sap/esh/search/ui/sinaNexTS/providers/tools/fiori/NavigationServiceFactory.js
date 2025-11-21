/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define([],function(){var i;function n(){var n,e,o,r;if(i){return i}var u=typeof window!=="undefined"?(n=window)===null||n===void 0?void 0:(e=n.sap)===null||e===void 0?void 0:(o=e.ushell)===null||o===void 0?void 0:(r=o["Container"])===null||r===void 0?void 0:r["getServiceAsync"]:null;if(u){i=u("CrossApplicationNavigation")}else{i=Promise.resolve(undefined)}return i}var e={__esModule:true};e.getNavigationService=n;return e})})();
//# sourceMappingURL=NavigationServiceFactory.js.map