//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define([
"sap/ui/core/Control",
"u4a/m/RowLayoutRenderer"

], function(Control, RowLayoutRenderer){
    "use strict";

    var _oRowLayout = Control.extend("u4a.m.RowLayout", {
        metadata : {
            library : "u4a.m",
            properties : {

                //RowLayout의 가로 크기.
                width : { type : "sap.ui.core.CSSSize", defaultValue : "100%"},

                //RowLayout의 세로 크기.
                height : { type : "sap.ui.core.CSSSize" }


            },

            defaultAggregation : "content",

            aggregations : {
                content : { type : "sap.ui.core.Control", multiple : true, singularName: "content" }
            }


        }, /* end of metadata */

        renderer : RowLayoutRenderer


    });

    return _oRowLayout;

});