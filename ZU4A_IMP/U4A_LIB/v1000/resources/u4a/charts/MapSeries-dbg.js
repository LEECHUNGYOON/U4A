sap.ui.define("u4a.charts.am5.MapSeries", [
    "u4a/charts/am5/Series"
    
],function(Series){
    "use strict";

   
    let _oMapSeries = Series.extend("u4a.charts.am5.MapSeries", {
        metadata : {
            library : "u4a.charts.am5"
    
        }, /* end of metadata */
    
        init : function(){
            
            Series.prototype.init.apply(this, arguments);
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
        
        exit : function(){
    
            Series.prototype.exit.apply(this, arguments);
    
        } /* end of exit */


    });

    return _oMapSeries;
    
});