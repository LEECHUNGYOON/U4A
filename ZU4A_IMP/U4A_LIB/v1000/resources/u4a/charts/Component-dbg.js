sap.ui.define("u4a.charts.am5.Component", [
    "u4a/charts/am5/Container"
    
],function(Container){
    "use strict";
    
    let _oComponent = Container.extend("u4a.charts.am5.Component", {
        metadata : {
            library : "u4a.charts.am5"

        }, /* end of metadata */
    
        init : function(){
            
            Container.prototype.init.apply(this, arguments);
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
        exit : function(){
    
            Container.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */

        
        /*************************************************************
         * @function - visible 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setVisible : function(propValue){

            let _propValue = this._setProperty("visible", propValue);


            //차트 Instance에 visible settings 값 반영 처리.
            this._setChartSettings("visible", _propValue);

        }
        
    });

    return _oComponent;
    
});