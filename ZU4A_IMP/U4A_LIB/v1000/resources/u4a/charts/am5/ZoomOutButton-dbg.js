sap.ui.define("u4a.charts.am5.ZoomOutButton", [
    "u4a/charts/am5/Container"
    
],function(Container){
    "use strict";

    
    let _oZoomOutButton = Container.extend("u4a.charts.am5.ZoomOutButton", {
        metadata : {
            library : "u4a.charts.am5",

            aggregations : {
                //배경색 aggregation.
                background : { type : "u4a.charts.am5.Background", multiple : false }
            }
            
    
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
         * @function - 차트 출력 데이터 구성.
         *************************************************************/
        _getChartData : function(){

            let _sChartData = {};

            //컬럼의 속성정보 얻기.
            _sChartData = this._getChartProperies();

            //현재 UI의 sid 정보 매핑.
            _sChartData._sId = this.getId();
            
            return _sChartData;

        },


        /*************************************************************
         * @function - ZoomOutButton Instance 생성.
         *************************************************************/
        _createZoomOutButton : function(){

            let _oParent = this.getParent() || undefined;

            if(typeof _oParent?._oChart?.oRoot === "undefined"){
                return;
            }


            //bullet에 추가할 속성 정보 얻기.
            let _sChartProp = this._getChartProperies();


            this._oChart.oChartInstance = am5.Button.new(_oParent?._oChart?.oRoot, _sChartProp);


            return this._oChart.oChartInstance;

        }

    });

    return _oZoomOutButton;
    
});