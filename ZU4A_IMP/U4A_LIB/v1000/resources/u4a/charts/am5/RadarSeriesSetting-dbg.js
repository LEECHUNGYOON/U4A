sap.ui.define("u4a.charts.am5.RadarSeriesSetting", [
    "sap/ui/core/Element",
    
],function(Element){
    "use strict";
    
    let _oRadarSeriesSetting = Element.extend("u4a.charts.am5.RadarSeriesSetting", {
        metadata : {
            library : "u4a.charts.am5",

            aggregations : {

                //막대 설정 aggregation.
                bars : { type : "u4a.charts.am5.RadarBarSetting", multiple : true, singularName: "bar" },

                //라인 설정 aggregation.
                lines : { type : "u4a.charts.am5.RadarLineSetting", multiple : true, singularName: "line" }

            }
    
        }, /* end of metadata */
    
        init : function(){
    
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        } /* end of renderer */

    });

    return _oRadarSeriesSetting;
    
});