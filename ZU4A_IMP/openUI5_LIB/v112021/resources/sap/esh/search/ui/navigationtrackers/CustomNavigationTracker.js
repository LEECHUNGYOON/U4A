/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../error/errors"],function(n){function e(n){return n&&n.__esModule&&typeof n.default!=="undefined"?n.default:n}var r=e(n);function o(n){return function(e){try{n.config.beforeNavigation(n)}catch(e){var o=new r.ConfigurationExitError("beforeNavigation",n.config.applicationComponent,e);throw o}}}var t={__esModule:true};t.generateCustomNavigationTracker=o;return t})})();
//# sourceMappingURL=CustomNavigationTracker.js.map