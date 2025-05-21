sap.ui.define("u4a.charts.am5.Background", [
    "u4a/charts/am5/Graphics"
    
],function(Rectangle){
    "use strict";

  
    let _oBackground = Rectangle.extend("u4a.charts.am5.Background", {
        metadata : {
            library : "u4a.charts.am5"
    
        }, /* end of metadata */
    
        init : function(){

            Rectangle.prototype.init.apply(this, arguments);
    
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
        
        exit : function(){
    
            Rectangle.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */


        /*************************************************************
         * @function - 차트 출력 데이터 구성.
         *************************************************************/
        _getChartData : function(){

            let _sChartData = {};

            //컬럼의 속성정보 얻기.
            _sChartData = this._getChartProperies();

            //현재 UI의 sid 정보 매핑.
            _sChartData._sId = this.getId();

            _sChartData.visible = this.getVisible();
            
            return _sChartData;

        },


        /*************************************************************
         * @function - sprite에 추가할 am5 차트 Instance 생성.
         *************************************************************/
        _createSprite : function(){

            let _oParent = this.getParent() || undefined;

            if(typeof _oParent?._oChart?.oRoot === "undefined"){
                return;
            }


            //bullet에 추가할 속성 정보 얻기.
            let _sChartProp = this._getChartProperies();


            _sChartProp.visible = this.getVisible();


            this._oChart.oChartInstance = am5.Rectangle.new(_oParent?._oChart?.oRoot, _sChartProp);


            return this._oChart.oChartInstance;


        }
        
    });

    return _oBackground;
    
});