//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define([
"sap/ui/core/Control"
], function(Control){
    "use strict";
    

    var _oHorizontalGutter = Control.extend("u4a.m.HorizontalGutter", {
        metadata : {
            library : "u4a.m",
            properties : {
                //height
                height : { type : "sap.ui.core.CSSSize", defaultValue: "0.125rem" },

                //width
                width : { type : "sap.ui.core.CSSSize", defaultValue: "100%"},

                //가로선 두께.
                thickness : { type : "sap.ui.core.CSSSize", defaultValue: "0.125rem" }

            }

        }, /* end of metadata */

        renderer : {
            apiVersion: 2,
            render: function(oRm, oControl) {

                oRm.openStart("div", oControl);

                //HorizontalGutter의 height 영역.
                oRm.style("height", oControl.getHeight());

                //HorizontalGutter의 width.
                oRm.style("width", oControl.getWidth());

                //HorizontalGutter의 가로선 표현 처리.
                oRm.style("background-image", "linear-gradient(#d9d9d9, #d9d9d9)");

                //HorizontalGutter의 세로 정렬.
                oRm.style("background-position", "center");

                oRm.style("background-repeat", "no-repeat");

                //HorizontalGutter의 가로선 두께.
                oRm.style("background-size", `100% ${oControl.getThickness()}`);

                oRm.openEnd();

                oRm.close("div");
            }
        } /* end of renderer */

            

    });

    return _oHorizontalGutter;

});