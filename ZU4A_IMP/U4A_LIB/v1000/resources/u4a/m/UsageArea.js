//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.m.UsageArea", [
"sap/ui/core/Control",

], function(Control){
    "use strict";

    var oUsageArea = Control.extend("u4a.m.UsageArea", {
        metadata : {
            library : "u4a.m",
            properties : {
		  		width : { type : "sap.ui.core.CSSSize", defaultValue : "100%" },
		  		height : { type : "sap.ui.core.CSSSize", defaultValue : "100%" }
			},

            defaultAggregation : "contents",

            aggregations : {
              "contents" : { type : "sap.ui.core.Control", multiple : true, singularName: "content" },
            }

        }, // end of metadata

        renderer : function(oRm, oControl){

        	var aCont = oControl.getContents(),
        		iCnt = aCont.length;        		

            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("u4aMUsageArea");
            oRm.addStyle("width", oControl.getWidth());
            oRm.addStyle("height", oControl.getHeight());
            oRm.writeStyles();
            oRm.writeClasses();
            oRm.write(">");

            for(var i = 0; i < iCnt; i++){
            	var oContent = aCont[i];
            	oRm.renderControl(oContent);
            }           

            oRm.write("</div>");

        }, // end of renderer

    });

    return oUsageArea;

});