//Copyright 2017. INFOCG Inc. all rights reserved.

$("#u4a_css_area").append("<link rel='stylesheet' type='text/css' href='/zu4a_imp/u4a_lib/v1000/css/m/VerticalTimeLine.css'>");

sap.ui.define("u4a.m.VerticalTimeLine", [
'sap/ui/core/Control'

], function(Control){
  "use strict";

	var TimeLine = Control.extend("u4a.m.VerticalTimeLine", {
		metadata : {
			library : "u4a.m",

			properties : {
				headerTitle: { type: "string", defaultValue: "" },
				centerBarColorFrom : { type : "sap.ui.core.CSSColor", defaultValue : "#ffce79" },
				centerBarColorTo : { type : "sap.ui.core.CSSColor", defaultValue : "#9b74ff" }
			},

			defaultAggregation : "VerticalTimeLineItems",

			aggregations : {
				"VerticalTimeLineItems" : { type : "u4a.m.VerticalTimeLineItem", multiple : true, singularName: "VerticalTimeLineItem" }
			}

		},  //end metadata

		renderer : function(oRm, oControl) {

			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("U4A_VTLineArea U4A_VTLineArea_content");
			oRm.writeClasses();
			oRm.write(">");

			// Header Title 영역
			oControl.renderHeaderTitle(oRm, oControl);

			// timeline bar 영역
			oRm.write("<div");
			oRm.addClass("U4A_VTLine_bar");
			oRm.writeClasses();

			// TimeLine 가운데 라인 색상
			var gradient = "linear-gradient(" + oControl.getCenterBarColorFrom() + ", " + oControl.getCenterBarColorTo() + ")";
			oRm.addStyle("background-image", gradient);
			oRm.writeStyles();

			oRm.write(">");
			oRm.write("</div>"); // end of U4A_VTLine_bar

			// VerticalTimeLineItem 렌더 영역
			oControl.renderChildren(oRm, oControl.getVerticalTimeLineItems());

			// 렌더링 종료 태그
			oControl.renderEnd(oRm);

		},

		renderHeaderTitle : function(oRm, oControl){

			oRm.write("<h2");
			oRm.addClass("U4A_VTLineArea_content_title");
			oRm.writeClasses();
			oRm.write(">");
			oRm.writeEscaped(oControl.getHeaderTitle());

			oRm.write("</h2>");

			oRm.write("<div");
			oRm.addClass("U4A_VTLineArea_content_inner");
			oRm.writeClasses();
			oRm.write(">");

			oRm.write("<div");
			oRm.addClass("U4A_VTLine");
			oRm.writeClasses();
			oRm.write(">");

		},

		renderChildren : function(oRm, aChildren){

			aChildren.forEach(oRm.renderControl, oRm);

		},

		renderEnd : function(oRm){

			oRm.write("</div>"); // end of U4A_VTLine
			oRm.write("</div>"); // end of U4A_VTLineArea_content_inner
			oRm.write("</div>"); // end of U4A_VTLineArea

		}

	});

  return TimeLine;

});