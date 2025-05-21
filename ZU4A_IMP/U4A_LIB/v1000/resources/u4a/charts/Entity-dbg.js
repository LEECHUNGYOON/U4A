sap.ui.define("u4a.charts.am5.Entity", [    
    "u4a/charts/am5/Settings"
    
],function(Settings){
    "use strict";
    
    let _oEntity = Settings.extend("u4a.charts.am5.Entity", {
        metadata : {
            library : "u4a.charts.am5"

        }, /* end of metadata */

        init : function(){

            Settings.prototype.init.apply(this, arguments);

        }, /* end of init */

        renderer : function(oRm, oControl){

        }, /* end of renderer */

        exit : function(){

            Settings.prototype.exit.apply(this, arguments);

        } /* end of exit */
        
    });

    return _oEntity;
    
});
