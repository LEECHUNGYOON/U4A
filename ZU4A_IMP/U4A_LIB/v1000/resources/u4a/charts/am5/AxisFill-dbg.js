sap.ui.define("u4a.charts.am5.AxisFill", [
    "u4a/charts/am5/Graphics"
    
],function(Graphics){
    "use strict";
    
    let _oAxisFill = Graphics.extend("u4a.charts.am5.AxisFill", {
        metadata : {
            library : "u4a.charts.am5"
    
    
        }, /* end of metadata */
    
        init : function(){
            
            Graphics.prototype.init.apply(this, arguments);
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
        
        exit : function(){
    
            Graphics.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */


        /*************************************************************
         * @function - 차트 출력 데이터 구성.
         *************************************************************/
        _getChartData : function(){

            let _sChartData = {};

            //라벨의 속성정보 얻기.
            _sChartData = this._getChartProperies();

            _sChartData.visible = this.getVisible();

            //현재 UI의 sid 정보 매핑.
            _sChartData._sId = this.getId();
            
            return _sChartData;

        },
        
    });

    return _oAxisFill;
    
});