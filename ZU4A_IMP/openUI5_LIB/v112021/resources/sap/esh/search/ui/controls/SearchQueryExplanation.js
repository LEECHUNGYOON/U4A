/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["sap/ui/core/Control","./TypeGuardForControls","sap/m/Tree","sap/m/StandardTreeItem","sap/ui/model/json/JSONModel"],function(e,t,r,n,o){var a=t["typesafeRender"];var i=e.extend("sap.esh.search.ui.controls.SearchQueryExplanation",{renderer:{apiVersion:2,render:function e(t,i){var s={items:[{text:i.getProperty("text")}]};var c=new o({items:s});var d={items:{path:"conditionTree>/items",template:new n({title:"{conditionTree>text}"})}};var p=new r("".concat(i.getId(),"-conditionTree"),d);p.setModel(c,"conditionTree");a(p,t)}},metadata:{properties:{text:{type:"string",defaultValue:""}}},constructor:function t(r,n){e.prototype.constructor.call(this,r,n)}});return i})})();
//# sourceMappingURL=SearchQueryExplanation.js.map