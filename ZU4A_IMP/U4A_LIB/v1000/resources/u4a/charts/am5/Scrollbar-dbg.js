sap.ui.define("u4a.charts.am5.Scrollbar", [
    "u4a/charts/am5/Container"
    
],function(Container){
    "use strict";
    
    let _oScrollbar = Container.extend("u4a.charts.am5.Scrollbar", {
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
         * @function - sprite에 추가할 am5 차트 Instance 생성.
         *************************************************************/
        _createScrollbar : function(orientation){

            let _oParent = this.getParent() || undefined;

            if(typeof _oParent?._oChart?.oRoot === "undefined"){
                return;
            }


            //bullet에 추가할 속성 정보 얻기.
            let _sChartProp = this._getChartProperies();

            _sChartProp.orientation = orientation;

            _sChartProp.visible = this.getVisible();


            this._oChart.oChartInstance = am5.Scrollbar.new(_oParent?._oChart?.oRoot, _sChartProp);


            return this._oChart.oChartInstance;

        },

        
    });

    return _oScrollbar;
    
});