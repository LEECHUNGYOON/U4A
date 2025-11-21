/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["sap/esh/search/ui/SearchHelper","sap/f/GridContainer","sap/m/ImageContent","sap/m/GenericTile","sap/m/TileContent","../sinaNexTS/sina/NavigationTarget"],function(e,t,n,r,i,a){var o=a["NavigationTarget"];var s=t.extend("sap.esh.search.ui.controls.SearchResultGrid",{renderer:{apiVersion:2},constructor:function e(a,s){var l=this;t.prototype.constructor.call(this,a,s);t.prototype.constructor.apply(this,[a,s]);this.bindAggregation("items",{path:"/results",factory:function e(t,a){var s=a.getObject();var c=new n({src:s.imageUrl||s.titleIconUrl});if(s.imageFormat==="round"){c.addStyleClass("sapUshellResultListGrid-ImageContainerRound")}return new r("",{header:s.title,subheader:s.titleDescription,tileContent:new i({content:c}),press:function e(t){var n=l.getModel().getProperty(t.getSource().getBindingContext().getPath());var r=n.titleNavigation;if(r instanceof o){r.performNavigation()}}})}});this.addStyleClass("sapUshellResultListGrid")},onAfterRendering:function n(r){t.prototype.onAfterRendering.call(this,r);e.boldTagUnescaper(this.getDomRef())}});return s})})();
//# sourceMappingURL=SearchResultGrid.js.map