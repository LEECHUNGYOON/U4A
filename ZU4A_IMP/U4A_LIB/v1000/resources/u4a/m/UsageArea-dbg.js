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

            /**
             * @since   2025-11-20 10:27:36
             * @version v3.5.6-16
             * @author  PES
             * @description
             *  u4a.m.UsageArea UI의 tooltip 속성 적용 처리
             *  (WS 3.0에서 u4a.m.UsageArea의 속성 정보중
             *  sap.ui.core.Control의 속성을 사용할 수 있게되어
             *  tooltip 속성을 적용함)
             */
            oRm.attr("title", oControl.getTooltip_Text());

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