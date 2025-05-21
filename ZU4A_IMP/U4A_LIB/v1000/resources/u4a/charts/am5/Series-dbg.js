sap.ui.define("u4a.charts.am5.Series", [
    "u4a/charts/am5/Component"
    
],function(Component){
    "use strict";
    
    let _oSeries = Component.extend("u4a.charts.am5.Series", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //차트 요소의 채우기 색상.(#ffffff)(am5.Series)
                fill : { type : "sap.ui.core.CSSColor", defaultValue : "" },


                //범례 TEXT.(am5.Series)
                //name 속성에 값을 지정했더라도 legendLabelText에 값을 지정한경우
                //legendLabelText에 지정된 범례 text를 우선으로 적용한다.
                legendLabelText : { type : "string", defaultValue : "" },


                //차트 요소의 테두리 색상.(#ffffff)(am5.Series)
                stroke : { type : "sap.ui.core.CSSColor", defaultValue : "" },


                //차트 요소의 테두리 두께.(am5.Graphics)
                strokeWidth : { type : "int", defaultValue : 0 },

                
                //차트 요소의 테두리 점선 표현.(am5.Graphics)
                strokeDasharray : { type : "int", defaultValue : 0 },


                //툴팁 Text.
                //마우스 커서를 해당 차트 요소에 갖다 댈 경우 tooltipText에 입력된 정보를 출력한다.
                tooltipText : { type : "string" }
                
            }
    
        }, /* end of metadata */
    
        init : function(){
            
            Component.prototype.init.apply(this, arguments);
    
        }, /* end of init */
        
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
        exit : function(){
    
            Component.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */


        /*************************************************************
         * @function - XYSeries의 setting 값 변경 이후 화면 갱신 처리.
         *  valueYField와 같은 setting은 값을 반영하더라도 화면이 
         *  갱신되지 않는 문제가 있기에 차트 데이터를 다시 반영처리 하는 예외로직.
         *************************************************************/
        _updateSeries: function(){

            if(typeof this?._oChart?.oChartInstance?.data?.values === "undefined"){
                return;
            }

            let _aValues = this._oChart.oChartInstance.data.values;

            this._oChart.oChartInstance.data.setAll([]);

            this._oChart.oChartInstance.data.setAll(_aValues);

        },


        /*************************************************************
         * @function - 툴팁 출력 정보 구성.
         *************************************************************/
        _getTooltipData : function(){

            let _sChartData = {};

            
            //입력한 툴팁 정보 얻기.
            _sChartData.labelText = this.getTooltipText();

            //default 툴팁 활성화.
            _sChartData.forceHidden = false;


            //툴팁 정보가 입력되지 않은경우 툴팁 비활성화 처리.
            //(차트 요소에 마우스 커서를 갖다 댈 경우 공백의 툴팁이 출력되기에
            //툴팁 text가 없다면 툴팁을 비활성화 처리함.)
            if(typeof _sChartData.labelText === "undefined"){
                _sChartData.forceHidden = true;
            }

            return _sChartData;


        },


        /*************************************************************
         * @function - fill 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setFill : function(propValue){

            this._setProperty("fill", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();

        },


        /*************************************************************
         * @function - name 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setName : function(propValue){

            this._setProperty("name", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();

        },


        /*************************************************************
         * @function - legendLabelText 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setLegendLabelText : function(propValue){

            this._setProperty("legendLabelText", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();

        },


        /*************************************************************
         * @function - stroke 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setStroke : function(propValue){

            this._setProperty("stroke", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();

        },


        /*************************************************************
         * @function - strokeWidth 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setStrokeWidth : function(propValue){

            this._setProperty("strokeWidth", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();

        },


        /*************************************************************
         * @function - strokeDasharray 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setStrokeDasharray : function(propValue){

            this._setProperty("strokeDasharray", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();

        },


        /*************************************************************
         * @function - tooltipText 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setTooltipText : function(propValue){

            this._setProperty("tooltipText", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();

        }
       
        
    });

    return _oSeries;
    
});