sap.ui.define("u4a.charts.am5.BulletItem", [
    "u4a/charts/am5/Graphics"
    
],function(Graphics){
    "use strict";


    let _oBulletItem = Graphics.extend("u4a.charts.am5.BulletItem", {
        metadata : {
            library : "u4a.charts.am5",

        }, /* end of metadata */
    
        init : function(){
            
            Graphics.prototype.init.apply(this, arguments);
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
        
        exit : function(){
    
            Graphics.prototype.exit.apply(this, arguments);
    
        } /* end of exit */

        
    });

    return _oBulletItem;
    
});
