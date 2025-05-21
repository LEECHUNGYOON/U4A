sap.ui.define("u4a.charts.am5.PercentChart", [
    "u4a/charts/am5/SerialChart"
    
],function(SerialChart){
    "use strict";
    
    let _oPercentChart = SerialChart.extend("u4a.charts.am5.PercentChart", {
        metadata : {
            library : "u4a.charts.am5"            
    
        }, /* end of metadata */
    
        init : function(){

            SerialChart.prototype.init.apply(this, arguments);
    
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
        exit : function(){
    
            SerialChart.prototype.exit.apply(this, arguments);
    
        } /* end of exit */
        
    });

    return _oPercentChart;
    
});