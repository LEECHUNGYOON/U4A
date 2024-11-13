//Copyright 2017. INFOCG Inc. all rights reserved.

u4a.m.ImageMarkShapeType = { Rect : "rect", Circle : "circle",  Poly : "poly" };

// 2024-11-13 soccerhs --- start
// 1.120.21 버전에서 Custom Enum 등록 로직 추가
if( sap && 
    sap.ui && 
    sap.ui.base && 
    sap.ui.base.DataType && 
    sap.ui.base.DataType.registerEnum && 
    typeof sap.ui.base.DataType.registerEnum === "function"){

	sap.ui.base.DataType.registerEnum("u4a.m.ImageMarkShapeType", u4a.m.ImageMarkShapeType);

}
// 2024-11-13 soccerhs --- end

sap.ui.define("u4a.m.ImageMark", [
"sap/ui/core/Element"

], function(Element){
    "use strict";

    var ImageMark = Element.extend("u4a.m.ImageMark", {
		metadata : {
				library : "u4a.m",
				properties : {
					shape : { type : "u4a.m.ImageMarkShapeType", defaultValue : u4a.m.ImageMarkShapeType.Rect },
					coords : { type : "string", defaultValue : null },
					text : { type : "string", defaultValue : null },
					fill : { type : "boolean", defaultValue : true },
					fillColor : { type : "sap.ui.core.CSSColor", defaultValue : "#000000" },
					fillOpacity : { type : "float", defaultValue: 0.2 },
					stroke : { type : "boolean", defaultValue : true },
					strokeColor : { type : "sap.ui.core.CSSColor", defaultValue : "#ff0000" },
					strokeOpacity : { type : "float", defaultValue: 1 },
					strokeWidth: { type: "int", defaultValue: 1 },
					alwaysOn: { type : "boolean", defaultValue : false },
					shadow: { type : "boolean", defaultValue : false },
					shadowX: { type : "int", defaultValue: 0 },
					shadowY: { type : "int", defaultValue: 0 },
					shadowRadius: { type : "int", defaultValue: 6 },
					shadowColor: { type : "sap.ui.core.CSSColor", defaultValue : "#000000" },
					shadowOpacity: { type : "float", defaultValue: 0.8 }
				},
				events : {
					"selectMark" : {
						allowPreventDefault: true
					}
				}

		} // end of metadata

    });

    return ImageMark;

});