sap.ui.define("u4a.charts.am5.SeriesSetting", [
    "sap/ui/core/Element",
    "u4a.charts.am5.Sprite"
    
],function(Element, Sprite){
    "use strict";
    
    let _oSeriesSetting = Element.extend("u4a.charts.am5.SeriesSetting", {
        metadata : {
            library : "u4a.charts.am5",

            aggregations : {

                //막대 설정 aggregation.
                bars : { type : "u4a.charts.am5.BarSetting", multiple : true, singularName: "bar" },

                //라인 설정 aggregation.
                lines : { type : "u4a.charts.am5.LineSetting", multiple : true, singularName: "line" }

            }
    
        }, /* end of metadata */
    
        init : function(){
    
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        } /* end of renderer */

    });

    return _oSeriesSetting;
    
});