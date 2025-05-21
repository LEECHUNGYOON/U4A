sap.ui.define("u4a.charts.am5.Chart", [
    "u4a/charts/am5/Container"
    
],function(Container){
    "use strict";
    
    let _oChart = Container.extend("u4a.charts.am5.Chart", {
        metadata : {
            library : "u4a.charts.am5",

        }, /* end of metadata */
    
        init : function(){
            
            Container.prototype.init.apply(this, arguments);
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
        exit : function(){
    
            Container.prototype.exit.apply(this, arguments);
    
        } /* end of exit */
        
    });

    return _oChart;
    
});