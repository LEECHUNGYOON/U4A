sap.ui.define("u4a.charts.am5.Hand", [
    "u4a/charts/am5/Graphics"
    
],function(Graphics){
    "use strict";
    
    let _oHand = Graphics.extend("u4a.charts.am5.Hand", {
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

            //라인의 속성정보 얻기.
            _sChartData = this._getChartProperies();

            _sChartData._sId = this.getId();

            _sChartData.visible = this.getVisible();

            return _sChartData;

        },


        /*************************************************************
         * @function - fill 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setFill : function(propValue){
            
            let _propValue = this._setProperty("fill", propValue);

            //stroke에 적용된 값이 존재하지 않는경우 default theme에 적용한
            //stroke 색상 코드를 매핑.
            //am5.color(""); 처리시 오류가 발생함.
            //am5.color(""); 에서 발생한 오류를 try catch 처리 하여 catch에서 return 처리시 
            //이전 색상이 남아있기에 공백의 색상 정보가 입력된 경우 default 색상 정보를 매핑.
            //(잘못된 색상 코드에 대한 처리를 하지 않음.)
            if(typeof _propValue === "undefined" || _propValue === ""){
                _propValue = sap.ui.core.theming.Parameters.get("sapTextColor");
            }


            //차트 Instance에 fill settings 값 반영 처리.
            this._setChartSettings("fill", _propValue);

        }
        
    });

    return _oHand;
    
});