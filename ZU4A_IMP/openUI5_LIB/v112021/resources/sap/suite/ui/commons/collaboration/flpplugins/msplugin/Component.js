/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Component","sap/base/Log","../../ServiceContainer"],function(n,a,e){"use strict";var i=a.getLogger("sap.suite.ui.commons.collaboration.flpplugins.msplugin.Component");return n.extend("sap.suite.ui.commons.collaboration.flpplugins.msplugin.Component",{metadata:{properties:{isShareAsLinkEnabled:{name:"isShareAsLinkEnabled",type:"string"},isShareAsTabEnabled:{name:"isShareAsTabEnabled",type:"string"},isShareAsCardEnabled:{name:"isShareAsCardEnabled",type:"string"},applicationId:{name:"applicationId",type:"string"},tenantId:{name:"tenantId",type:"string"},isDirectCommunicationEnabled:{name:"isDirectCommunicationEnabled",type:"string"}}},init:function(){var n=this._loadPluginConfigData();if(n){e.setCollaborationType("COLLABORATION_MSTEAMS",n)}else{i.error("Collaboration configuration for Microsoft Teams Integration could not be loaded.")}},_loadPluginConfigData:function(){var n=this.getComponentData();if(n){return n.config}}})});
//# sourceMappingURL=Component.js.map